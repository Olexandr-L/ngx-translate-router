import { NgModule, APP_INITIALIZER, Optional, SkipSelf, Injectable, Injector } from '@angular/core';
import { LocalizeRouterService } from './localize-router.service';
import { DummyLocalizeParser, LocalizeParser } from './localize-router.parser';
import { RouterModule, RouteReuseStrategy, Router } from '@angular/router';
import { LocalizeRouterPipe } from './localize-router.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { ALWAYS_SET_PREFIX, CACHE_MECHANISM, CACHE_NAME, DEFAULT_LANG_FUNCTION, LOCALIZE_ROUTER_FORROOT_GUARD, LocalizeRouterSettings, RAW_ROUTES, USE_CACHED_LANG, COOKIE_FORMAT, INITIAL_NAVIGATION } from './localize-router.config';
import { GilsdavReuseStrategy } from './gilsdav-reuse-strategy';
import { deepCopy } from './util';
import { LocalizedRouter } from './localized-router';
import * as i0 from "@angular/core";
export class ParserInitializer {
    /**
     * CTOR
     */
    constructor(injector) {
        this.injector = injector;
    }
    appInitializer() {
        const res = this.parser.load(this.routes);
        return res.then(() => {
            const localize = this.injector.get(LocalizeRouterService);
            const router = this.injector.get(Router);
            const settings = this.injector.get(LocalizeRouterSettings);
            localize.init();
            if (settings.initialNavigation) {
                return new Promise(resolve => {
                    // @ts-ignore
                    const oldAfterPreactivation = router.navigationTransitions.afterPreactivation;
                    let firstInit = true;
                    // @ts-ignore
                    router.navigationTransitions.afterPreactivation = () => {
                        if (firstInit) {
                            resolve();
                            firstInit = false;
                            localize.hooks._initializedSubject.next(true);
                            localize.hooks._initializedSubject.complete();
                        }
                        return oldAfterPreactivation();
                    };
                });
            }
            else {
                localize.hooks._initializedSubject.next(true);
                localize.hooks._initializedSubject.complete();
            }
        });
    }
    generateInitializer(parser, routes) {
        this.parser = parser;
        this.routes = routes.reduce((a, b) => a.concat(b));
        return this.appInitializer;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.10", ngImport: i0, type: ParserInitializer, deps: [{ token: i0.Injector }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.2.10", ngImport: i0, type: ParserInitializer }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.10", ngImport: i0, type: ParserInitializer, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i0.Injector }]; } });
export function getAppInitializer(p, parser, routes) {
    // DeepCopy needed to prevent RAW_ROUTES mutation
    const routesCopy = deepCopy(routes);
    return p.generateInitializer(parser, routesCopy).bind(p);
}
export class LocalizeRouterModule {
    static forRoot(routes, config = {}) {
        return {
            ngModule: LocalizeRouterModule,
            providers: [
                {
                    provide: Router,
                    useClass: LocalizedRouter
                },
                {
                    provide: LOCALIZE_ROUTER_FORROOT_GUARD,
                    useFactory: provideForRootGuard,
                    deps: [[LocalizeRouterModule, new Optional(), new SkipSelf()]]
                },
                { provide: USE_CACHED_LANG, useValue: config.useCachedLang },
                { provide: ALWAYS_SET_PREFIX, useValue: config.alwaysSetPrefix },
                { provide: CACHE_NAME, useValue: config.cacheName },
                { provide: CACHE_MECHANISM, useValue: config.cacheMechanism },
                { provide: DEFAULT_LANG_FUNCTION, useValue: config.defaultLangFunction },
                { provide: COOKIE_FORMAT, useValue: config.cookieFormat },
                { provide: INITIAL_NAVIGATION, useValue: config.initialNavigation },
                LocalizeRouterSettings,
                config.parser || { provide: LocalizeParser, useClass: DummyLocalizeParser },
                {
                    provide: RAW_ROUTES,
                    multi: true,
                    useValue: routes
                },
                LocalizeRouterService,
                ParserInitializer,
                {
                    provide: APP_INITIALIZER,
                    multi: true,
                    useFactory: getAppInitializer,
                    deps: [ParserInitializer, LocalizeParser, RAW_ROUTES]
                },
                {
                    provide: RouteReuseStrategy,
                    useClass: GilsdavReuseStrategy
                }
            ]
        };
    }
    static forChild(routes) {
        return {
            ngModule: LocalizeRouterModule,
            providers: [
                {
                    provide: RAW_ROUTES,
                    multi: true,
                    useValue: routes
                }
            ]
        };
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.10", ngImport: i0, type: LocalizeRouterModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.2.10", ngImport: i0, type: LocalizeRouterModule, declarations: [LocalizeRouterPipe], imports: [CommonModule, RouterModule, TranslateModule], exports: [LocalizeRouterPipe] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.2.10", ngImport: i0, type: LocalizeRouterModule, imports: [CommonModule, RouterModule, TranslateModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.10", ngImport: i0, type: LocalizeRouterModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, RouterModule, TranslateModule],
                    declarations: [LocalizeRouterPipe],
                    exports: [LocalizeRouterPipe]
                }]
        }] });
export function provideForRootGuard(localizeRouterModule) {
    if (localizeRouterModule) {
        throw new Error(`LocalizeRouterModule.forRoot() called twice. Lazy loaded modules should use LocalizeRouterModule.forChild() instead.`);
    }
    return 'guarded';
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYWxpemUtcm91dGVyLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL25neC10cmFuc2xhdGUtcm91dGVyL3NyYy9saWIvbG9jYWxpemUtcm91dGVyLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0wsUUFBUSxFQUF1QixlQUFlLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFDbEUsVUFBVSxFQUFFLFFBQVEsRUFDckIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDbEUsT0FBTyxFQUFFLG1CQUFtQixFQUFFLGNBQWMsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBQy9FLE9BQU8sRUFDTCxZQUFZLEVBQVUsa0JBQWtCLEVBQUUsTUFBTSxFQUNqRCxNQUFNLGlCQUFpQixDQUFDO0FBQ3pCLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQzVELE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUN0RCxPQUFPLEVBQUUsWUFBWSxFQUFZLE1BQU0saUJBQWlCLENBQUM7QUFDekQsT0FBTyxFQUNMLGlCQUFpQixFQUNqQixlQUFlLEVBQUUsVUFBVSxFQUFFLHFCQUFxQixFQUFFLDZCQUE2QixFQUMzRCxzQkFBc0IsRUFDNUMsVUFBVSxFQUNWLGVBQWUsRUFDZixhQUFhLEVBQ2Isa0JBQWtCLEVBQ25CLE1BQU0sMEJBQTBCLENBQUM7QUFDbEMsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDaEUsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLFFBQVEsQ0FBQztBQUNsQyxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7O0FBR3JELE1BQU0sT0FBTyxpQkFBaUI7SUFJNUI7O09BRUc7SUFDSCxZQUFvQixRQUFrQjtRQUFs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QUNGO1NBQ0YsQ0FBQztJQUNKLENBQUM7SUFFRCxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQWM7UUFDNUIsT0FBTztZQUNMLFFBQVEsRUFBRSxvQkFBb0I7WUFDOUIsU0FBUyxFQUFFO2dCQUNUO29CQUNFLE9BQU8sRUFBRSxVQUFVO29CQUNuQixLQUFLLEVBQUUsSUFBSTtvQkFDWCxRQUFRLEVBQUUsTUFBTTtpQkFDakI7YUFDRjtTQUNGLENBQUM7SUFDSixDQUFDOytHQXhEVSxvQkFBb0I7Z0hBQXBCLG9CQUFvQixpQkFIaEIsa0JBQWtCLGFBRHZCLFlBQVksRUFBRSxZQUFZLEVBQUUsZUFBZSxhQUUzQyxrQkFBa0I7Z0hBRWpCLG9CQUFvQixZQUpyQixZQUFZLEVBQUUsWUFBWSxFQUFFLGVBQWU7OzRGQUkxQyxvQkFBb0I7a0JBTGhDLFFBQVE7bUJBQUM7b0JBQ1IsT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFFLFlBQVksRUFBRSxlQUFlLENBQUM7b0JBQ3RELFlBQVksRUFBRSxDQUFDLGtCQUFrQixDQUFDO29CQUNsQyxPQUFPLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQztpQkFDOUI7O0FBNERELE1BQU0sVUFBVSxtQkFBbUIsQ0FBQyxvQkFBMEM7SUFDNUUsSUFBSSxvQkFBb0IsRUFBRTtRQUN4QixNQUFNLElBQUksS0FBSyxDQUNiLHNIQUFzSCxDQUFDLENBQUM7S0FDM0g7SUFDRCxPQUFPLFNBQVMsQ0FBQztBQUNuQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcclxuICBOZ01vZHVsZSwgTW9kdWxlV2l0aFByb3ZpZGVycywgQVBQX0lOSVRJQUxJWkVSLCBPcHRpb25hbCwgU2tpcFNlbGYsXHJcbiAgSW5qZWN0YWJsZSwgSW5qZWN0b3JcclxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgTG9jYWxpemVSb3V0ZXJTZXJ2aWNlIH0gZnJvbSAnLi9sb2NhbGl6ZS1yb3V0ZXIuc2VydmljZSc7XHJcbmltcG9ydCB7IER1bW15TG9jYWxpemVQYXJzZXIsIExvY2FsaXplUGFyc2VyIH0gZnJvbSAnLi9sb2NhbGl6ZS1yb3V0ZXIucGFyc2VyJztcclxuaW1wb3J0IHtcclxuICBSb3V0ZXJNb2R1bGUsIFJvdXRlcywgUm91dGVSZXVzZVN0cmF0ZWd5LCBSb3V0ZXJcclxufSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xyXG5pbXBvcnQgeyBMb2NhbGl6ZVJvdXRlclBpcGUgfSBmcm9tICcuL2xvY2FsaXplLXJvdXRlci5waXBlJztcclxuaW1wb3J0IHsgVHJhbnNsYXRlTW9kdWxlIH0gZnJvbSAnQG5neC10cmFuc2xhdGUvY29yZSc7XHJcbmltcG9ydCB7IENvbW1vbk1vZHVsZSwgTG9jYXRpb24gfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xyXG5pbXBvcnQge1xyXG4gIEFMV0FZU19TRVRfUFJFRklYLFxyXG4gIENBQ0hFX01FQ0hBTklTTSwgQ0FDSEVfTkFNRSwgREVGQVVMVF9MQU5HX0ZVTkNUSU9OLCBMT0NBTElaRV9ST1VURVJfRk9SUk9PVF9HVUFSRCxcclxuICBMb2NhbGl6ZVJvdXRlckNvbmZpZywgTG9jYWxpemVSb3V0ZXJTZXR0aW5ncyxcclxuICBSQVdfUk9VVEVTLFxyXG4gIFVTRV9DQUNIRURfTEFORyxcclxuICBDT09LSUVfRk9STUFULFxyXG4gIElOSVRJQUxfTkFWSUdBVElPTlxyXG59IGZyb20gJy4vbG9jYWxpemUtcm91dGVyLmNvbmZpZyc7XHJcbmltcG9ydCB7IEdpbHNkYXZSZXVzZVN0cmF0ZWd5IH0gZnJvbSAnLi9naWxzZGF2LXJldXNlLXN0cmF0ZWd5JztcclxuaW1wb3J0IHsgZGVlcENvcHkgfSBmcm9tICcuL3V0aWwnO1xyXG5pbXBvcnQgeyBMb2NhbGl6ZWRSb3V0ZXIgfSBmcm9tICcuL2xvY2FsaXplZC1yb3V0ZXInO1xyXG5cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgUGFyc2VySW5pdGlhbGl6ZXIge1xyXG4gIHBhcnNlcjogTG9jYWxpemVQYXJzZXI7XHJcbiAgcm91dGVzOiBSb3V0ZXM7XHJcblxyXG4gIC8qKlxyXG4gICAqIENUT1JcclxuICAgKi9cclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGluamVjdG9yOiBJbmplY3Rvcikge1xyXG4gIH1cclxuXHJcbiAgYXBwSW5pdGlhbGl6ZXIoKTogUHJvbWlzZTxhbnk+IHtcclxuICAgIGNvbnN0IHJlcyA9IHRoaXMucGFyc2VyLmxvYWQodGhpcy5yb3V0ZXMpO1xyXG5cclxuICAgIHJldHVybiByZXMudGhlbigoKSA9PiB7XHJcbiAgICAgIGNvbnN0IGxvY2FsaXplID0gdGhpcy5pbmplY3Rvci5nZXQoTG9jYWxpemVSb3V0ZXJTZXJ2aWNlKTtcclxuICAgICAgY29uc3Qgcm91dGVyID0gdGhpcy5pbmplY3Rvci5nZXQoUm91dGVyKTtcclxuICAgICAgY29uc3Qgc2V0dGluZ3MgPSB0aGlzLmluamVjdG9yLmdldChMb2NhbGl6ZVJvdXRlclNldHRpbmdzKTtcclxuICAgICAgbG9jYWxpemUuaW5pdCgpO1xyXG5cclxuICAgICAgaWYgKHNldHRpbmdzLmluaXRpYWxOYXZpZ2F0aW9uKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPHZvaWQ+KHJlc29sdmUgPT4ge1xyXG4gICAgICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICAgICAgY29uc3Qgb2xkQWZ0ZXJQcmVhY3RpdmF0aW9uID0gcm91dGVyLm5hdmlnYXRpb25UcmFuc2l0aW9ucy5hZnRlclByZWFjdGl2YXRpb247XHJcbiAgICAgICAgICBsZXQgZmlyc3RJbml0ID0gdHJ1ZTtcclxuICAgICAgICAgIC8vIEB0cy1pZ25vcmVcclxuICAgICAgICAgIHJvdXRlci5uYXZpZ2F0aW9uVHJhbnNpdGlvbnMuYWZ0ZXJQcmVhY3RpdmF0aW9uID0gKCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZmlyc3RJbml0KSB7XHJcbiAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICAgIGZpcnN0SW5pdCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgIGxvY2FsaXplLmhvb2tzLl9pbml0aWFsaXplZFN1YmplY3QubmV4dCh0cnVlKTtcclxuICAgICAgICAgICAgICBsb2NhbGl6ZS5ob29rcy5faW5pdGlhbGl6ZWRTdWJqZWN0LmNvbXBsZXRlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG9sZEFmdGVyUHJlYWN0aXZhdGlvbigpO1xyXG4gICAgICAgICAgfTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBsb2NhbGl6ZS5ob29rcy5faW5pdGlhbGl6ZWRTdWJqZWN0Lm5leHQodHJ1ZSk7XHJcbiAgICAgICAgbG9jYWxpemUuaG9va3MuX2luaXRpYWxpemVkU3ViamVjdC5jb21wbGV0ZSgpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGdlbmVyYXRlSW5pdGlhbGl6ZXIocGFyc2VyOiBMb2NhbGl6ZVBhcnNlciwgcm91dGVzOiBSb3V0ZXNbXSk6ICgpID0+IFByb21pc2U8YW55PiB7XHJcbiAgICB0aGlzLnBhcnNlciA9IHBhcnNlcjtcclxuICAgIHRoaXMucm91dGVzID0gcm91dGVzLnJlZHVjZSgoYSwgYikgPT4gYS5jb25jYXQoYikpO1xyXG4gICAgcmV0dXJuIHRoaXMuYXBwSW5pdGlhbGl6ZXI7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0QXBwSW5pdGlhbGl6ZXIocDogUGFyc2VySW5pdGlhbGl6ZXIsIHBhcnNlcjogTG9jYWxpemVQYXJzZXIsIHJvdXRlczogUm91dGVzW10pOiBhbnkge1xyXG4gIC8vIERlZXBDb3B5IG5lZWRlZCB0byBwcmV2ZW50IFJBV19ST1VURVMgbXV0YXRpb25cclxuICBjb25zdCByb3V0ZXNDb3B5ID0gZGVlcENvcHkocm91dGVzKTtcclxuICByZXR1cm4gcC5nZW5lcmF0ZUluaXRpYWxpemVyKHBhcnNlciwgcm91dGVzQ29weSkuYmluZChwKTtcclxufVxyXG5cclxuQE5nTW9kdWxlKHtcclxuICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlLCBSb3V0ZXJNb2R1bGUsIFRyYW5zbGF0ZU1vZHVsZV0sXHJcbiAgZGVjbGFyYXRpb25zOiBbTG9jYWxpemVSb3V0ZXJQaXBlXSxcclxuICBleHBvcnRzOiBbTG9jYWxpemVSb3V0ZXJQaXBlXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgTG9jYWxpemVSb3V0ZXJNb2R1bGUge1xyXG5cclxuICBzdGF0aWMgZm9yUm9vdChyb3V0ZXM6IFJvdXRlcywgY29uZmlnOiBMb2NhbGl6ZVJvdXRlckNvbmZpZyA9IHt9KTogTW9kdWxlV2l0aFByb3ZpZGVyczxMb2NhbGl6ZVJvdXRlck1vZHVsZT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgbmdNb2R1bGU6IExvY2FsaXplUm91dGVyTW9kdWxlLFxyXG4gICAgICBwcm92aWRlcnM6IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICBwcm92aWRlOiBSb3V0ZXIsXHJcbiAgICAgICAgICB1c2VDbGFzczogTG9jYWxpemVkUm91dGVyXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBwcm92aWRlOiBMT0NBTElaRV9ST1VURVJfRk9SUk9PVF9HVUFSRCxcclxuICAgICAgICAgIHVzZUZhY3Rvcnk6IHByb3ZpZGVGb3JSb290R3VhcmQsXHJcbiAgICAgICAgICBkZXBzOiBbW0xvY2FsaXplUm91dGVyTW9kdWxlLCBuZXcgT3B0aW9uYWwoKSwgbmV3IFNraXBTZWxmKCldXVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgeyBwcm92aWRlOiBVU0VfQ0FDSEVEX0xBTkcsIHVzZVZhbHVlOiBjb25maWcudXNlQ2FjaGVkTGFuZyB9LFxyXG4gICAgICAgIHsgcHJvdmlkZTogQUxXQVlTX1NFVF9QUkVGSVgsIHVzZVZhbHVlOiBjb25maWcuYWx3YXlzU2V0UHJlZml4IH0sXHJcbiAgICAgICAgeyBwcm92aWRlOiBDQUNIRV9OQU1FLCB1c2VWYWx1ZTogY29uZmlnLmNhY2hlTmFtZSB9LFxyXG4gICAgICAgIHsgcHJvdmlkZTogQ0FDSEVfTUVDSEFOSVNNLCB1c2VWYWx1ZTogY29uZmlnLmNhY2hlTWVjaGFuaXNtIH0sXHJcbiAgICAgICAgeyBwcm92aWRlOiBERUZBVUxUX0xBTkdfRlVOQ1RJT04sIHVzZVZhbHVlOiBjb25maWcuZGVmYXVsdExhbmdGdW5jdGlvbiB9LFxyXG4gICAgICAgIHsgcHJvdmlkZTogQ09PS0lFX0ZPUk1BVCwgdXNlVmFsdWU6IGNvbmZpZy5jb29raWVGb3JtYXQgfSxcclxuICAgICAgICB7IHByb3ZpZGU6IElOSVRJQUxfTkFWSUdBVElPTiwgdXNlVmFsdWU6IGNvbmZpZy5pbml0aWFsTmF2aWdhdGlvbiB9LFxyXG4gICAgICAgIExvY2FsaXplUm91dGVyU2V0dGluZ3MsXHJcbiAgICAgICAgY29uZmlnLnBhcnNlciB8fCB7IHByb3ZpZGU6IExvY2FsaXplUGFyc2VyLCB1c2VDbGFzczogRHVtbXlMb2NhbGl6ZVBhcnNlciB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIHByb3ZpZGU6IFJBV19ST1VURVMsXHJcbiAgICAgICAgICBtdWx0aTogdHJ1ZSxcclxuICAgICAgICAgIHVzZVZhbHVlOiByb3V0ZXNcclxuICAgICAgICB9LFxyXG4gICAgICAgIExvY2FsaXplUm91dGVyU2VydmljZSxcclxuICAgICAgICBQYXJzZXJJbml0aWFsaXplcixcclxuICAgICAgICB7XHJcbiAgICAgICAgICBwcm92aWRlOiBBUFBfSU5JVElBTElaRVIsXHJcbiAgICAgICAgICBtdWx0aTogdHJ1ZSxcclxuICAgICAgICAgIHVzZUZhY3Rvcnk6IGdldEFwcEluaXRpYWxpemVyLFxyXG4gICAgICAgICAgZGVwczogW1BhcnNlckluaXRpYWxpemVyLCBMb2NhbGl6ZVBhcnNlciwgUkFXX1JPVVRFU11cclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIHByb3ZpZGU6IFJvdXRlUmV1c2VTdHJhdGVneSxcclxuICAgICAgICAgIHVzZUNsYXNzOiBHaWxzZGF2UmV1c2VTdHJhdGVneVxyXG4gICAgICAgIH1cclxuICAgICAgXVxyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIHN0YXRpYyBmb3JDaGlsZChyb3V0ZXM6IFJvdXRlcyk6IE1vZHVsZVdpdGhQcm92aWRlcnM8TG9jYWxpemVSb3V0ZXJNb2R1bGU+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIG5nTW9kdWxlOiBMb2NhbGl6ZVJvdXRlck1vZHVsZSxcclxuICAgICAgcHJvdmlkZXJzOiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgcHJvdmlkZTogUkFXX1JPVVRFUyxcclxuICAgICAgICAgIG11bHRpOiB0cnVlLFxyXG4gICAgICAgICAgdXNlVmFsdWU6IHJvdXRlc1xyXG4gICAgICAgIH1cclxuICAgICAgXVxyXG4gICAgfTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBwcm92aWRlRm9yUm9vdEd1YXJkKGxvY2FsaXplUm91dGVyTW9kdWxlOiBMb2NhbGl6ZVJvdXRlck1vZHVsZSk6IHN0cmluZyB7XHJcbiAgaWYgKGxvY2FsaXplUm91dGVyTW9kdWxlKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoXHJcbiAgICAgIGBMb2NhbGl6ZVJvdXRlck1vZHVsZS5mb3JSb290KCkgY2FsbGVkIHR3aWNlLiBMYXp5IGxvYWRlZCBtb2R1bGVzIHNob3VsZCB1c2UgTG9jYWxpemVSb3V0ZXJNb2R1bGUuZm9yQ2hpbGQoKSBpbnN0ZWFkLmApO1xyXG4gIH1cclxuICByZXR1cm4gJ2d1YXJkZWQnO1xyXG59XHJcbiJdfQ==