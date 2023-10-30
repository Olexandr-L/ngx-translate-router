import { Inject, Injectable } from '@angular/core';
// import { Location } from '@angular/common';
import { Router, NavigationStart, ActivatedRoute, NavigationCancel } from '@angular/router';
import { Subject, ReplaySubject } from 'rxjs';
import { filter, pairwise } from 'rxjs/operators';
import { LocalizeParser } from './localize-router.parser';
import { LocalizeRouterSettings } from './localize-router.config';
import { deepCopy } from './util';
import * as i0 from "@angular/core";
import * as i1 from "./localize-router.parser";
import * as i2 from "./localize-router.config";
import * as i3 from "@angular/router";
/**
 * Localization service
 * modifyRoutes
 */
export class LocalizeRouterService {
    /**
     * CTOR
     */
    constructor(parser, settings, router, route /*,
    @Inject(Location) private location: Location*/) {
        this.parser = parser;
        this.settings = settings;
        this.router = router;
        this.route = route;
        this.routerEvents = new Subject();
        const initializedSubject = new ReplaySubject(1);
        this.hooks = {
            _initializedSubject: initializedSubject,
            initialized: initializedSubject.asObservable()
        };
    }
    /**
     * Start up the service
     */
    init() {
        this.applyConfigToRouter(this.parser.routes);
        // subscribe to router events
        this.router.events
            .pipe(filter(event => event instanceof NavigationStart), pairwise())
            .subscribe(this._routeChanged());
        if (this.settings.initialNavigation) {
            this.router.initialNavigation();
        }
    }
    /**
     * Change language and navigate to translated route
     */
    changeLanguage(lang, extras, useNavigateMethod) {
        if (lang !== this.parser.currentLang) {
            const rootSnapshot = this.router.routerState.snapshot.root;
            this.parser.translateRoutes(lang).subscribe(() => {
                let url = this.traverseRouteSnapshot(rootSnapshot);
                url = this.translateRoute(url);
                if (!this.settings.alwaysSetPrefix) {
                    let urlSegments = url.split('/');
                    const languageSegmentIndex = urlSegments.indexOf(this.parser.currentLang);
                    // If the default language has no prefix make sure to remove and add it when necessary
                    if (this.parser.currentLang === this.parser.defaultLang) {
                        // Remove the language prefix from url when current language is the default language
                        if (languageSegmentIndex === 0 || (languageSegmentIndex === 1 && urlSegments[0] === '')) {
                            // Remove the current aka default language prefix from the url
                            urlSegments = urlSegments.slice(0, languageSegmentIndex).concat(urlSegments.slice(languageSegmentIndex + 1));
                        }
                    }
                    else {
                        // When coming from a default language it's possible that the url doesn't contain the language, make sure it does.
                        if (languageSegmentIndex === -1) {
                            // If the url starts with a slash make sure to keep it.
                            const injectionIndex = urlSegments[0] === '' ? 1 : 0;
                            urlSegments = urlSegments.slice(0, injectionIndex).concat(this.parser.currentLang, urlSegments.slice(injectionIndex));
                        }
                    }
                    url = urlSegments.join('/');
                }
                // Prevent multiple "/" character
                url = url.replace(/\/+/g, '/');
                const lastSlashIndex = url.lastIndexOf('/');
                if (lastSlashIndex > 0 && lastSlashIndex === url.length - 1) {
                    url = url.slice(0, -1);
                }
                const queryParamsObj = this.parser.chooseQueryParams(extras, this.route.snapshot.queryParams);
                this.applyConfigToRouter(this.parser.routes);
                this.lastExtras = extras;
                if (useNavigateMethod) {
                    const extrasToApply = extras ? { ...extras } : {};
                    if (queryParamsObj) {
                        extrasToApply.queryParams = queryParamsObj;
                    }
                    this.router.navigate([url], extrasToApply);
                }
                else {
                    let queryParams = this.parser.formatQueryParams(queryParamsObj);
                    queryParams = queryParams ? `?${queryParams}` : '';
                    this.router.navigateByUrl(`${url}${queryParams}`, extras);
                }
            });
        }
    }
    /**
     * Traverses through the tree to assemble new translated url
     */
    traverseRouteSnapshot(snapshot) {
        if (snapshot.firstChild && snapshot.routeConfig) {
            return `${this.parseSegmentValue(snapshot)}/${this.traverseRouteSnapshot(snapshot.firstChild)}`;
        }
        else if (snapshot.firstChild) {
            return this.traverseRouteSnapshot(snapshot.firstChild);
        }
        else {
            return '';
        }
        /* if (snapshot.firstChild && snapshot.firstChild.routeConfig && snapshot.firstChild.routeConfig.path) {
          if (snapshot.firstChild.routeConfig.path !== '**') {
            return this.parseSegmentValue(snapshot) + '/' + this.traverseRouteSnapshot(snapshot.firstChild);
          } else {
            return this.parseSegmentValue(snapshot.firstChild);
          }
        }
        return this.parseSegmentValue(snapshot); */
    }
    /**
     * Build URL from segments and snapshot (for params)
     */
    buildUrlFromSegments(snapshot, segments) {
        return segments.map((s, i) => s.indexOf(':') === 0 ? snapshot.url[i].path : s).join('/');
    }
    /**
     * Extracts new segment value based on routeConfig and url
     */
    parseSegmentValue(snapshot) {
        if (snapshot.routeConfig && snapshot.routeConfig.matcher) {
            const subPathMatchedSegments = this.parseSegmentValueMatcher(snapshot);
            return this.buildUrlFromSegments(snapshot, subPathMatchedSegments);
        }
        else if (snapshot.data.localizeRouter) {
            const path = snapshot.data.localizeRouter.path;
            const subPathSegments = path.split('/');
            return this.buildUrlFromSegments(snapshot, subPathSegments);
        }
        else if (snapshot.parent && snapshot.parent.parent) { // Not lang route and no localizeRouter data = excluded path
            const path = snapshot.routeConfig.path;
            const subPathSegments = path.split('/');
            return this.buildUrlFromSegments(snapshot, subPathSegments);
        }
        else {
            return '';
        }
        /* if (snapshot.routeConfig) {
          if (snapshot.routeConfig.path === '**') {
            return snapshot.url.filter((segment: UrlSegment) => segment.path).map((segment: UrlSegment) => segment.path).join('/');
          } else {
            const subPathSegments = snapshot.routeConfig.path.split('/');
            return subPathSegments.map((s: string, i: number) => s.indexOf(':') === 0 ? snapshot.url[i].path : s).join('/');
          }
        }
        return ''; */
    }
    parseSegmentValueMatcher(snapshot) {
        const localizeMatcherParams = snapshot.data && snapshot.data.localizeMatcher && snapshot.data.localizeMatcher.params || {};
        const subPathSegments = snapshot.url
            .map((segment) => {
            const currentPath = segment.path;
            const matchedParamName = segment.localizedParamName;
            const val = (matchedParamName && localizeMatcherParams[matchedParamName]) ?
                localizeMatcherParams[matchedParamName](currentPath) : null;
            return val || `${this.parser.getEscapePrefix()}${currentPath}`;
        });
        return subPathSegments;
    }
    /**
     * Translate route to current language
     * If new language is explicitly provided then replace language part in url with new language
     */
    translateRoute(path) {
        if (typeof path === 'string') {
            const url = this.parser.translateRoute(path);
            return !path.indexOf('/') ? this.parser.addPrefixToUrl(url) : url;
        }
        // it's an array
        const result = [];
        path.forEach((segment, index) => {
            if (typeof segment === 'string') {
                const res = this.parser.translateRoute(segment);
                if (!index && !segment.indexOf('/')) {
                    result.push(this.parser.addPrefixToUrl(res));
                }
                else {
                    result.push(res);
                }
            }
            else {
                result.push(segment);
            }
        });
        return result;
    }
    /**
     * Event handler to react on route change
     */
    _routeChanged() {
        return ([previousEvent, currentEvent]) => {
            const previousLang = this.parser.getLocationLang(previousEvent.url) || this.parser.defaultLang;
            const currentLang = this.parser.getLocationLang(currentEvent.url) || this.parser.defaultLang;
            const lastExtras = this.lastExtras;
            if (currentLang !== previousLang && this.latestUrl !== currentEvent.url) {
                this.latestUrl = currentEvent.url;
                this.cancelCurrentNavigation();
                this.parser.translateRoutes(currentLang)
                    .subscribe(() => {
                    // Reset routes again once they are all translated
                    this.applyConfigToRouter(this.parser.routes);
                    // Clear global extras
                    this.lastExtras = undefined;
                    // Init new navigation with same url to take new config in consideration
                    this.router.navigateByUrl(currentEvent.url, lastExtras);
                    // Fire route change event
                    this.routerEvents.next(currentLang);
                });
            }
            this.latestUrl = currentEvent.url;
        };
    }
    /**
     * Drop the current Navigation
     */
    cancelCurrentNavigation() {
        const currentNavigation = this.router.getCurrentNavigation();
        const url = this.router.serializeUrl(currentNavigation.extractedUrl);
        this.router.events.next(new NavigationCancel(currentNavigation.id, url, ''));
        this.router.navigationTransitions.transitions.next({
            ...this.router.navigationTransitions.transitions.getValue(),
            id: 0,
        });
    }
    /**
     * Apply config to Angular RouterModule
     * @param config routes to apply
     */
    applyConfigToRouter(config) {
        this.router.resetConfig(deepCopy(config));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.10", ngImport: i0, type: LocalizeRouterService, deps: [{ token: LocalizeParser }, { token: LocalizeRouterSettings }, { token: Router }, { token: ActivatedRoute }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.2.10", ngImport: i0, type: LocalizeRouterService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.10", ngImport: i0, type: LocalizeRouterService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.LocalizeParser, decorators: [{
                    type: Inject,
                    args: [LocalizeParser]
                }] }, { type: i2.LocalizeRouterSettings, decorators: [{
                    type: Inject,
                    args: [LocalizeRouterSettings]
                }] }, { type: i3.Router, decorators: [{
                    type: Inject,
                    args: [Router]
                }] }, { type: i3.ActivatedRoute, decorators: [{
                    type: Inject,
                    args: [ActivatedRoute]
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYWxpemUtcm91dGVyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3gtdHJhbnNsYXRlLXJvdXRlci9zcmMvbGliL2xvY2FsaXplLXJvdXRlci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ25ELDhDQUE4QztBQUM5QyxPQUFPLEVBQ0wsTUFBTSxFQUFFLGVBQWUsRUFBNEMsY0FBYyxFQUMxRSxnQkFBZ0IsRUFDeEIsTUFBTSxpQkFBaUIsQ0FBQztBQUN6QixPQUFPLEVBQUUsT0FBTyxFQUFjLGFBQWEsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUMxRCxPQUFPLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRWxELE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUMxRCxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUVsRSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sUUFBUSxDQUFDOzs7OztBQUVsQzs7O0dBR0c7QUFFSCxNQUFNLE9BQU8scUJBQXFCO0lBWWhDOztPQUVHO0lBQ0gsWUFDbUMsTUFBc0IsRUFDZCxRQUFnQyxFQUMvQyxNQUFjLEVBQ04sS0FBcUIsQ0FBQTtrREFDUDtRQUpmLFdBQU0sR0FBTixNQUFNLENBQWdCO1FBQ2QsYUFBUSxHQUFSLFFBQVEsQ0FBd0I7UUFDL0MsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUNOLFVBQUssR0FBTCxLQUFLLENBQWdCO1FBR3JELElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxPQUFPLEVBQVUsQ0FBQztRQUMxQyxNQUFNLGtCQUFrQixHQUFHLElBQUksYUFBYSxDQUFVLENBQUMsQ0FBQyxDQUFDO1FBQ3pELElBQUksQ0FBQyxLQUFLLEdBQUc7WUFDWCxt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J0Bhbmd1bGFyL2NvcmUnO1xyXG4vLyBpbXBvcnQgeyBMb2NhdGlvbiB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XHJcbmltcG9ydCB7XHJcbiAgUm91dGVyLCBOYXZpZ2F0aW9uU3RhcnQsIEFjdGl2YXRlZFJvdXRlU25hcHNob3QsIE5hdmlnYXRpb25FeHRyYXMsIEFjdGl2YXRlZFJvdXRlLFxyXG4gIEV2ZW50LCBOYXZpZ2F0aW9uQ2FuY2VsLCBSb3V0ZXNcclxufSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xyXG5pbXBvcnQgeyBTdWJqZWN0LCBPYnNlcnZhYmxlLCBSZXBsYXlTdWJqZWN0IH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IGZpbHRlciwgcGFpcndpc2UgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XHJcblxyXG5pbXBvcnQgeyBMb2NhbGl6ZVBhcnNlciB9IGZyb20gJy4vbG9jYWxpemUtcm91dGVyLnBhcnNlcic7XHJcbmltcG9ydCB7IExvY2FsaXplUm91dGVyU2V0dGluZ3MgfSBmcm9tICcuL2xvY2FsaXplLXJvdXRlci5jb25maWcnO1xyXG5pbXBvcnQgeyBMb2NhbGl6ZWRNYXRjaGVyVXJsU2VnbWVudCB9IGZyb20gJy4vbG9jYWxpemVkLW1hdGNoZXItdXJsLXNlZ21lbnQnO1xyXG5pbXBvcnQgeyBkZWVwQ29weSB9IGZyb20gJy4vdXRpbCc7XHJcblxyXG4vKipcclxuICogTG9jYWxpemF0aW9uIHNlcnZpY2VcclxuICogbW9kaWZ5Um91dGVzXHJcbiAqL1xyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBMb2NhbGl6ZVJvdXRlclNlcnZpY2Uge1xyXG4gIHJvdXRlckV2ZW50czogU3ViamVjdDxzdHJpbmc+O1xyXG4gIGhvb2tzOiB7XHJcbiAgICAvKiogQGludGVybmFsICovXHJcbiAgICBfaW5pdGlhbGl6ZWRTdWJqZWN0OiBSZXBsYXlTdWJqZWN0PGJvb2xlYW4+O1xyXG4gICAgaW5pdGlhbGl6ZWQ6IE9ic2VydmFibGU8Ym9vbGVhbj47XHJcbiAgfTtcclxuXHJcblxyXG4gIHByaXZhdGUgbGF0ZXN0VXJsOiBzdHJpbmc7XHJcbiAgcHJpdmF0ZSBsYXN0RXh0cmFzPzogTmF2aWdhdGlvbkV4dHJhcztcclxuXHJcbiAgLyoqXHJcbiAgICogQ1RPUlxyXG4gICAqL1xyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgICBASW5qZWN0KExvY2FsaXplUGFyc2VyKSBwdWJsaWMgcGFyc2VyOiBMb2NhbGl6ZVBhcnNlcixcclxuICAgICAgQEluamVjdChMb2NhbGl6ZVJvdXRlclNldHRpbmdzKSBwdWJsaWMgc2V0dGluZ3M6IExvY2FsaXplUm91dGVyU2V0dGluZ3MsXHJcbiAgICAgIEBJbmplY3QoUm91dGVyKSBwcml2YXRlIHJvdXRlcjogUm91dGVyLFxyXG4gICAgICBASW5qZWN0KEFjdGl2YXRlZFJvdXRlKSBwcml2YXRlIHJvdXRlOiBBY3RpdmF0ZWRSb3V0ZS8qLFxyXG4gICAgICBASW5qZWN0KExvY2F0aW9uKSBwcml2YXRlIGxvY2F0aW9uOiBMb2NhdGlvbiovXHJcbiAgICApIHtcclxuICAgICAgdGhpcy5yb3V0ZXJFdmVudHMgPSBuZXcgU3ViamVjdDxzdHJpbmc+KCk7XHJcbiAgICAgIGNvbnN0IGluaXRpYWxpemVkU3ViamVjdCA9IG5ldyBSZXBsYXlTdWJqZWN0PGJvb2xlYW4+KDEpO1xyXG4gICAgICB0aGlzLmhvb2tzID0ge1xyXG4gICAgICAgIF9pbml0aWFsaXplZFN1YmplY3Q6IGluaXRpYWxpemVkU3ViamVjdCxcclxuICAgICAgICBpbml0aWFsaXplZDogaW5pdGlhbGl6ZWRTdWJqZWN0LmFzT2JzZXJ2YWJsZSgpXHJcbiAgICAgIH07XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTdGFydCB1cCB0aGUgc2VydmljZVxyXG4gICAqL1xyXG4gIGluaXQoKTogdm9pZCB7XHJcbiAgICB0aGlzLmFwcGx5Q29uZmlnVG9Sb3V0ZXIodGhpcy5wYXJzZXIucm91dGVzKTtcclxuICAgIC8vIHN1YnNjcmliZSB0byByb3V0ZXIgZXZlbnRzXHJcbiAgICB0aGlzLnJvdXRlci5ldmVudHNcclxuICAgICAgLnBpcGUoXHJcbiAgICAgICAgZmlsdGVyKGV2ZW50ID0+IGV2ZW50IGluc3RhbmNlb2YgTmF2aWdhdGlvblN0YXJ0KSxcclxuICAgICAgICBwYWlyd2lzZSgpXHJcbiAgICAgIClcclxuICAgICAgLnN1YnNjcmliZSh0aGlzLl9yb3V0ZUNoYW5nZWQoKSk7XHJcblxyXG4gICAgaWYgKHRoaXMuc2V0dGluZ3MuaW5pdGlhbE5hdmlnYXRpb24pIHtcclxuICAgICAgdGhpcy5yb3V0ZXIuaW5pdGlhbE5hdmlnYXRpb24oKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENoYW5nZSBsYW5ndWFnZSBhbmQgbmF2aWdhdGUgdG8gdHJhbnNsYXRlZCByb3V0ZVxyXG4gICAqL1xyXG4gIGNoYW5nZUxhbmd1YWdlKGxhbmc6IHN0cmluZywgZXh0cmFzPzogTmF2aWdhdGlvbkV4dHJhcywgdXNlTmF2aWdhdGVNZXRob2Q/OiBib29sZWFuKTogdm9pZCB7XHJcblxyXG4gICAgaWYgKGxhbmcgIT09IHRoaXMucGFyc2VyLmN1cnJlbnRMYW5nKSB7XHJcbiAgICAgIGNvbnN0IHJvb3RTbmFwc2hvdDogQWN0aXZhdGVkUm91dGVTbmFwc2hvdCA9IHRoaXMucm91dGVyLnJvdXRlclN0YXRlLnNuYXBzaG90LnJvb3Q7XHJcblxyXG4gICAgICB0aGlzLnBhcnNlci50cmFuc2xhdGVSb3V0ZXMobGFuZykuc3Vic2NyaWJlKCgpID0+IHtcclxuXHJcbiAgICAgICAgbGV0IHVybCA9IHRoaXMudHJhdmVyc2VSb3V0ZVNuYXBzaG90KHJvb3RTbmFwc2hvdCk7XHJcbiAgICAgICAgdXJsID0gdGhpcy50cmFuc2xhdGVSb3V0ZSh1cmwpIGFzIHN0cmluZztcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLnNldHRpbmdzLmFsd2F5c1NldFByZWZpeCkge1xyXG4gICAgICAgICAgbGV0IHVybFNlZ21lbnRzID0gdXJsLnNwbGl0KCcvJyk7XHJcbiAgICAgICAgICBjb25zdCBsYW5ndWFnZVNlZ21lbnRJbmRleCA9IHVybFNlZ21lbnRzLmluZGV4T2YodGhpcy5wYXJzZXIuY3VycmVudExhbmcpO1xyXG4gICAgICAgICAgLy8gSWYgdGhlIGRlZmF1bHQgbGFuZ3VhZ2UgaGFzIG5vIHByZWZpeCBtYWtlIHN1cmUgdG8gcmVtb3ZlIGFuZCBhZGQgaXQgd2hlbiBuZWNlc3NhcnlcclxuICAgICAgICAgIGlmICh0aGlzLnBhcnNlci5jdXJyZW50TGFuZyA9PT0gdGhpcy5wYXJzZXIuZGVmYXVsdExhbmcpIHtcclxuICAgICAgICAgICAgLy8gUmVtb3ZlIHRoZSBsYW5ndWFnZSBwcmVmaXggZnJvbSB1cmwgd2hlbiBjdXJyZW50IGxhbmd1YWdlIGlzIHRoZSBkZWZhdWx0IGxhbmd1YWdlXHJcbiAgICAgICAgICAgIGlmIChsYW5ndWFnZVNlZ21lbnRJbmRleCA9PT0gMCB8fCAobGFuZ3VhZ2VTZWdtZW50SW5kZXggPT09IDEgJiYgdXJsU2VnbWVudHNbMF0gPT09ICcnKSkge1xyXG4gICAgICAgICAgICAgIC8vIFJlbW92ZSB0aGUgY3VycmVudCBha2EgZGVmYXVsdCBsYW5ndWFnZSBwcmVmaXggZnJvbSB0aGUgdXJsXHJcbiAgICAgICAgICAgICAgdXJsU2VnbWVudHMgPSB1cmxTZWdtZW50cy5zbGljZSgwLCBsYW5ndWFnZVNlZ21lbnRJbmRleCkuY29uY2F0KHVybFNlZ21lbnRzLnNsaWNlKGxhbmd1YWdlU2VnbWVudEluZGV4ICsgMSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvLyBXaGVuIGNvbWluZyBmcm9tIGEgZGVmYXVsdCBsYW5ndWFnZSBpdCdzIHBvc3NpYmxlIHRoYXQgdGhlIHVybCBkb2Vzbid0IGNvbnRhaW4gdGhlIGxhbmd1YWdlLCBtYWtlIHN1cmUgaXQgZG9lcy5cclxuICAgICAgICAgICAgaWYgKGxhbmd1YWdlU2VnbWVudEluZGV4ID09PSAtMSkge1xyXG4gICAgICAgICAgICAgIC8vIElmIHRoZSB1cmwgc3RhcnRzIHdpdGggYSBzbGFzaCBtYWtlIHN1cmUgdG8ga2VlcCBpdC5cclxuICAgICAgICAgICAgICBjb25zdCBpbmplY3Rpb25JbmRleCA9IHVybFNlZ21lbnRzWzBdID09PSAnJyA/IDEgOiAwO1xyXG4gICAgICAgICAgICAgIHVybFNlZ21lbnRzID0gdXJsU2VnbWVudHMuc2xpY2UoMCwgaW5qZWN0aW9uSW5kZXgpLmNvbmNhdCh0aGlzLnBhcnNlci5jdXJyZW50TGFuZywgdXJsU2VnbWVudHMuc2xpY2UoaW5qZWN0aW9uSW5kZXgpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgdXJsID0gdXJsU2VnbWVudHMuam9pbignLycpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gUHJldmVudCBtdWx0aXBsZSBcIi9cIiBjaGFyYWN0ZXJcclxuICAgICAgICB1cmwgPSB1cmwucmVwbGFjZSgvXFwvKy9nLCAnLycpO1xyXG5cclxuICAgICAgICBjb25zdCBsYXN0U2xhc2hJbmRleCA9IHVybC5sYXN0SW5kZXhPZignLycpO1xyXG4gICAgICAgIGlmIChsYXN0U2xhc2hJbmRleCA+IDAgJiYgbGFzdFNsYXNoSW5kZXggPT09IHVybC5sZW5ndGggLSAxKSB7XHJcbiAgICAgICAgICB1cmwgPSB1cmwuc2xpY2UoMCwgLTEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgcXVlcnlQYXJhbXNPYmogPSB0aGlzLnBhcnNlci5jaG9vc2VRdWVyeVBhcmFtcyhleHRyYXMsIHRoaXMucm91dGUuc25hcHNob3QucXVlcnlQYXJhbXMpO1xyXG5cclxuICAgICAgICB0aGlzLmFwcGx5Q29uZmlnVG9Sb3V0ZXIodGhpcy5wYXJzZXIucm91dGVzKTtcclxuXHJcbiAgICAgICAgdGhpcy5sYXN0RXh0cmFzID0gZXh0cmFzO1xyXG4gICAgICAgIGlmICh1c2VOYXZpZ2F0ZU1ldGhvZCkge1xyXG4gICAgICAgICAgY29uc3QgZXh0cmFzVG9BcHBseTogTmF2aWdhdGlvbkV4dHJhcyA9IGV4dHJhcyA/IHsuLi5leHRyYXN9IDoge307XHJcbiAgICAgICAgICBpZiAocXVlcnlQYXJhbXNPYmopIHtcclxuICAgICAgICAgICAgZXh0cmFzVG9BcHBseS5xdWVyeVBhcmFtcyA9IHF1ZXJ5UGFyYW1zT2JqO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoW3VybF0sIGV4dHJhc1RvQXBwbHkpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBsZXQgcXVlcnlQYXJhbXMgPSB0aGlzLnBhcnNlci5mb3JtYXRRdWVyeVBhcmFtcyhxdWVyeVBhcmFtc09iaik7XHJcbiAgICAgICAgICBxdWVyeVBhcmFtcyA9IHF1ZXJ5UGFyYW1zID8gYD8ke3F1ZXJ5UGFyYW1zfWAgOiAnJztcclxuICAgICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlQnlVcmwoYCR7dXJsfSR7cXVlcnlQYXJhbXN9YCwgZXh0cmFzKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogVHJhdmVyc2VzIHRocm91Z2ggdGhlIHRyZWUgdG8gYXNzZW1ibGUgbmV3IHRyYW5zbGF0ZWQgdXJsXHJcbiAgICovXHJcbiAgcHJpdmF0ZSB0cmF2ZXJzZVJvdXRlU25hcHNob3Qoc25hcHNob3Q6IEFjdGl2YXRlZFJvdXRlU25hcHNob3QpOiBzdHJpbmcge1xyXG4gICAgaWYgKHNuYXBzaG90LmZpcnN0Q2hpbGQgJiYgc25hcHNob3Qucm91dGVDb25maWcpIHtcclxuICAgICAgcmV0dXJuIGAke3RoaXMucGFyc2VTZWdtZW50VmFsdWUoc25hcHNob3QpfS8ke3RoaXMudHJhdmVyc2VSb3V0ZVNuYXBzaG90KHNuYXBzaG90LmZpcnN0Q2hpbGQpfWA7XHJcbiAgICB9IGVsc2UgaWYgKHNuYXBzaG90LmZpcnN0Q2hpbGQpIHtcclxuICAgICAgcmV0dXJuIHRoaXMudHJhdmVyc2VSb3V0ZVNuYXBzaG90KHNuYXBzaG90LmZpcnN0Q2hpbGQpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuICcnO1xyXG4gICAgfVxyXG4gICAgLyogaWYgKHNuYXBzaG90LmZpcnN0Q2hpbGQgJiYgc25hcHNob3QuZmlyc3RDaGlsZC5yb3V0ZUNvbmZpZyAmJiBzbmFwc2hvdC5maXJzdENoaWxkLnJvdXRlQ29uZmlnLnBhdGgpIHtcclxuICAgICAgaWYgKHNuYXBzaG90LmZpcnN0Q2hpbGQucm91dGVDb25maWcucGF0aCAhPT0gJyoqJykge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnBhcnNlU2VnbWVudFZhbHVlKHNuYXBzaG90KSArICcvJyArIHRoaXMudHJhdmVyc2VSb3V0ZVNuYXBzaG90KHNuYXBzaG90LmZpcnN0Q2hpbGQpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnBhcnNlU2VnbWVudFZhbHVlKHNuYXBzaG90LmZpcnN0Q2hpbGQpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcy5wYXJzZVNlZ21lbnRWYWx1ZShzbmFwc2hvdCk7ICovXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBCdWlsZCBVUkwgZnJvbSBzZWdtZW50cyBhbmQgc25hcHNob3QgKGZvciBwYXJhbXMpXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBidWlsZFVybEZyb21TZWdtZW50cyhzbmFwc2hvdDogQWN0aXZhdGVkUm91dGVTbmFwc2hvdCwgc2VnbWVudHM6IHN0cmluZ1tdKTogc3RyaW5nIHtcclxuICAgIHJldHVybiBzZWdtZW50cy5tYXAoKHM6IHN0cmluZywgaTogbnVtYmVyKSA9PiBzLmluZGV4T2YoJzonKSA9PT0gMCA/IHNuYXBzaG90LnVybFtpXS5wYXRoIDogcykuam9pbignLycpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRXh0cmFjdHMgbmV3IHNlZ21lbnQgdmFsdWUgYmFzZWQgb24gcm91dGVDb25maWcgYW5kIHVybFxyXG4gICAqL1xyXG4gIHByaXZhdGUgcGFyc2VTZWdtZW50VmFsdWUoc25hcHNob3Q6IEFjdGl2YXRlZFJvdXRlU25hcHNob3QpOiBzdHJpbmcge1xyXG4gICAgaWYgKHNuYXBzaG90LnJvdXRlQ29uZmlnICYmIHNuYXBzaG90LnJvdXRlQ29uZmlnLm1hdGNoZXIpIHtcclxuICAgICAgY29uc3Qgc3ViUGF0aE1hdGNoZWRTZWdtZW50cyA9IHRoaXMucGFyc2VTZWdtZW50VmFsdWVNYXRjaGVyKHNuYXBzaG90KTtcclxuICAgICAgcmV0dXJuIHRoaXMuYnVpbGRVcmxGcm9tU2VnbWVudHMoc25hcHNob3QsIHN1YlBhdGhNYXRjaGVkU2VnbWVudHMpO1xyXG4gICAgfSBlbHNlIGlmIChzbmFwc2hvdC5kYXRhLmxvY2FsaXplUm91dGVyKSB7XHJcbiAgICAgIGNvbnN0IHBhdGggPSBzbmFwc2hvdC5kYXRhLmxvY2FsaXplUm91dGVyLnBhdGg7XHJcbiAgICAgIGNvbnN0IHN1YlBhdGhTZWdtZW50cyA9IHBhdGguc3BsaXQoJy8nKTtcclxuICAgICAgcmV0dXJuIHRoaXMuYnVpbGRVcmxGcm9tU2VnbWVudHMoc25hcHNob3QsIHN1YlBhdGhTZWdtZW50cyk7XHJcbiAgICB9IGVsc2UgaWYgKHNuYXBzaG90LnBhcmVudCAmJiBzbmFwc2hvdC5wYXJlbnQucGFyZW50KSB7IC8vIE5vdCBsYW5nIHJvdXRlIGFuZCBubyBsb2NhbGl6ZVJvdXRlciBkYXRhID0gZXhjbHVkZWQgcGF0aFxyXG4gICAgICBjb25zdCBwYXRoID0gc25hcHNob3Qucm91dGVDb25maWcucGF0aDtcclxuICAgICAgY29uc3Qgc3ViUGF0aFNlZ21lbnRzID0gcGF0aC5zcGxpdCgnLycpO1xyXG4gICAgICByZXR1cm4gdGhpcy5idWlsZFVybEZyb21TZWdtZW50cyhzbmFwc2hvdCwgc3ViUGF0aFNlZ21lbnRzKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiAnJztcclxuICAgIH1cclxuICAgIC8qIGlmIChzbmFwc2hvdC5yb3V0ZUNvbmZpZykge1xyXG4gICAgICBpZiAoc25hcHNob3Qucm91dGVDb25maWcucGF0aCA9PT0gJyoqJykge1xyXG4gICAgICAgIHJldHVybiBzbmFwc2hvdC51cmwuZmlsdGVyKChzZWdtZW50OiBVcmxTZWdtZW50KSA9PiBzZWdtZW50LnBhdGgpLm1hcCgoc2VnbWVudDogVXJsU2VnbWVudCkgPT4gc2VnbWVudC5wYXRoKS5qb2luKCcvJyk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29uc3Qgc3ViUGF0aFNlZ21lbnRzID0gc25hcHNob3Qucm91dGVDb25maWcucGF0aC5zcGxpdCgnLycpO1xyXG4gICAgICAgIHJldHVybiBzdWJQYXRoU2VnbWVudHMubWFwKChzOiBzdHJpbmcsIGk6IG51bWJlcikgPT4gcy5pbmRleE9mKCc6JykgPT09IDAgPyBzbmFwc2hvdC51cmxbaV0ucGF0aCA6IHMpLmpvaW4oJy8nKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuICcnOyAqL1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBwYXJzZVNlZ21lbnRWYWx1ZU1hdGNoZXIoc25hcHNob3Q6IEFjdGl2YXRlZFJvdXRlU25hcHNob3QpOiBzdHJpbmdbXSB7XHJcbiAgICBjb25zdCBsb2NhbGl6ZU1hdGNoZXJQYXJhbXMgPSBzbmFwc2hvdC5kYXRhICYmIHNuYXBzaG90LmRhdGEubG9jYWxpemVNYXRjaGVyICYmIHNuYXBzaG90LmRhdGEubG9jYWxpemVNYXRjaGVyLnBhcmFtcyB8fCB7IH07XHJcbiAgICBjb25zdCBzdWJQYXRoU2VnbWVudHM6IHN0cmluZ1tdID0gc25hcHNob3QudXJsXHJcbiAgICAgIC5tYXAoKHNlZ21lbnQ6IExvY2FsaXplZE1hdGNoZXJVcmxTZWdtZW50KSA9PiB7XHJcbiAgICAgICAgY29uc3QgY3VycmVudFBhdGggPSBzZWdtZW50LnBhdGg7XHJcbiAgICAgICAgY29uc3QgbWF0Y2hlZFBhcmFtTmFtZSA9IHNlZ21lbnQubG9jYWxpemVkUGFyYW1OYW1lO1xyXG4gICAgICAgIGNvbnN0IHZhbCA9IChtYXRjaGVkUGFyYW1OYW1lICYmIGxvY2FsaXplTWF0Y2hlclBhcmFtc1ttYXRjaGVkUGFyYW1OYW1lXSkgP1xyXG4gICAgICAgICAgbG9jYWxpemVNYXRjaGVyUGFyYW1zW21hdGNoZWRQYXJhbU5hbWVdKGN1cnJlbnRQYXRoKSA6IG51bGw7XHJcbiAgICAgICAgcmV0dXJuIHZhbCB8fCBgJHt0aGlzLnBhcnNlci5nZXRFc2NhcGVQcmVmaXgoKX0ke2N1cnJlbnRQYXRofWA7XHJcbiAgICAgIH0pO1xyXG4gICAgcmV0dXJuIHN1YlBhdGhTZWdtZW50cztcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFRyYW5zbGF0ZSByb3V0ZSB0byBjdXJyZW50IGxhbmd1YWdlXHJcbiAgICogSWYgbmV3IGxhbmd1YWdlIGlzIGV4cGxpY2l0bHkgcHJvdmlkZWQgdGhlbiByZXBsYWNlIGxhbmd1YWdlIHBhcnQgaW4gdXJsIHdpdGggbmV3IGxhbmd1YWdlXHJcbiAgICovXHJcbiAgdHJhbnNsYXRlUm91dGUocGF0aDogc3RyaW5nIHwgYW55W10pOiBzdHJpbmcgfCBhbnlbXSB7XHJcbiAgICBpZiAodHlwZW9mIHBhdGggPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgIGNvbnN0IHVybCA9IHRoaXMucGFyc2VyLnRyYW5zbGF0ZVJvdXRlKHBhdGgpO1xyXG4gICAgICByZXR1cm4gIXBhdGguaW5kZXhPZignLycpID8gdGhpcy5wYXJzZXIuYWRkUHJlZml4VG9VcmwodXJsKSA6IHVybDtcclxuICAgIH1cclxuICAgIC8vIGl0J3MgYW4gYXJyYXlcclxuICAgIGNvbnN0IHJlc3VsdDogYW55W10gPSBbXTtcclxuICAgIChwYXRoIGFzIEFycmF5PGFueT4pLmZvckVhY2goKHNlZ21lbnQ6IGFueSwgaW5kZXg6IG51bWJlcikgPT4ge1xyXG4gICAgICBpZiAodHlwZW9mIHNlZ21lbnQgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgY29uc3QgcmVzID0gdGhpcy5wYXJzZXIudHJhbnNsYXRlUm91dGUoc2VnbWVudCk7XHJcbiAgICAgICAgaWYgKCFpbmRleCAmJiAhc2VnbWVudC5pbmRleE9mKCcvJykpIHtcclxuICAgICAgICAgIHJlc3VsdC5wdXNoKHRoaXMucGFyc2VyLmFkZFByZWZpeFRvVXJsKHJlcykpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICByZXN1bHQucHVzaChyZXMpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByZXN1bHQucHVzaChzZWdtZW50KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRXZlbnQgaGFuZGxlciB0byByZWFjdCBvbiByb3V0ZSBjaGFuZ2VcclxuICAgKi9cclxuICBwcml2YXRlIF9yb3V0ZUNoYW5nZWQoKTogKGV2ZW50UGFpcjogW05hdmlnYXRpb25TdGFydCwgTmF2aWdhdGlvblN0YXJ0XSkgPT4gdm9pZCB7XHJcbiAgICByZXR1cm4gKFtwcmV2aW91c0V2ZW50LCBjdXJyZW50RXZlbnRdOiBbTmF2aWdhdGlvblN0YXJ0LCBOYXZpZ2F0aW9uU3RhcnRdKSA9PiB7XHJcbiAgICAgIGNvbnN0IHByZXZpb3VzTGFuZyA9IHRoaXMucGFyc2VyLmdldExvY2F0aW9uTGFuZyhwcmV2aW91c0V2ZW50LnVybCkgfHwgdGhpcy5wYXJzZXIuZGVmYXVsdExhbmc7XHJcbiAgICAgIGNvbnN0IGN1cnJlbnRMYW5nID0gdGhpcy5wYXJzZXIuZ2V0TG9jYXRpb25MYW5nKGN1cnJlbnRFdmVudC51cmwpIHx8IHRoaXMucGFyc2VyLmRlZmF1bHRMYW5nO1xyXG4gICAgICBjb25zdCBsYXN0RXh0cmFzID0gdGhpcy5sYXN0RXh0cmFzO1xyXG5cclxuICAgICAgaWYgKGN1cnJlbnRMYW5nICE9PSBwcmV2aW91c0xhbmcgJiYgdGhpcy5sYXRlc3RVcmwgIT09IGN1cnJlbnRFdmVudC51cmwpIHtcclxuICAgICAgICB0aGlzLmxhdGVzdFVybCA9IGN1cnJlbnRFdmVudC51cmw7XHJcbiAgICAgICAgdGhpcy5jYW5jZWxDdXJyZW50TmF2aWdhdGlvbigpO1xyXG4gICAgICAgIHRoaXMucGFyc2VyLnRyYW5zbGF0ZVJvdXRlcyhjdXJyZW50TGFuZylcclxuICAgICAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xyXG4gICAgICAgICAgICAvLyBSZXNldCByb3V0ZXMgYWdhaW4gb25jZSB0aGV5IGFyZSBhbGwgdHJhbnNsYXRlZFxyXG4gICAgICAgICAgICB0aGlzLmFwcGx5Q29uZmlnVG9Sb3V0ZXIodGhpcy5wYXJzZXIucm91dGVzKTtcclxuICAgICAgICAgICAgLy8gQ2xlYXIgZ2xvYmFsIGV4dHJhc1xyXG4gICAgICAgICAgICB0aGlzLmxhc3RFeHRyYXMgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIC8vIEluaXQgbmV3IG5hdmlnYXRpb24gd2l0aCBzYW1lIHVybCB0byB0YWtlIG5ldyBjb25maWcgaW4gY29uc2lkZXJhdGlvblxyXG4gICAgICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZUJ5VXJsKGN1cnJlbnRFdmVudC51cmwsIGxhc3RFeHRyYXMpO1xyXG4gICAgICAgICAgICAvLyBGaXJlIHJvdXRlIGNoYW5nZSBldmVudFxyXG4gICAgICAgICAgICB0aGlzLnJvdXRlckV2ZW50cy5uZXh0KGN1cnJlbnRMYW5nKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMubGF0ZXN0VXJsID0gY3VycmVudEV2ZW50LnVybDtcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBEcm9wIHRoZSBjdXJyZW50IE5hdmlnYXRpb25cclxuICAgKi9cclxuICBwcml2YXRlIGNhbmNlbEN1cnJlbnROYXZpZ2F0aW9uKCkge1xyXG4gICAgY29uc3QgY3VycmVudE5hdmlnYXRpb24gPSB0aGlzLnJvdXRlci5nZXRDdXJyZW50TmF2aWdhdGlvbigpO1xyXG4gICAgY29uc3QgdXJsID0gdGhpcy5yb3V0ZXIuc2VyaWFsaXplVXJsKGN1cnJlbnROYXZpZ2F0aW9uLmV4dHJhY3RlZFVybCk7XHJcbiAgICAodGhpcy5yb3V0ZXIuZXZlbnRzIGFzIFN1YmplY3Q8RXZlbnQ+KS5uZXh0KG5ldyBOYXZpZ2F0aW9uQ2FuY2VsKGN1cnJlbnROYXZpZ2F0aW9uLmlkLCB1cmwsICcnKSk7XHJcbiAgICAodGhpcy5yb3V0ZXIgYXMgYW55KS5uYXZpZ2F0aW9uVHJhbnNpdGlvbnMudHJhbnNpdGlvbnMubmV4dCh7XHJcbiAgICAgIC4uLih0aGlzLnJvdXRlciBhcyBhbnkpLm5hdmlnYXRpb25UcmFuc2l0aW9ucy50cmFuc2l0aW9ucy5nZXRWYWx1ZSgpLFxyXG4gICAgICBpZDogMCxcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQXBwbHkgY29uZmlnIHRvIEFuZ3VsYXIgUm91dGVyTW9kdWxlXHJcbiAgICogQHBhcmFtIGNvbmZpZyByb3V0ZXMgdG8gYXBwbHlcclxuICAgKi9cclxuICBwcml2YXRlIGFwcGx5Q29uZmlnVG9Sb3V0ZXIoY29uZmlnOiBSb3V0ZXMpIHtcclxuICAgIHRoaXMucm91dGVyLnJlc2V0Q29uZmlnKGRlZXBDb3B5KGNvbmZpZykpO1xyXG4gIH1cclxuXHJcbn1cclxuIl19