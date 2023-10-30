import { ModuleWithProviders, Injector } from '@angular/core';
import { LocalizeParser } from './localize-router.parser';
import { Routes } from '@angular/router';
import { LocalizeRouterConfig } from './localize-router.config';
import * as i0 from "@angular/core";
import * as i1 from "./localize-router.pipe";
import * as i2 from "@angular/common";
import * as i3 from "@angular/router";
import * as i4 from "@ngx-translate/core";
export declare class ParserInitializer {
    private injector;
    parser: LocalizeParser;
    routes: Routes;
    /**
     * CTOR
     */
    constructor(injector: Injector);
    appInitializer(): Promise<any>;
    generateInitializer(parser: LocalizeParser, routes: Routes[]): () => Promise<any>;
    static ɵfac: i0.ɵɵFactoryDeclaration<ParserInitializer, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ParserInitializer>;
}
export declare function getAppInitializer(p: ParserInitializer, parser: LocalizeParser, routes: Routes[]): any;
export declare class LocalizeRouterModule {
    static forRoot(routes: Routes, config?: LocalizeRouterConfig): ModuleWithProviders<LocalizeRouterModule>;
    static forChild(routes: Routes): ModuleWithProviders<LocalizeRouterModule>;
    static ɵfac: i0.ɵɵFactoryDeclaration<LocalizeRouterModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<LocalizeRouterModule, [typeof i1.LocalizeRouterPipe], [typeof i2.CommonModule, typeof i3.RouterModule, typeof i4.TranslateModule], [typeof i1.LocalizeRouterPipe]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<LocalizeRouterModule>;
}
export declare function provideForRootGuard(localizeRouterModule: LocalizeRouterModule): string;
