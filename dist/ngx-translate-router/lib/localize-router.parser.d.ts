import { Routes, NavigationExtras, Params } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { Location } from '@angular/common';
import { LocalizeRouterSettings } from './localize-router.config';
import * as i0 from "@angular/core";
/**
 * Abstract class for parsing localization
 */
export declare abstract class LocalizeParser {
    private translate;
    private location;
    private settings;
    locales: Array<string>;
    currentLang: string;
    routes: Routes;
    defaultLang: string;
    protected prefix: string;
    protected escapePrefix: string;
    private _translationObject;
    private _wildcardRoute;
    private _languageRoute;
    /**
     * Loader constructor
     */
    constructor(translate: TranslateService, location: Location, settings: LocalizeRouterSettings);
    /**
     * Load routes and fetch necessary data
     */
    abstract load(routes: Routes): Promise<any>;
    /**
   * Prepare routes to be fully usable by ngx-translate-router
   * @param routes
   */
    /**
     * Initialize language and routes
     */
    protected init(routes: Routes): Promise<any>;
    initChildRoutes(routes: Routes): Routes;
    /**
     * Translate routes to selected language
     */
    translateRoutes(language: string): Observable<any>;
    /**
     * Translate the route node and recursively call for all it's children
     */
    private _translateRouteTree;
    /**
     * Translate property
     * If first time translation then add original to route data object
     */
    private _translateProperty;
    get urlPrefix(): string;
    /**
     * Add current lang as prefix to given url.
     */
    addPrefixToUrl(url: string): string;
    /**
     * Translate route and return observable
     */
    translateRoute(path: string): string;
    /**
     * Get language from url
     */
    getLocationLang(url?: string): string;
    /**
     * Get user's language set in the browser
     */
    private _getBrowserLang;
    /**
     * Get language from local storage or cookie
     */
    private get _cachedLang();
    /**
     * Save language to local storage or cookie
     */
    private set _cachedLang(value);
    /**
     * Cache value to local storage
     */
    private _cacheWithLocalStorage;
    /**
     * Cache value to session storage
     */
    private _cacheWithSessionStorage;
    /**
     * Cache value via cookies
     */
    private _cacheWithCookies;
    /**
     * Check if value exists in locales list
     */
    private _returnIfInLocales;
    /**
     * Get translated value
     */
    private translateText;
    /**
     * Strategy to choose between new or old queryParams
     * @param newExtras extras that containes new QueryParams
     * @param currentQueryParams current query params
     */
    chooseQueryParams(newExtras: NavigationExtras, currentQueryParams: Params): Params;
    /**
     * Format query params from object to string.
     * Exemple of result: `param=value&param2=value2`
     * @param params query params object
     */
    formatQueryParams(params: Params): string;
    /**
     * Get translation key prefix from config
     */
    getPrefix(): string;
    /**
     * Get escape translation prefix from config
     */
    getEscapePrefix(): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<LocalizeParser, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<LocalizeParser>;
}
/**
 * Manually set configuration
 */
export declare class ManualParserLoader extends LocalizeParser {
    /**
     * CTOR
     */
    constructor(translate: TranslateService, location: Location, settings: LocalizeRouterSettings, locales?: string[], prefix?: string, escapePrefix?: string);
    /**
     * Initialize or append routes
     */
    load(routes: Routes): Promise<any>;
}
export declare class DummyLocalizeParser extends LocalizeParser {
    load(routes: Routes): Promise<any>;
    static ɵfac: i0.ɵɵFactoryDeclaration<DummyLocalizeParser, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<DummyLocalizeParser>;
}
