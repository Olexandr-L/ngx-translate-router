import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom, Observable } from 'rxjs';
import { Location } from '@angular/common';
import { CacheMechanism, LocalizeRouterSettings } from './localize-router.config';
import { Inject, Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
import * as i2 from "@angular/common";
import * as i3 from "./localize-router.config";
const COOKIE_EXPIRY = 30; // 1 month
/**
 * Abstract class for parsing localization
 */
export class LocalizeParser {
    /**
     * Loader constructor
     */
    constructor(translate, location, settings) {
        this.translate = translate;
        this.location = location;
        this.settings = settings;
    }
    /**
   * Prepare routes to be fully usable by ngx-translate-router
   * @param routes
   */
    /* private initRoutes(routes: Routes, prefix = '') {
      routes.forEach(route => {
        if (route.path !== '**') {
          const routeData: any = route.data = route.data || {};
          routeData.localizeRouter = {};
          routeData.localizeRouter.fullPath = `${prefix}/${route.path}`;
          if (route.children && route.children.length > 0) {
            this.initRoutes(route.children, routeData.localizeRouter.fullPath);
          }
        }
      });
    } */
    /**
     * Initialize language and routes
     */
    init(routes) {
        let selectedLanguage;
        // this.initRoutes(routes);
        this.routes = routes;
        if (!this.locales || !this.locales.length) {
            return Promise.resolve();
        }
        /** detect current language */
        const locationLang = this.getLocationLang();
        const browserLang = this._getBrowserLang();
        if (this.settings.defaultLangFunction) {
            this.defaultLang = this.settings.defaultLangFunction(this.locales, this._cachedLang, browserLang);
        }
        else {
            this.defaultLang = this._cachedLang || browserLang || this.locales[0];
        }
        selectedLanguage = locationLang || this.defaultLang;
        this.translate.setDefaultLang(this.defaultLang);
        let children = [];
        /** if set prefix is enforced */
        if (this.settings.alwaysSetPrefix) {
            const baseRoute = { path: '', redirectTo: this.defaultLang, pathMatch: 'full' };
            /** extract potential wildcard route */
            const wildcardIndex = routes.findIndex((route) => route.path === '**');
            if (wildcardIndex !== -1) {
                this._wildcardRoute = routes.splice(wildcardIndex, 1)[0];
            }
            children = this.routes.splice(0, this.routes.length, baseRoute);
        }
        else {
            children = [...this.routes]; // shallow copy of routes
        }
        /** exclude certain routes */
        for (let i = children.length - 1; i >= 0; i--) {
            if (children[i].data && children[i].data['skipRouteLocalization']) {
                if (this.settings.alwaysSetPrefix) {
                    // add directly to routes
                    this.routes.push(children[i]);
                }
                // remove from routes to translate only if doesn't have to translate `redirectTo` property
                if (children[i].redirectTo === undefined || !(children[i].data['skipRouteLocalization']['localizeRedirectTo'])) {
                    children.splice(i, 1);
                }
            }
        }
        /** append children routes */
        if (children && children.length) {
            if (this.locales.length > 1 || this.settings.alwaysSetPrefix) {
                this._languageRoute = { children: children };
                this.routes.unshift(this._languageRoute);
            }
        }
        /** ...and potential wildcard route */
        if (this._wildcardRoute && this.settings.alwaysSetPrefix) {
            this.routes.push(this._wildcardRoute);
        }
        /** translate routes */
        return firstValueFrom(this.translateRoutes(selectedLanguage));
    }
    initChildRoutes(routes) {
        this._translateRouteTree(routes);
        return routes;
    }
    /**
     * Translate routes to selected language
     */
    translateRoutes(language) {
        return new Observable((observer) => {
            this._cachedLang = language;
            if (this._languageRoute) {
                this._languageRoute.path = language;
            }
            this.translate.use(language).subscribe((translations) => {
                this._translationObject = translations;
                this.currentLang = language;
                if (this._languageRoute) {
                    this._translateRouteTree(this._languageRoute.children, true);
                    // if there is wildcard route
                    if (this._wildcardRoute && this._wildcardRoute.redirectTo) {
                        this._translateProperty(this._wildcardRoute, 'redirectTo', true);
                    }
                }
                else {
                    this._translateRouteTree(this.routes, true);
                }
                observer.next(void 0);
                observer.complete();
            });
        });
    }
    /**
     * Translate the route node and recursively call for all it's children
     */
    _translateRouteTree(routes, isRootTree) {
        routes.forEach((route) => {
            const skipRouteLocalization = (route.data && route.data['skipRouteLocalization']);
            const localizeRedirection = !skipRouteLocalization || skipRouteLocalization['localizeRedirectTo'];
            if (route.redirectTo && localizeRedirection) {
                const prefixLang = route.redirectTo.indexOf('/') === 0 || isRootTree;
                this._translateProperty(route, 'redirectTo', prefixLang);
            }
            if (skipRouteLocalization) {
                return;
            }
            if (route.path !== null && route.path !== undefined /* && route.path !== '**'*/) {
                this._translateProperty(route, 'path');
            }
            if (route.children) {
                this._translateRouteTree(route.children);
            }
            if (route.loadChildren && route._loadedRoutes?.length) {
                this._translateRouteTree(route._loadedRoutes);
            }
        });
    }
    /**
     * Translate property
     * If first time translation then add original to route data object
     */
    _translateProperty(route, property, prefixLang) {
        // set property to data if not there yet
        const routeData = route.data = route.data || {};
        if (!routeData.localizeRouter) {
            routeData.localizeRouter = {};
        }
        if (!routeData.localizeRouter[property]) {
            routeData.localizeRouter = { ...routeData.localizeRouter, [property]: route[property] };
        }
        const result = this.translateRoute(routeData.localizeRouter[property]);
        route[property] = prefixLang ? this.addPrefixToUrl(result) : result;
    }
    get urlPrefix() {
        if (this.settings.alwaysSetPrefix || this.currentLang !== this.defaultLang) {
            return this.currentLang ? this.currentLang : this.defaultLang;
        }
        else {
            return '';
        }
    }
    /**
     * Add current lang as prefix to given url.
     */
    addPrefixToUrl(url) {
        const splitUrl = url.split('?');
        const isRootPath = splitUrl[0].length === 1 && splitUrl[0] === '/';
        splitUrl[0] = splitUrl[0].replace(/\/$/, '');
        const joinedUrl = splitUrl.join('?');
        if (this.urlPrefix === '') {
            return joinedUrl;
        }
        if (!joinedUrl.startsWith('/') && !isRootPath) {
            return `${this.urlPrefix}/${joinedUrl}`;
        }
        return `/${this.urlPrefix}${joinedUrl}`;
    }
    /**
     * Translate route and return observable
     */
    translateRoute(path) {
        const queryParts = path.split('?');
        if (queryParts.length > 2) {
            throw Error('There should be only one query parameter block in the URL');
        }
        const pathSegments = queryParts[0].split('/');
        /** collect observables  */
        return pathSegments
            .map((part) => part.length ? this.translateText(part) : part)
            .join('/') +
            (queryParts.length > 1 ? `?${queryParts[1]}` : '');
    }
    /**
     * Get language from url
     */
    getLocationLang(url) {
        const queryParamSplit = (url || this.location.path()).split(/[\?;]/);
        let pathSlices = [];
        if (queryParamSplit.length > 0) {
            pathSlices = queryParamSplit[0].split('/');
        }
        if (pathSlices.length > 1 && this.locales.indexOf(pathSlices[1]) !== -1) {
            return pathSlices[1];
        }
        if (pathSlices.length && this.locales.indexOf(pathSlices[0]) !== -1) {
            return pathSlices[0];
        }
        return null;
    }
    /**
     * Get user's language set in the browser
     */
    _getBrowserLang() {
        return this._returnIfInLocales(this.translate.getBrowserLang());
    }
    /**
     * Get language from local storage or cookie
     */
    get _cachedLang() {
        if (!this.settings.useCachedLang) {
            return;
        }
        if (this.settings.cacheMechanism === CacheMechanism.LocalStorage) {
            return this._cacheWithLocalStorage();
        }
        if (this.settings.cacheMechanism === CacheMechanism.SessionStorage) {
            return this._cacheWithSessionStorage();
        }
        if (this.settings.cacheMechanism === CacheMechanism.Cookie) {
            return this._cacheWithCookies();
        }
    }
    /**
     * Save language to local storage or cookie
     */
    set _cachedLang(value) {
        if (!this.settings.useCachedLang) {
            return;
        }
        if (this.settings.cacheMechanism === CacheMechanism.LocalStorage) {
            this._cacheWithLocalStorage(value);
        }
        if (this.settings.cacheMechanism === CacheMechanism.SessionStorage) {
            this._cacheWithSessionStorage(value);
        }
        if (this.settings.cacheMechanism === CacheMechanism.Cookie) {
            this._cacheWithCookies(value);
        }
    }
    /**
     * Cache value to local storage
     */
    _cacheWithLocalStorage(value) {
        try {
            if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') {
                return;
            }
            if (value) {
                window.localStorage.setItem(this.settings.cacheName, value);
                return;
            }
            return this._returnIfInLocales(window.localStorage.getItem(this.settings.cacheName));
        }
        catch (e) {
            // weird Safari issue in private mode, where LocalStorage is defined but throws error on access
            return;
        }
    }
    /**
     * Cache value to session storage
     */
    _cacheWithSessionStorage(value) {
        try {
            if (typeof window === 'undefined' || typeof window.sessionStorage === 'undefined') {
                return;
            }
            if (value) {
                window.sessionStorage.setItem(this.settings.cacheName, value);
                return;
            }
            return this._returnIfInLocales(window.sessionStorage.getItem(this.settings.cacheName));
        }
        catch (e) {
            return;
        }
    }
    /**
     * Cache value via cookies
     */
    _cacheWithCookies(value) {
        try {
            if (typeof document === 'undefined' || typeof document.cookie === 'undefined') {
                return;
            }
            const name = encodeURIComponent(this.settings.cacheName);
            if (value) {
                let cookieTemplate = `${this.settings.cookieFormat}`;
                cookieTemplate = cookieTemplate
                    .replace('{{value}}', `${name}=${encodeURIComponent(value)}`)
                    .replace(/{{expires:?(\d+)?}}/g, (fullMatch, groupMatch) => {
                    const days = groupMatch === undefined ? COOKIE_EXPIRY : parseInt(groupMatch, 10);
                    const date = new Date();
                    date.setTime(date.getTime() + days * 86400000);
                    return `expires=${date.toUTCString()}`;
                });
                document.cookie = cookieTemplate;
                return;
            }
            const regexp = new RegExp('(?:^' + name + '|;\\s*' + name + ')=(.*?)(?:;|$)', 'g');
            const result = regexp.exec(document.cookie);
            return decodeURIComponent(result[1]);
        }
        catch (e) {
            return; // should not happen but better safe than sorry (can happen by using domino)
        }
    }
    /**
     * Check if value exists in locales list
     */
    _returnIfInLocales(value) {
        if (value && this.locales.indexOf(value) !== -1) {
            return value;
        }
        return null;
    }
    /**
     * Get translated value
     */
    translateText(key) {
        if (this.escapePrefix && key.startsWith(this.escapePrefix)) {
            return key.replace(this.escapePrefix, '');
        }
        else {
            if (!this._translationObject) {
                return key;
            }
            const fullKey = this.prefix + key;
            const res = this.translate.getParsedResult(this._translationObject, fullKey);
            return res !== fullKey ? res : key;
        }
    }
    /**
     * Strategy to choose between new or old queryParams
     * @param newExtras extras that containes new QueryParams
     * @param currentQueryParams current query params
     */
    chooseQueryParams(newExtras, currentQueryParams) {
        let queryParamsObj;
        if (newExtras && newExtras.queryParams) {
            queryParamsObj = newExtras.queryParams;
        }
        else if (currentQueryParams) {
            queryParamsObj = currentQueryParams;
        }
        return queryParamsObj;
    }
    /**
     * Format query params from object to string.
     * Exemple of result: `param=value&param2=value2`
     * @param params query params object
     */
    formatQueryParams(params) {
        return new HttpParams({ fromObject: params }).toString();
    }
    /**
     * Get translation key prefix from config
     */
    getPrefix() {
        return this.prefix;
    }
    /**
     * Get escape translation prefix from config
     */
    getEscapePrefix() {
        return this.escapePrefix;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.10", ngImport: i0, type: LocalizeParser, deps: [{ token: TranslateService }, { token: Location }, { token: LocalizeRouterSettings }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.2.10", ngImport: i0, type: LocalizeParser }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.10", ngImport: i0, type: LocalizeParser, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.TranslateService, decorators: [{
                    type: Inject,
                    args: [TranslateService]
                }] }, { type: i2.Location, decorators: [{
                    type: Inject,
                    args: [Location]
                }] }, { type: i3.LocalizeRouterSettings, decorators: [{
                    type: Inject,
                    args: [LocalizeRouterSettings]
                }] }]; } });
/**
 * Manually set configuration
 */
export class ManualParserLoader extends LocalizeParser {
    /**
     * CTOR
     */
    constructor(translate, location, settings, locales = ['en'], prefix = 'ROUTES.', escapePrefix = '') {
        super(translate, location, settings);
        this.locales = locales;
        this.prefix = prefix || '';
        this.escapePrefix = escapePrefix || '';
    }
    /**
     * Initialize or append routes
     */
    load(routes) {
        return new Promise((resolve) => {
            this.init(routes).then(resolve);
        });
    }
}
export class DummyLocalizeParser extends LocalizeParser {
    load(routes) {
        return new Promise((resolve) => {
            this.init(routes).then(resolve);
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.10", ngImport: i0, type: DummyLocalizeParser, deps: null, target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.2.10", ngImport: i0, type: DummyLocalizeParser }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.10", ngImport: i0, type: DummyLocalizeParser, decorators: [{
            type: Injectable
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYWxpemUtcm91dGVyLnBhcnNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL25neC10cmFuc2xhdGUtcm91dGVyL3NyYy9saWIvbG9jYWxpemUtcm91dGVyLnBhcnNlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUN2RCxPQUFPLEVBQUUsY0FBYyxFQUFFLFVBQVUsRUFBWSxNQUFNLE1BQU0sQ0FBQztBQUM1RCxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDM0MsT0FBTyxFQUFFLGNBQWMsRUFBRSxzQkFBc0IsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBQ2xGLE9BQU8sRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ25ELE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQzs7Ozs7QUFFbEQsTUFBTSxhQUFhLEdBQUcsRUFBRSxDQUFDLENBQUMsVUFBVTtBQUVwQzs7R0FFRztBQUVILE1BQU0sT0FBZ0IsY0FBYztJQWFsQzs7T0FFRztJQUNILFlBQThDLFNBQTJCLEVBQzdDLFFBQWtCLEVBQ0osUUFBZ0M7UUFGNUIsY0FBUyxHQUFULFNBQVMsQ0FBa0I7UUFDN0MsYUFBUSxHQUFSLFFBQVEsQ0FBVTtRQUNKLGFBQVEsR0FBUixRQUFRLENBQXdCO0lBQzFFLENBQUM7SUFPRDs7O0tBR0M7SUFDRDs7Ozs7Ozs7Ozs7UUFXSTtJQUdKOztPQUVHO0lBQ08sSUFBSSxDQUFDLE1BQWM7UUFDM0IsSUFBSSxnQkFBd0IsQ0FBQztRQUU3QiwyQkFBMkI7UUFDM0IsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFFckIsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRTtZQUN6QyxPQUFP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LFNBQVMsRUFBRSxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDckMsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7UUFDdkIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLElBQUksRUFBRSxDQUFDO1FBQzNCLElBQUksQ0FBQyxZQUFZLEdBQUcsWUFBWSxJQUFJLEVBQUUsQ0FBQztJQUN6QyxDQUFDO0lBRUQ7O09BRUc7SUFDSCxJQUFJLENBQUMsTUFBYztRQUNqQixPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsT0FBWSxFQUFFLEVBQUU7WUFDbEMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDbEMsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUFHRCxNQUFNLE9BQU8sbUJBQW9CLFNBQVEsY0FBYztJQUNyRCxJQUFJLENBQUMsTUFBYztRQUNqQixPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsT0FBWSxFQUFFLEVBQUU7WUFDbEMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDbEMsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDOytHQUxVLG1CQUFtQjttSEFBbkIsbUJBQW1COzs0RkFBbkIsbUJBQW1CO2tCQUQvQixVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUm91dGVzLCBSb3V0ZSwgTmF2aWdhdGlvbkV4dHJhcywgUGFyYW1zIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcclxuaW1wb3J0IHsgVHJhbnNsYXRlU2VydmljZSB9IGZyb20gJ0BuZ3gtdHJhbnNsYXRlL2NvcmUnO1xyXG5pbXBvcnQgeyBmaXJzdFZhbHVlRnJvbSwgT2JzZXJ2YWJsZSwgT2JzZXJ2ZXIgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgTG9jYXRpb24gfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xyXG5pbXBvcnQgeyBDYWNoZU1lY2hhbmlzbSwgTG9jYWxpemVSb3V0ZXJTZXR0aW5ncyB9IGZyb20gJy4vbG9jYWxpemUtcm91dGVyLmNvbmZpZyc7XHJcbmltcG9ydCB7IEluamVjdCwgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwUGFyYW1zIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5cclxuY29uc3QgQ09PS0lFX0VYUElSWSA9IDMwOyAvLyAxIG1vbnRoXHJcblxyXG4vKipcclxuICogQWJzdHJhY3QgY2xhc3MgZm9yIHBhcnNpbmcgbG9jYWxpemF0aW9uXHJcbiAqL1xyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBMb2NhbGl6ZVBhcnNlciB7XHJcbiAgbG9jYWxlczogQXJyYXk8c3RyaW5nPjtcclxuICBjdXJyZW50TGFuZzogc3RyaW5nO1xyXG4gIHJvdXRlczogUm91dGVzO1xyXG4gIGRlZmF1bHRMYW5nOiBzdHJpbmc7XHJcblxyXG4gIHByb3RlY3RlZCBwcmVmaXg6IHN0cmluZztcclxuICBwcm90ZWN0ZWQgZXNjYXBlUHJlZml4OiBzdHJpbmc7XHJcblxyXG4gIHByaXZhdGUgX3RyYW5zbGF0aW9uT2JqZWN0OiBhbnk7XHJcbiAgcHJpdmF0ZSBfd2lsZGNhcmRSb3V0ZTogUm91dGU7XHJcbiAgcHJpdmF0ZSBfbGFuZ3VhZ2VSb3V0ZTogUm91dGU7XHJcblxyXG4gIC8qKlxyXG4gICAqIExvYWRlciBjb25zdHJ1Y3RvclxyXG4gICAqL1xyXG4gIGNvbnN0cnVjdG9yKEBJbmplY3QoVHJhbnNsYXRlU2VydmljZSkgcHJpdmF0ZSB0cmFuc2xhdGU6IFRyYW5zbGF0ZVNlcnZpY2UsXHJcbiAgICBASW5qZWN0KExvY2F0aW9uKSBwcml2YXRlIGxvY2F0aW9uOiBMb2NhdGlvbixcclxuICAgIEBJbmplY3QoTG9jYWxpemVSb3V0ZXJTZXR0aW5ncykgcHJpdmF0ZSBzZXR0aW5nczogTG9jYWxpemVSb3V0ZXJTZXR0aW5ncykge1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogTG9hZCByb3V0ZXMgYW5kIGZldGNoIG5lY2Vzc2FyeSBkYXRhXHJcbiAgICovXHJcbiAgYWJzdHJhY3QgbG9hZChyb3V0ZXM6IFJvdXRlcyk6IFByb21pc2U8YW55PjtcclxuXHJcbiAgLyoqXHJcbiAqIFByZXBhcmUgcm91dGVzIHRvIGJlIGZ1bGx5IHVzYWJsZSBieSBuZ3gtdHJhbnNsYXRlLXJvdXRlclxyXG4gKiBAcGFyYW0gcm91dGVzXHJcbiAqL1xyXG4gIC8qIHByaXZhdGUgaW5pdFJvdXRlcyhyb3V0ZXM6IFJvdXRlcywgcHJlZml4ID0gJycpIHtcclxuICAgIHJvdXRlcy5mb3JFYWNoKHJvdXRlID0+IHtcclxuICAgICAgaWYgKHJvdXRlLnBhdGggIT09ICcqKicpIHtcclxuICAgICAgICBjb25zdCByb3V0ZURhdGE6IGFueSA9IHJvdXRlLmRhdGEgPSByb3V0ZS5kYXRhIHx8IHt9O1xyXG4gICAgICAgIHJvdXRlRGF0YS5sb2NhbGl6ZVJvdXRlciA9IHt9O1xyXG4gICAgICAgIHJvdXRlRGF0YS5sb2NhbGl6ZVJvdXRlci5mdWxsUGF0aCA9IGAke3ByZWZpeH0vJHtyb3V0ZS5wYXRofWA7XHJcbiAgICAgICAgaWYgKHJvdXRlLmNoaWxkcmVuICYmIHJvdXRlLmNoaWxkcmVuLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgIHRoaXMuaW5pdFJvdXRlcyhyb3V0ZS5jaGlsZHJlbiwgcm91dGVEYXRhLmxvY2FsaXplUm91dGVyLmZ1bGxQYXRoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH0gKi9cclxuXHJcblxyXG4gIC8qKlxyXG4gICAqIEluaXRpYWxpemUgbGFuZ3VhZ2UgYW5kIHJvdXRlc1xyXG4gICAqL1xyXG4gIHByb3RlY3RlZCBpbml0KHJvdXRlczogUm91dGVzKTogUHJvbWlzZTxhbnk+IHtcclxuICAgIGxldCBzZWxlY3RlZExhbmd1YWdlOiBzdHJpbmc7XHJcblxyXG4gICAgLy8gdGhpcy5pbml0Um91dGVzKHJvdXRlcyk7XHJcbiAgICB0aGlzLnJvdXRlcyA9IHJvdXRlcztcclxuXHJcbiAgICBpZiAoIXRoaXMubG9jYWxlcyB8fCAhdGhpcy5sb2NhbGVzLmxlbmd0aCkge1xyXG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XHJcbiAgICB9XHJcbiAgICAvKiogZGV0ZWN0IGN1cnJlbnQgbGFuZ3VhZ2UgKi9cclxuICAgIGNvbnN0IGxvY2F0aW9uTGFuZyA9IHRoaXMuZ2V0TG9jYXRpb25MYW5nKCk7XHJcbiAgICBjb25zdCBicm93c2VyTGFuZyA9IHRoaXMuX2dldEJyb3dzZXJMYW5nKCk7XHJcblxyXG4gICAgaWYgKHRoaXMuc2V0dGluZ3MuZGVmYXVsdExhbmdGdW5jdGlvbikge1xyXG4gICAgICB0aGlzLmRlZmF1bHRMYW5nID0gdGhpcy5zZXR0aW5ncy5kZWZhdWx0TGFuZ0Z1bmN0aW9uKHRoaXMubG9jYWxlcywgdGhpcy5fY2FjaGVkTGFuZywgYnJvd3NlckxhbmcpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5kZWZhdWx0TGFuZyA9IHRoaXMuX2NhY2hlZExhbmcgfHwgYnJvd3NlckxhbmcgfHwgdGhpcy5sb2NhbGVzWzBdO1xyXG4gICAgfVxyXG4gICAgc2VsZWN0ZWRMYW5ndWFnZSA9IGxvY2F0aW9uTGFuZyB8fCB0aGlzLmRlZmF1bHRMYW5nO1xyXG4gICAgdGhpcy50cmFuc2xhdGUuc2V0RGVmYXVsdExhbmcodGhpcy5kZWZhdWx0TGFuZyk7XHJcblxyXG4gICAgbGV0IGNoaWxkcmVuOiBSb3V0ZXMgPSBbXTtcclxuICAgIC8qKiBpZiBzZXQgcHJlZml4IGlzIGVuZm9yY2VkICovXHJcbiAgICBpZiAodGhpcy5zZXR0aW5ncy5hbHdheXNTZXRQcmVmaXgpIHtcclxuICAgICAgY29uc3QgYmFzZVJvdXRlOiBSb3V0ZSA9IHsgcGF0aDogJycsIHJlZGlyZWN0VG86IHRoaXMuZGVmYXVsdExhbmcsIHBhdGhNYXRjaDogJ2Z1bGwnIH07XHJcblxyXG4gICAgICAvKiogZXh0cmFjdCBwb3RlbnRpYWwgd2lsZGNhcmQgcm91dGUgKi9cclxuICAgICAgY29uc3Qgd2lsZGNhcmRJbmRleCA9IHJvdXRlcy5maW5kSW5kZXgoKHJvdXRlOiBSb3V0ZSkgPT4gcm91dGUucGF0aCA9PT0gJyoqJyk7XHJcbiAgICAgIGlmICh3aWxkY2FyZEluZGV4ICE9PSAtMSkge1xyXG4gICAgICAgIHRoaXMuX3dpbGRjYXJkUm91dGUgPSByb3V0ZXMuc3BsaWNlKHdpbGRjYXJkSW5kZXgsIDEpWzBdO1xyXG4gICAgICB9XHJcbiAgICAgIGNoaWxkcmVuID0gdGhpcy5yb3V0ZXMuc3BsaWNlKDAsIHRoaXMucm91dGVzLmxlbmd0aCwgYmFzZVJvdXRlKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNoaWxkcmVuID0gWy4uLnRoaXMucm91dGVzXTsgLy8gc2hhbGxvdyBjb3B5IG9mIHJvdXRlc1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBleGNsdWRlIGNlcnRhaW4gcm91dGVzICovXHJcbiAgICBmb3IgKGxldCBpID0gY2hpbGRyZW4ubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcclxuICAgICAgaWYgKGNoaWxkcmVuW2ldLmRhdGEgJiYgY2hpbGRyZW5baV0uZGF0YVsnc2tpcFJvdXRlTG9jYWxpemF0aW9uJ10pIHtcclxuICAgICAgICBpZiAodGhpcy5zZXR0aW5ncy5hbHdheXNTZXRQcmVmaXgpIHtcclxuICAgICAgICAgIC8vIGFkZCBkaXJlY3RseSB0byByb3V0ZXNcclxuICAgICAgICAgIHRoaXMucm91dGVzLnB1c2goY2hpbGRyZW5baV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyByZW1vdmUgZnJvbSByb3V0ZXMgdG8gdHJhbnNsYXRlIG9ubHkgaWYgZG9lc24ndCBoYXZlIHRvIHRyYW5zbGF0ZSBgcmVkaXJlY3RUb2AgcHJvcGVydHlcclxuICAgICAgICBpZiAoY2hpbGRyZW5baV0ucmVkaXJlY3RUbyA9PT0gdW5kZWZpbmVkIHx8ICEoY2hpbGRyZW5baV0uZGF0YVsnc2tpcFJvdXRlTG9jYWxpemF0aW9uJ11bJ2xvY2FsaXplUmVkaXJlY3RUbyddKSkge1xyXG4gICAgICAgICAgY2hpbGRyZW4uc3BsaWNlKGksIDEpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKiBhcHBlbmQgY2hpbGRyZW4gcm91dGVzICovXHJcbiAgICBpZiAoY2hpbGRyZW4gJiYgY2hpbGRyZW4ubGVuZ3RoKSB7XHJcbiAgICAgIGlmICh0aGlzLmxvY2FsZXMubGVuZ3RoID4gMSB8fCB0aGlzLnNldHRpbmdzLmFsd2F5c1NldFByZWZpeCkge1xyXG4gICAgICAgIHRoaXMuX2xhbmd1YWdlUm91dGUgPSB7IGNoaWxkcmVuOiBjaGlsZHJlbiB9O1xyXG4gICAgICAgIHRoaXMucm91dGVzLnVuc2hpZnQodGhpcy5fbGFuZ3VhZ2VSb3V0ZSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKiogLi4uYW5kIHBvdGVudGlhbCB3aWxkY2FyZCByb3V0ZSAqL1xyXG4gICAgaWYgKHRoaXMuX3dpbGRjYXJkUm91dGUgJiYgdGhpcy5zZXR0aW5ncy5hbHdheXNTZXRQcmVmaXgpIHtcclxuICAgICAgdGhpcy5yb3V0ZXMucHVzaCh0aGlzLl93aWxkY2FyZFJvdXRlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogdHJhbnNsYXRlIHJvdXRlcyAqL1xyXG4gICAgcmV0dXJuIGZpcnN0VmFsdWVGcm9tKFxyXG4gICAgICB0aGlzLnRyYW5zbGF0ZVJvdXRlcyhzZWxlY3RlZExhbmd1YWdlKVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIGluaXRDaGlsZFJvdXRlcyhyb3V0ZXM6IFJvdXRlcykge1xyXG4gICAgdGhpcy5fdHJhbnNsYXRlUm91dGVUcmVlKHJvdXRlcyk7XHJcbiAgICByZXR1cm4gcm91dGVzO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogVHJhbnNsYXRlIHJvdXRlcyB0byBzZWxlY3RlZCBsYW5ndWFnZVxyXG4gICAqL1xyXG4gIHRyYW5zbGF0ZVJvdXRlcyhsYW5ndWFnZTogc3RyaW5nKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZTxhbnk+KChvYnNlcnZlcjogT2JzZXJ2ZXI8YW55PikgPT4ge1xyXG4gICAgICB0aGlzLl9jYWNoZWRMYW5nID0gbGFuZ3VhZ2U7XHJcbiAgICAgIGlmICh0aGlzLl9sYW5ndWFnZVJvdXRlKSB7XHJcbiAgICAgICAgdGhpcy5fbGFuZ3VhZ2VSb3V0ZS5wYXRoID0gbGFuZ3VhZ2U7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMudHJhbnNsYXRlLnVzZShsYW5ndWFnZSkuc3Vic2NyaWJlKCh0cmFuc2xhdGlvbnM6IGFueSkgPT4ge1xyXG4gICAgICAgIHRoaXMuX3RyYW5zbGF0aW9uT2JqZWN0ID0gdHJhbnNsYXRpb25zO1xyXG4gICAgICAgIHRoaXMuY3VycmVudExhbmcgPSBsYW5ndWFnZTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX2xhbmd1YWdlUm91dGUpIHtcclxuICAgICAgICAgIHRoaXMuX3RyYW5zbGF0ZVJvdXRlVHJlZSh0aGlzLl9sYW5ndWFnZVJvdXRlLmNoaWxkcmVuLCB0cnVlKTtcclxuICAgICAgICAgIC8vIGlmIHRoZXJlIGlzIHdpbGRjYXJkIHJvdXRlXHJcbiAgICAgICAgICBpZiAodGhpcy5fd2lsZGNhcmRSb3V0ZSAmJiB0aGlzLl93aWxkY2FyZFJvdXRlLnJlZGlyZWN0VG8pIHtcclxuICAgICAgICAgICAgdGhpcy5fdHJhbnNsYXRlUHJvcGVydHkodGhpcy5fd2lsZGNhcmRSb3V0ZSwgJ3JlZGlyZWN0VG8nLCB0cnVlKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhpcy5fdHJhbnNsYXRlUm91dGVUcmVlKHRoaXMucm91dGVzLCB0cnVlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG9ic2VydmVyLm5leHQodm9pZCAwKTtcclxuICAgICAgICBvYnNlcnZlci5jb21wbGV0ZSgpO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogVHJhbnNsYXRlIHRoZSByb3V0ZSBub2RlIGFuZCByZWN1cnNpdmVseSBjYWxsIGZvciBhbGwgaXQncyBjaGlsZHJlblxyXG4gICAqL1xyXG4gIHByaXZhdGUgX3RyYW5zbGF0ZVJvdXRlVHJlZShyb3V0ZXM6IFJvdXRlcywgaXNSb290VHJlZT86IGJvb2xlYW4pOiB2b2lkIHtcclxuICAgIHJvdXRlcy5mb3JFYWNoKChyb3V0ZTogUm91dGUpID0+IHtcclxuICAgICAgY29uc3Qgc2tpcFJvdXRlTG9jYWxpemF0aW9uID0gKHJvdXRlLmRhdGEgJiYgcm91dGUuZGF0YVsnc2tpcFJvdXRlTG9jYWxpemF0aW9uJ10pO1xyXG4gICAgICBjb25zdCBsb2NhbGl6ZVJlZGlyZWN0aW9uID0gIXNraXBSb3V0ZUxvY2FsaXphdGlvbiB8fCBza2lwUm91dGVMb2NhbGl6YXRpb25bJ2xvY2FsaXplUmVkaXJlY3RUbyddO1xyXG5cclxuICAgICAgaWYgKHJvdXRlLnJlZGlyZWN0VG8gJiYgbG9jYWxpemVSZWRpcmVjdGlvbikge1xyXG4gICAgICAgIGNvbnN0IHByZWZpeExhbmcgPSByb3V0ZS5yZWRpcmVjdFRvLmluZGV4T2YoJy8nKSA9PT0gMCB8fCBpc1Jvb3RUcmVlO1xyXG4gICAgICAgIHRoaXMuX3RyYW5zbGF0ZVByb3BlcnR5KHJvdXRlLCAncmVkaXJlY3RUbycsIHByZWZpeExhbmcpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoc2tpcFJvdXRlTG9jYWxpemF0aW9uKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAocm91dGUucGF0aCAhPT0gbnVsbCAmJiByb3V0ZS5wYXRoICE9PSB1bmRlZmluZWQvKiAmJiByb3V0ZS5wYXRoICE9PSAnKionKi8pIHtcclxuICAgICAgICB0aGlzLl90cmFuc2xhdGVQcm9wZXJ0eShyb3V0ZSwgJ3BhdGgnKTtcclxuICAgICAgfVxyXG4gICAgICBpZiAocm91dGUuY2hpbGRyZW4pIHtcclxuICAgICAgICB0aGlzLl90cmFuc2xhdGVSb3V0ZVRyZWUocm91dGUuY2hpbGRyZW4pO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChyb3V0ZS5sb2FkQ2hpbGRyZW4gJiYgKDxhbnk+cm91dGUpLl9sb2FkZWRSb3V0ZXM/Lmxlbmd0aCkge1xyXG4gICAgICAgIHRoaXMuX3RyYW5zbGF0ZVJvdXRlVHJlZSgoPGFueT5yb3V0ZSkuX2xvYWRlZFJvdXRlcyk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogVHJhbnNsYXRlIHByb3BlcnR5XHJcbiAgICogSWYgZmlyc3QgdGltZSB0cmFuc2xhdGlvbiB0aGVuIGFkZCBvcmlnaW5hbCB0byByb3V0ZSBkYXRhIG9iamVjdFxyXG4gICAqL1xyXG4gIHByaXZhdGUgX3RyYW5zbGF0ZVByb3BlcnR5KHJvdXRlOiBSb3V0ZSwgcHJvcGVydHk6IHN0cmluZywgcHJlZml4TGFuZz86IGJvb2xlYW4pOiB2b2lkIHtcclxuICAgIC8vIHNldCBwcm9wZXJ0eSB0byBkYXRhIGlmIG5vdCB0aGVyZSB5ZXRcclxuICAgIGNvbnN0IHJvdXRlRGF0YTogYW55ID0gcm91dGUuZGF0YSA9IHJvdXRlLmRhdGEgfHwge307XHJcbiAgICBpZiAoIXJvdXRlRGF0YS5sb2NhbGl6ZVJvdXRlcikge1xyXG4gICAgICByb3V0ZURhdGEubG9jYWxpemVSb3V0ZXIgPSB7fTtcclxuICAgIH1cclxuICAgIGlmICghcm91dGVEYXRhLmxvY2FsaXplUm91dGVyW3Byb3BlcnR5XSkge1xyXG4gICAgICByb3V0ZURhdGEubG9jYWxpemVSb3V0ZXIgPSB7IC4uLnJvdXRlRGF0YS5sb2NhbGl6ZVJvdXRlciwgW3Byb3BlcnR5XTogcm91dGVbcHJvcGVydHldIH07XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgcmVzdWx0ID0gdGhpcy50cmFuc2xhdGVSb3V0ZShyb3V0ZURhdGEubG9jYWxpemVSb3V0ZXJbcHJvcGVydHldKTtcclxuICAgICg8YW55PnJvdXRlKVtwcm9wZXJ0eV0gPSBwcmVmaXhMYW5nID8gdGhpcy5hZGRQcmVmaXhUb1VybChyZXN1bHQpIDogcmVzdWx0O1xyXG4gIH1cclxuXHJcbiAgZ2V0IHVybFByZWZpeCgpIHtcclxuICAgIGlmICh0aGlzLnNldHRpbmdzLmFsd2F5c1NldFByZWZpeCB8fCB0aGlzLmN1cnJlbnRMYW5nICE9PSB0aGlzLmRlZmF1bHRMYW5nKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRMYW5nID8gdGhpcy5jdXJyZW50TGFuZyA6IHRoaXMuZGVmYXVsdExhbmc7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gJyc7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBBZGQgY3VycmVudCBsYW5nIGFzIHByZWZpeCB0byBnaXZlbiB1cmwuXHJcbiAgICovXHJcbiAgYWRkUHJlZml4VG9VcmwodXJsOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgY29uc3Qgc3BsaXRVcmwgPSB1cmwuc3BsaXQoJz8nKTtcclxuICAgIGNvbnN0IGlzUm9vdFBhdGggPSBzcGxpdFVybFswXS5sZW5ndGggPT09IDEgJiYgc3BsaXRVcmxbMF0gPT09ICcvJztcclxuICAgIHNwbGl0VXJsWzBdID0gc3BsaXRVcmxbMF0ucmVwbGFjZSgvXFwvJC8sICcnKTtcclxuXHJcbiAgICBjb25zdCBqb2luZWRVcmwgPSBzcGxpdFVybC5qb2luKCc/Jyk7XHJcbiAgICBpZiAodGhpcy51cmxQcmVmaXggPT09ICcnKSB7XHJcbiAgICAgIHJldHVybiBqb2luZWRVcmw7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCFqb2luZWRVcmwuc3RhcnRzV2l0aCgnLycpICYmICFpc1Jvb3RQYXRoKSB7XHJcbiAgICAgIHJldHVybiBgJHt0aGlzLnVybFByZWZpeH0vJHtqb2luZWRVcmx9YDtcclxuICAgIH1cclxuICAgIHJldHVybiBgLyR7dGhpcy51cmxQcmVmaXh9JHtqb2luZWRVcmx9YDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFRyYW5zbGF0ZSByb3V0ZSBhbmQgcmV0dXJuIG9ic2VydmFibGVcclxuICAgKi9cclxuICB0cmFuc2xhdGVSb3V0ZShwYXRoOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgY29uc3QgcXVlcnlQYXJ0cyA9IHBhdGguc3BsaXQoJz8nKTtcclxuICAgIGlmIChxdWVyeVBhcnRzLmxlbmd0aCA+IDIpIHtcclxuICAgICAgdGhyb3cgRXJyb3IoJ1RoZXJlIHNob3VsZCBiZSBvbmx5IG9uZSBxdWVyeSBwYXJhbWV0ZXIgYmxvY2sgaW4gdGhlIFVSTCcpO1xyXG4gICAgfVxyXG4gICAgY29uc3QgcGF0aFNlZ21lbnRzID0gcXVlcnlQYXJ0c1swXS5zcGxpdCgnLycpO1xyXG5cclxuICAgIC8qKiBjb2xsZWN0IG9ic2VydmFibGVzICAqL1xyXG4gICAgcmV0dXJuIHBhdGhTZWdtZW50c1xyXG4gICAgICAubWFwKChwYXJ0OiBzdHJpbmcpID0+IHBhcnQubGVuZ3RoID8gdGhpcy50cmFuc2xhdGVUZXh0KHBhcnQpIDogcGFydClcclxuICAgICAgLmpvaW4oJy8nKSArXHJcbiAgICAgIChxdWVyeVBhcnRzLmxlbmd0aCA+IDEgPyBgPyR7cXVlcnlQYXJ0c1sxXX1gIDogJycpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR2V0IGxhbmd1YWdlIGZyb20gdXJsXHJcbiAgICovXHJcbiAgZ2V0TG9jYXRpb25MYW5nKHVybD86IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICBjb25zdCBxdWVyeVBhcmFtU3BsaXQgPSAodXJsIHx8IHRoaXMubG9jYXRpb24ucGF0aCgpKS5zcGxpdCgvW1xcPztdLyk7XHJcbiAgICBsZXQgcGF0aFNsaWNlczogc3RyaW5nW10gPSBbXTtcclxuICAgIGlmIChxdWVyeVBhcmFtU3BsaXQubGVuZ3RoID4gMCkge1xyXG4gICAgICBwYXRoU2xpY2VzID0gcXVlcnlQYXJhbVNwbGl0WzBdLnNwbGl0KCcvJyk7XHJcbiAgICB9XHJcbiAgICBpZiAocGF0aFNsaWNlcy5sZW5ndGggPiAxICYmIHRoaXMubG9jYWxlcy5pbmRleE9mKHBhdGhTbGljZXNbMV0pICE9PSAtMSkge1xyXG4gICAgICByZXR1cm4gcGF0aFNsaWNlc1sxXTtcclxuICAgIH1cclxuICAgIGlmIChwYXRoU2xpY2VzLmxlbmd0aCAmJiB0aGlzLmxvY2FsZXMuaW5kZXhPZihwYXRoU2xpY2VzWzBdKSAhPT0gLTEpIHtcclxuICAgICAgcmV0dXJuIHBhdGhTbGljZXNbMF07XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbnVsbDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldCB1c2VyJ3MgbGFuZ3VhZ2Ugc2V0IGluIHRoZSBicm93c2VyXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBfZ2V0QnJvd3NlckxhbmcoKTogc3RyaW5nIHtcclxuICAgIHJldHVybiB0aGlzLl9yZXR1cm5JZkluTG9jYWxlcyh0aGlzLnRyYW5zbGF0ZS5nZXRCcm93c2VyTGFuZygpKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldCBsYW5ndWFnZSBmcm9tIGxvY2FsIHN0b3JhZ2Ugb3IgY29va2llXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBnZXQgX2NhY2hlZExhbmcoKTogc3RyaW5nIHtcclxuICAgIGlmICghdGhpcy5zZXR0aW5ncy51c2VDYWNoZWRMYW5nKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGlmICh0aGlzLnNldHRpbmdzLmNhY2hlTWVjaGFuaXNtID09PSBDYWNoZU1lY2hhbmlzbS5Mb2NhbFN0b3JhZ2UpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuX2NhY2hlV2l0aExvY2FsU3RvcmFnZSgpO1xyXG4gICAgfVxyXG4gICAgaWYgKHRoaXMuc2V0dGluZ3MuY2FjaGVNZWNoYW5pc20gPT09IENhY2hlTWVjaGFuaXNtLlNlc3Npb25TdG9yYWdlKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLl9jYWNoZVdpdGhTZXNzaW9uU3RvcmFnZSgpO1xyXG4gICAgfVxyXG4gICAgaWYgKHRoaXMuc2V0dGluZ3MuY2FjaGVNZWNoYW5pc20gPT09IENhY2hlTWVjaGFuaXNtLkNvb2tpZSkge1xyXG4gICAgICByZXR1cm4gdGhpcy5fY2FjaGVXaXRoQ29va2llcygpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogU2F2ZSBsYW5ndWFnZSB0byBsb2NhbCBzdG9yYWdlIG9yIGNvb2tpZVxyXG4gICAqL1xyXG4gIHByaXZhdGUgc2V0IF9jYWNoZWRMYW5nKHZhbHVlOiBzdHJpbmcpIHtcclxuICAgIGlmICghdGhpcy5zZXR0aW5ncy51c2VDYWNoZWRMYW5nKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGlmICh0aGlzLnNldHRpbmdzLmNhY2hlTWVjaGFuaXNtID09PSBDYWNoZU1lY2hhbmlzbS5Mb2NhbFN0b3JhZ2UpIHtcclxuICAgICAgdGhpcy5fY2FjaGVXaXRoTG9jYWxTdG9yYWdlKHZhbHVlKTtcclxuICAgIH1cclxuICAgIGlmICh0aGlzLnNldHRpbmdzLmNhY2hlTWVjaGFuaXNtID09PSBDYWNoZU1lY2hhbmlzbS5TZXNzaW9uU3RvcmFnZSkge1xyXG4gICAgICB0aGlzLl9jYWNoZVdpdGhTZXNzaW9uU3RvcmFnZSh2YWx1ZSk7XHJcbiAgICB9XHJcbiAgICBpZiAodGhpcy5zZXR0aW5ncy5jYWNoZU1lY2hhbmlzbSA9PT0gQ2FjaGVNZWNoYW5pc20uQ29va2llKSB7XHJcbiAgICAgIHRoaXMuX2NhY2hlV2l0aENvb2tpZXModmFsdWUpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ2FjaGUgdmFsdWUgdG8gbG9jYWwgc3RvcmFnZVxyXG4gICAqL1xyXG4gIHByaXZhdGUgX2NhY2hlV2l0aExvY2FsU3RvcmFnZSh2YWx1ZT86IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICB0cnkge1xyXG4gICAgICBpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcgfHwgdHlwZW9mIHdpbmRvdy5sb2NhbFN0b3JhZ2UgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICAgIGlmICh2YWx1ZSkge1xyXG4gICAgICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbSh0aGlzLnNldHRpbmdzLmNhY2hlTmFtZSwgdmFsdWUpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gdGhpcy5fcmV0dXJuSWZJbkxvY2FsZXMod2luZG93LmxvY2FsU3RvcmFnZS5nZXRJdGVtKHRoaXMuc2V0dGluZ3MuY2FjaGVOYW1lKSk7XHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgIC8vIHdlaXJkIFNhZmFyaSBpc3N1ZSBpbiBwcml2YXRlIG1vZGUsIHdoZXJlIExvY2FsU3RvcmFnZSBpcyBkZWZpbmVkIGJ1dCB0aHJvd3MgZXJyb3Igb24gYWNjZXNzXHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENhY2hlIHZhbHVlIHRvIHNlc3Npb24gc3RvcmFnZVxyXG4gICAqL1xyXG4gIHByaXZhdGUgX2NhY2hlV2l0aFNlc3Npb25TdG9yYWdlKHZhbHVlPzogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGlmICh0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJyB8fCB0eXBlb2Ygd2luZG93LnNlc3Npb25TdG9yYWdlID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG4gICAgICBpZiAodmFsdWUpIHtcclxuICAgICAgICB3aW5kb3cuc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSh0aGlzLnNldHRpbmdzLmNhY2hlTmFtZSwgdmFsdWUpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gdGhpcy5fcmV0dXJuSWZJbkxvY2FsZXMod2luZG93LnNlc3Npb25TdG9yYWdlLmdldEl0ZW0odGhpcy5zZXR0aW5ncy5jYWNoZU5hbWUpKTtcclxuICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ2FjaGUgdmFsdWUgdmlhIGNvb2tpZXNcclxuICAgKi9cclxuICBwcml2YXRlIF9jYWNoZVdpdGhDb29raWVzKHZhbHVlPzogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGlmICh0eXBlb2YgZG9jdW1lbnQgPT09ICd1bmRlZmluZWQnIHx8IHR5cGVvZiBkb2N1bWVudC5jb29raWUgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICAgIGNvbnN0IG5hbWUgPSBlbmNvZGVVUklDb21wb25lbnQodGhpcy5zZXR0aW5ncy5jYWNoZU5hbWUpO1xyXG4gICAgICBpZiAodmFsdWUpIHtcclxuICAgICAgICBsZXQgY29va2llVGVtcGxhdGUgPSBgJHt0aGlzLnNldHRpbmdzLmNvb2tpZUZvcm1hdH1gO1xyXG4gICAgICAgIGNvb2tpZVRlbXBsYXRlID0gY29va2llVGVtcGxhdGVcclxuICAgICAgICAgIC5yZXBsYWNlKCd7e3ZhbHVlfX0nLCBgJHtuYW1lfT0ke2VuY29kZVVSSUNvbXBvbmVudCh2YWx1ZSl9YClcclxuICAgICAgICAgIC5yZXBsYWNlKC97e2V4cGlyZXM6PyhcXGQrKT99fS9nLCAoZnVsbE1hdGNoLCBncm91cE1hdGNoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGRheXMgPSBncm91cE1hdGNoID09PSB1bmRlZmluZWQgPyBDT09LSUVfRVhQSVJZIDogcGFyc2VJbnQoZ3JvdXBNYXRjaCwgMTApO1xyXG4gICAgICAgICAgICBjb25zdCBkYXRlOiBEYXRlID0gbmV3IERhdGUoKTtcclxuICAgICAgICAgICAgZGF0ZS5zZXRUaW1lKGRhdGUuZ2V0VGltZSgpICsgZGF5cyAqIDg2NDAwMDAwKTtcclxuICAgICAgICAgICAgcmV0dXJuIGBleHBpcmVzPSR7ZGF0ZS50b1VUQ1N0cmluZygpfWA7XHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZG9jdW1lbnQuY29va2llID0gY29va2llVGVtcGxhdGU7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICAgIGNvbnN0IHJlZ2V4cCA9IG5ldyBSZWdFeHAoJyg/Ol4nICsgbmFtZSArICd8O1xcXFxzKicgKyBuYW1lICsgJyk9KC4qPykoPzo7fCQpJywgJ2cnKTtcclxuICAgICAgY29uc3QgcmVzdWx0ID0gcmVnZXhwLmV4ZWMoZG9jdW1lbnQuY29va2llKTtcclxuICAgICAgcmV0dXJuIGRlY29kZVVSSUNvbXBvbmVudChyZXN1bHRbMV0pO1xyXG4gICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICByZXR1cm47IC8vIHNob3VsZCBub3QgaGFwcGVuIGJ1dCBiZXR0ZXIgc2FmZSB0aGFuIHNvcnJ5IChjYW4gaGFwcGVuIGJ5IHVzaW5nIGRvbWlubylcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENoZWNrIGlmIHZhbHVlIGV4aXN0cyBpbiBsb2NhbGVzIGxpc3RcclxuICAgKi9cclxuICBwcml2YXRlIF9yZXR1cm5JZkluTG9jYWxlcyh2YWx1ZTogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgIGlmICh2YWx1ZSAmJiB0aGlzLmxvY2FsZXMuaW5kZXhPZih2YWx1ZSkgIT09IC0xKSB7XHJcbiAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgIH1cclxuICAgIHJldHVybiBudWxsO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR2V0IHRyYW5zbGF0ZWQgdmFsdWVcclxuICAgKi9cclxuICBwcml2YXRlIHRyYW5zbGF0ZVRleHQoa2V5OiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgaWYgKHRoaXMuZXNjYXBlUHJlZml4ICYmIGtleS5zdGFydHNXaXRoKHRoaXMuZXNjYXBlUHJlZml4KSkge1xyXG4gICAgICByZXR1cm4ga2V5LnJlcGxhY2UodGhpcy5lc2NhcGVQcmVmaXgsICcnKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGlmICghdGhpcy5fdHJhbnNsYXRpb25PYmplY3QpIHtcclxuICAgICAgICByZXR1cm4ga2V5O1xyXG4gICAgICB9XHJcbiAgICAgIGNvbnN0IGZ1bGxLZXkgPSB0aGlzLnByZWZpeCArIGtleTtcclxuICAgICAgY29uc3QgcmVzID0gdGhpcy50cmFuc2xhdGUuZ2V0UGFyc2VkUmVzdWx0KHRoaXMuX3RyYW5zbGF0aW9uT2JqZWN0LCBmdWxsS2V5KTtcclxuICAgICAgcmV0dXJuIHJlcyAhPT0gZnVsbEtleSA/IHJlcyA6IGtleTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFN0cmF0ZWd5IHRvIGNob29zZSBiZXR3ZWVuIG5ldyBvciBvbGQgcXVlcnlQYXJhbXNcclxuICAgKiBAcGFyYW0gbmV3RXh0cmFzIGV4dHJhcyB0aGF0IGNvbnRhaW5lcyBuZXcgUXVlcnlQYXJhbXNcclxuICAgKiBAcGFyYW0gY3VycmVudFF1ZXJ5UGFyYW1zIGN1cnJlbnQgcXVlcnkgcGFyYW1zXHJcbiAgICovXHJcbiAgcHVibGljIGNob29zZVF1ZXJ5UGFyYW1zKG5ld0V4dHJhczogTmF2aWdhdGlvbkV4dHJhcywgY3VycmVudFF1ZXJ5UGFyYW1zOiBQYXJhbXMpIHtcclxuICAgIGxldCBxdWVyeVBhcmFtc09iajogUGFyYW1zO1xyXG4gICAgaWYgKG5ld0V4dHJhcyAmJiBuZXdFeHRyYXMucXVlcnlQYXJhbXMpIHtcclxuICAgICAgcXVlcnlQYXJhbXNPYmogPSBuZXdFeHRyYXMucXVlcnlQYXJhbXM7XHJcbiAgICB9IGVsc2UgaWYgKGN1cnJlbnRRdWVyeVBhcmFtcykge1xyXG4gICAgICBxdWVyeVBhcmFtc09iaiA9IGN1cnJlbnRRdWVyeVBhcmFtcztcclxuICAgIH1cclxuICAgIHJldHVybiBxdWVyeVBhcmFtc09iajtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEZvcm1hdCBxdWVyeSBwYXJhbXMgZnJvbSBvYmplY3QgdG8gc3RyaW5nLlxyXG4gICAqIEV4ZW1wbGUgb2YgcmVzdWx0OiBgcGFyYW09dmFsdWUmcGFyYW0yPXZhbHVlMmBcclxuICAgKiBAcGFyYW0gcGFyYW1zIHF1ZXJ5IHBhcmFtcyBvYmplY3RcclxuICAgKi9cclxuICBwdWJsaWMgZm9ybWF0UXVlcnlQYXJhbXMocGFyYW1zOiBQYXJhbXMpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIG5ldyBIdHRwUGFyYW1zKHsgZnJvbU9iamVjdDogcGFyYW1zIH0pLnRvU3RyaW5nKCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHZXQgdHJhbnNsYXRpb24ga2V5IHByZWZpeCBmcm9tIGNvbmZpZ1xyXG4gICAqL1xyXG4gIHB1YmxpYyBnZXRQcmVmaXgoKTogc3RyaW5nIHtcclxuICAgIHJldHVybiB0aGlzLnByZWZpeDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldCBlc2NhcGUgdHJhbnNsYXRpb24gcHJlZml4IGZyb20gY29uZmlnXHJcbiAgICovXHJcbiAgcHVibGljIGdldEVzY2FwZVByZWZpeCgpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIHRoaXMuZXNjYXBlUHJlZml4O1xyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIE1hbnVhbGx5IHNldCBjb25maWd1cmF0aW9uXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgTWFudWFsUGFyc2VyTG9hZGVyIGV4dGVuZHMgTG9jYWxpemVQYXJzZXIge1xyXG5cclxuICAvKipcclxuICAgKiBDVE9SXHJcbiAgICovXHJcbiAgY29uc3RydWN0b3IodHJhbnNsYXRlOiBUcmFuc2xhdGVTZXJ2aWNlLCBsb2NhdGlvbjogTG9jYXRpb24sIHNldHRpbmdzOiBMb2NhbGl6ZVJvdXRlclNldHRpbmdzLFxyXG4gICAgbG9jYWxlczogc3RyaW5nW10gPSBbJ2VuJ10sIHByZWZpeDogc3RyaW5nID0gJ1JPVVRFUy4nLCBlc2NhcGVQcmVmaXg6IHN0cmluZyA9ICcnKSB7XHJcbiAgICBzdXBlcih0cmFuc2xhdGUsIGxvY2F0aW9uLCBzZXR0aW5ncyk7XHJcbiAgICB0aGlzLmxvY2FsZXMgPSBsb2NhbGVzO1xyXG4gICAgdGhpcy5wcmVmaXggPSBwcmVmaXggfHwgJyc7XHJcbiAgICB0aGlzLmVzY2FwZVByZWZpeCA9IGVzY2FwZVByZWZpeCB8fCAnJztcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEluaXRpYWxpemUgb3IgYXBwZW5kIHJvdXRlc1xyXG4gICAqL1xyXG4gIGxvYWQocm91dGVzOiBSb3V0ZXMpOiBQcm9taXNlPGFueT4ge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlOiBhbnkpID0+IHtcclxuICAgICAgdGhpcy5pbml0KHJvdXRlcykudGhlbihyZXNvbHZlKTtcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG5cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgRHVtbXlMb2NhbGl6ZVBhcnNlciBleHRlbmRzIExvY2FsaXplUGFyc2VyIHtcclxuICBsb2FkKHJvdXRlczogUm91dGVzKTogUHJvbWlzZTxhbnk+IHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZTogYW55KSA9PiB7XHJcbiAgICAgIHRoaXMuaW5pdChyb3V0ZXMpLnRoZW4ocmVzb2x2ZSk7XHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuIl19