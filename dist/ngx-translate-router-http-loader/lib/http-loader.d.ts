import { LocalizeParser, LocalizeRouterSettings } from '@gilsdav/ngx-translate-router';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { Routes } from '@angular/router';
import { Location } from '@angular/common';
/**
 * Config interface
 */
export interface ILocalizeRouterParserConfig {
    locales: Array<string>;
    prefix?: string;
    escapePrefix?: string;
}
export declare class LocalizeRouterHttpLoader extends LocalizeParser {
    private http;
    private path;
    /**
     * CTOR
     * @param translate
     * @param location
     * @param settings
     * @param http
     * @param path
     */
    constructor(translate: TranslateService, location: Location, settings: LocalizeRouterSettings, http: HttpClient, path?: string);
    /**
     * Initialize or append routes
     * @param routes
     */
    load(routes: Routes): Promise<any>;
}
