import { InjectionToken, Provider } from '@angular/core';
import { Routes } from '@angular/router';
import { LocalizeRouterModule } from './localize-router.module';
import * as i0 from "@angular/core";
/**
 * Guard to make sure we have single initialization of forRoot
 */
export declare const LOCALIZE_ROUTER_FORROOT_GUARD: InjectionToken<LocalizeRouterModule>;
/**
 * Static provider for keeping track of routes
 */
export declare const RAW_ROUTES: InjectionToken<Routes[]>;
/**
 * Type for Caching of default language
 */
/**
 * Namespace for fail proof access of CacheMechanism
 */
export declare enum CacheMechanism {
    LocalStorage = "LocalStorage",
    SessionStorage = "SessionStorage",
    Cookie = "Cookie"
}
/**
 * Boolean to indicate whether to use cached language value
 */
export declare const USE_CACHED_LANG: InjectionToken<boolean>;
/**
 * Cache mechanism type
 */
export declare const CACHE_MECHANISM: InjectionToken<CacheMechanism>;
/**
 * Cache name
 */
export declare const CACHE_NAME: InjectionToken<string>;
/**
 * Cookie cache format
 */
export declare const COOKIE_FORMAT: InjectionToken<boolean>;
/**
 * Cookie cache format
 */
export declare const INITIAL_NAVIGATION: InjectionToken<boolean>;
/**
 * Type for default language function
 * Used to override basic behaviour
 */
export type DefaultLanguageFunction = (languages: string[], cachedLang?: string, browserLang?: string) => string;
/**
 * Function for calculating default language
 */
export declare const DEFAULT_LANG_FUNCTION: InjectionToken<DefaultLanguageFunction>;
/**
 * Boolean to indicate whether prefix should be set for single language scenarios
 */
export declare const ALWAYS_SET_PREFIX: InjectionToken<boolean>;
/**
 * Config interface for LocalizeRouter
 */
export interface LocalizeRouterConfig {
    parser?: Provider;
    useCachedLang?: boolean;
    cacheMechanism?: CacheMechanism;
    cacheName?: string;
    defaultLangFunction?: DefaultLanguageFunction;
    alwaysSetPrefix?: boolean;
    cookieFormat?: string;
    initialNavigation?: boolean;
}
export declare class LocalizeRouterSettings implements LocalizeRouterConfig {
    useCachedLang: boolean;
    alwaysSetPrefix: boolean;
    cacheName: string;
    cookieFormat: string;
    initialNavigation: boolean;
    cacheMechanism: CacheMechanism;
    defaultLangFunction: DefaultLanguageFunction;
    /**
     * Settings for localize router
     */
    constructor(useCachedLang?: boolean, alwaysSetPrefix?: boolean, cacheMechanism?: CacheMechanism, cacheName?: string, defaultLangFunction?: any, cookieFormat?: string, initialNavigation?: boolean);
    static ɵfac: i0.ɵɵFactoryDeclaration<LocalizeRouterSettings, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<LocalizeRouterSettings>;
}
