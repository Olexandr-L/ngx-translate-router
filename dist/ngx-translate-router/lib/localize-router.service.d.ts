import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { Subject, Observable } from 'rxjs';
import { LocalizeParser } from './localize-router.parser';
import { LocalizeRouterSettings } from './localize-router.config';
import * as i0 from "@angular/core";
/**
 * Localization service
 * modifyRoutes
 */
export declare class LocalizeRouterService {
    parser: LocalizeParser;
    settings: LocalizeRouterSettings;
    private router;
    private route;
    routerEvents: Subject<string>;
    hooks: {
        initialized: Observable<boolean>;
    };
    private latestUrl;
    private lastExtras?;
    /**
     * CTOR
     */
    constructor(parser: LocalizeParser, settings: LocalizeRouterSettings, router: Router, route: ActivatedRoute);
    /**
     * Start up the service
     */
    init(): void;
    /**
     * Change language and navigate to translated route
     */
    changeLanguage(lang: string, extras?: NavigationExtras, useNavigateMethod?: boolean): void;
    /**
     * Traverses through the tree to assemble new translated url
     */
    private traverseRouteSnapshot;
    /**
     * Build URL from segments and snapshot (for params)
     */
    private buildUrlFromSegments;
    /**
     * Extracts new segment value based on routeConfig and url
     */
    private parseSegmentValue;
    private parseSegmentValueMatcher;
    /**
     * Translate route to current language
     * If new language is explicitly provided then replace language part in url with new language
     */
    translateRoute(path: string | any[]): string | any[];
    /**
     * Event handler to react on route change
     */
    private _routeChanged;
    /**
     * Drop the current Navigation
     */
    private cancelCurrentNavigation;
    /**
     * Apply config to Angular RouterModule
     * @param config routes to apply
     */
    private applyConfigToRouter;
    static ɵfac: i0.ɵɵFactoryDeclaration<LocalizeRouterService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<LocalizeRouterService>;
}
