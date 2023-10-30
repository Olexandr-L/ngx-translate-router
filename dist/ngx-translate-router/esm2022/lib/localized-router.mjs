import { Router, ROUTES } from '@angular/router';
import { Compiler, NgModuleFactory, PLATFORM_ID, inject, Injectable } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { from, of, isObservable } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';
import { isPromise } from './util';
import { LocalizeParser } from './localize-router.parser';
import * as i0 from "@angular/core";
export class LocalizedRouter extends Router {
    constructor() {
        super();
        this.platformId = inject(PLATFORM_ID);
        this.compiler = inject(Compiler);
        this.localize = inject(LocalizeParser);
        // Custom configuration
        const isBrowser = isPlatformBrowser(this.platformId);
        // __proto__ is needed for preloaded modules be doesn't work with SSR
        // @ts-ignore
        const configLoader = isBrowser
            ? this.navigationTransitions.configLoader.__proto__
            : this.navigationTransitions.configLoader;
        configLoader.loadModuleFactoryOrRoutes = (loadChildren) => {
            return wrapIntoObservable(loadChildren()).pipe(mergeMap((t) => {
                let compiled;
                if (t instanceof NgModuleFactory || Array.isArray(t)) {
                    compiled = of(t);
                }
                else {
                    compiled = from(this.compiler.compileModuleAsync(t));
                }
                return compiled.pipe(map(factory => {
                    if (Array.isArray(factory)) {
                        return this.localize.initChildRoutes([...factory]);
                    }
                    return {
                        moduleType: factory.moduleType,
                        create: (parentInjector) => {
                            const module = factory.create(parentInjector);
                            const getMethod = module.injector.get.bind(module.injector);
                            module.injector['get'] = (token, notFoundValue, flags) => {
                                const getResult = getMethod(token, notFoundValue, flags);
                                if (token === ROUTES) {
                                    // translate lazy routes
                                    return this.localize.initChildRoutes([].concat(...getResult));
                                }
                                else {
                                    return getResult;
                                }
                            };
                            return module;
                        }
                    };
                }));
            }));
        };
        // (this as any).navigations = (this as any).setupNavigations((this as any).transitions);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.10", ngImport: i0, type: LocalizedRouter, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.2.10", ngImport: i0, type: LocalizedRouter, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.10", ngImport: i0, type: LocalizedRouter, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return []; } });
export function wrapIntoObservable(value) {
    if (isObservable(value)) {
        return value;
    }
    if (isPromise(value)) {
        // Use `Promise.resolve()` to wrap promise-like instances.
        // Required ie when a Resolver returns a AngularJS `$q` promise to correctly trigger the
        // change detection.
        return from(Promise.resolve(value));
    }
    return of(value);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYWxpemVkLXJvdXRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL25neC10cmFuc2xhdGUtcm91dGVyL3NyYy9saWIvbG9jYWxpemVkLXJvdXRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsTUFBTSxFQUFnQixNQUFNLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvRCxPQUFPLEVBQVksUUFBUSxFQUFFLGVBQWUsRUFBRSxXQUFXLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNyRyxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUNwRCxPQUFPLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxZQUFZLEVBQWMsTUFBTSxNQUFNLENBQUM7QUFDMUQsT0FBTyxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUMvQyxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sUUFBUSxDQUFDO0FBQ25DLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQzs7QUFHMUQsTUFBTSxPQUFPLGVBQWdCLFNBQVEsTUFBTTtJQU16QztRQUNFLEtBQUssRUFBRSxDQUFDO1FBTEYsZUFBVSxHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUNqQyxhQUFRLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzVCLGFBQVEsR0FBRyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUM7UUFJeEMsdUJBQXVCO1FBQ3ZCLE1BQU0sU0FBUyxHQUFHLGlCQUFpQixDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNyRCxxRUFBcUU7UUFDckUsYUFBYTtRQUNiLE1BQU0sWUFBWSxHQUFHLFNBQVM7WUFDNUIsQ0FBQyxDQUFFLElBQVksQ0FBQyxxQkFBcUIsQ0FBQyxZQUFZLENBQUMsU0FBUztZQUM1RCxDQUFDLENBQUUsSUFBWSxDQUFDLHFCQUFxQixDQUFDLFlBQVksQ0FBQztRQUVyRCxZQUFZLENBQUMseUJBQXlCLEdBQUcsQ0FBQyxZQUEwQixFQUFFLEVBQUU7WUFDdEUsT0FBTyxrQkFBa0IsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFNLEVBQUUsRUFBRTtnQkFDakUsSUFBSSxRQUF1RCxDQUFDO2dCQUM1RCxJQUFJLENBQUMsWUFBWSxlQUFlLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRTtvQkFDcEQsUUFBUSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDbEI7cUJBQU07b0JBQ0wsUUFBUSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxDQUFxQyxDQUFDO2lCQUMxRjtnQkFDRCxPQUFPLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFO29CQUNqQyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUU7d0JBQzFCLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUM7cUJBQ3BEO29CQUNELE9BQU87d0JBQ0wsVUFBVSxFQUFFLE9BQU8sQ0FBQyxVQUFVO3dCQUM5QixNQUFNLEVBQUUsQ0FBQyxjQUF3QixFQUFFLEVBQUU7NEJBQ25DLE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUM7NEJBQzlDLE1BQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7NEJBRTVELE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxLQUFVLEVBQUUsYUFBa0IsRUFBRSxLQUFXLEVBQUUsRUFBRTtnQ0FDdkUsTUFBTSxTQUFTLEdBQUcsU0FBUyxDQUFDLEtBQUssRUFBRSxhQUFhLEVBQUUsS0FBSyxDQUFDLENBQUM7Z0NBRXpELElBQUksS0FBSyxLQUFLLE1BQU0sRUFBRTtvQ0FDcEIsd0JBQXdCO29DQUN4QixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDO2lDQUMvRDtxQ0FBTTtvQ0FDTCxPQUFPLFNBQVMsQ0FBQztpQ0FDbEI7NEJBQ0gsQ0FBQyxDQUFDOzRCQUNGLE9BQU8sTUFBTSxDQUFDO3dCQUNoQixDQUFDO3FCQUNGLENBQUM7Z0JBQ0osQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNOLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDTixDQUFDLENBQUM7UUFDRix5RkFBeUY7SUFDM0YsQ0FBQzsrR0FuRFUsZUFBZTttSEFBZixlQUFlLGNBREgsTUFBTTs7NEZBQ2xCLGVBQWU7a0JBRDNCLFVBQVU7bUJBQUMsRUFBQyxVQUFVLEVBQUUsTUFBTSxFQUFDOztBQXdEaEMsTUFBTSxVQUFVLGtCQUFrQixDQUFJLEtBQTBEO0lBQzlGLElBQUksWUFBWSxDQUFDLEtBQUssQ0FBQyxFQUFFO1FBQ3ZCLE9BQU8sS0FBSyxDQUFDO0tBQ2Q7SUFFRCxJQUFJLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBRTtRQUNwQiwwREFBMEQ7UUFDMUQsd0ZBQXdGO1FBQ3hGLG9CQUFvQjtRQUNwQixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7S0FDckM7SUFFRCxPQUFPLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNuQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUm91dGVyLCBMb2FkQ2hpbGRyZW4sIFJPVVRFUyB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XHJcbmltcG9ydCB7IEluamVjdG9yLCBDb21waWxlciwgTmdNb2R1bGVGYWN0b3J5LCBQTEFURk9STV9JRCwgaW5qZWN0LCBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IGlzUGxhdGZvcm1Ccm93c2VyIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcclxuaW1wb3J0IHsgZnJvbSwgb2YsIGlzT2JzZXJ2YWJsZSwgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBtZXJnZU1hcCwgbWFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xyXG5pbXBvcnQgeyBpc1Byb21pc2UgfSBmcm9tICcuL3V0aWwnO1xyXG5pbXBvcnQgeyBMb2NhbGl6ZVBhcnNlciB9IGZyb20gJy4vbG9jYWxpemUtcm91dGVyLnBhcnNlcic7XHJcblxyXG5ASW5qZWN0YWJsZSh7cHJvdmlkZWRJbjogJ3Jvb3QnfSlcclxuZXhwb3J0IGNsYXNzIExvY2FsaXplZFJvdXRlciBleHRlbmRzIFJvdXRlciB7XHJcblxyXG4gIHByaXZhdGUgcGxhdGZvcm1JZCA9IGluamVjdChQTEFURk9STV9JRCk7XHJcbiAgcHJpdmF0ZSBjb21waWxlciA9IGluamVjdChDb21waWxlcik7XHJcbiAgcHJpdmF0ZSBsb2NhbGl6ZSA9IGluamVjdChMb2NhbGl6ZVBhcnNlcik7XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgc3VwZXIoKTtcclxuICAgIC8vIEN1c3RvbSBjb25maWd1cmF0aW9uXHJcbiAgICBjb25zdCBpc0Jyb3dzZXIgPSBpc1BsYXRmb3JtQnJvd3Nlcih0aGlzLnBsYXRmb3JtSWQpO1xyXG4gICAgLy8gX19wcm90b19fIGlzIG5lZWRlZCBmb3IgcHJlbG9hZGVkIG1vZHVsZXMgYmUgZG9lc24ndCB3b3JrIHdpdGggU1NSXHJcbiAgICAvLyBAdHMtaWdub3JlXHJcbiAgICBjb25zdCBjb25maWdMb2FkZXIgPSBpc0Jyb3dzZXJcclxuICAgICAgPyAodGhpcyBhcyBhbnkpLm5hdmlnYXRpb25UcmFuc2l0aW9ucy5jb25maWdMb2FkZXIuX19wcm90b19fXHJcbiAgICAgIDogKHRoaXMgYXMgYW55KS5uYXZpZ2F0aW9uVHJhbnNpdGlvbnMuY29uZmlnTG9hZGVyO1xyXG5cclxuICAgIGNvbmZpZ0xvYWRlci5sb2FkTW9kdWxlRmFjdG9yeU9yUm91dGVzID0gKGxvYWRDaGlsZHJlbjogTG9hZENoaWxkcmVuKSA9PiB7XHJcbiAgICAgIHJldHVybiB3cmFwSW50b09ic2VydmFibGUobG9hZENoaWxkcmVuKCkpLnBpcGUobWVyZ2VNYXAoKHQ6IGFueSkgPT4ge1xyXG4gICAgICAgIGxldCBjb21waWxlZDogT2JzZXJ2YWJsZTxOZ01vZHVsZUZhY3Rvcnk8YW55PiB8IEFycmF5PGFueT4+O1xyXG4gICAgICAgIGlmICh0IGluc3RhbmNlb2YgTmdNb2R1bGVGYWN0b3J5IHx8IEFycmF5LmlzQXJyYXkodCkpIHtcclxuICAgICAgICAgIGNvbXBpbGVkID0gb2YodCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGNvbXBpbGVkID0gZnJvbSh0aGlzLmNvbXBpbGVyLmNvbXBpbGVNb2R1bGVBc3luYyh0KSkgYXMgT2JzZXJ2YWJsZTxOZ01vZHVsZUZhY3Rvcnk8YW55Pj47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBjb21waWxlZC5waXBlKG1hcChmYWN0b3J5ID0+IHtcclxuICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KGZhY3RvcnkpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmxvY2FsaXplLmluaXRDaGlsZFJvdXRlcyhbLi4uZmFjdG9yeV0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgbW9kdWxlVHlwZTogZmFjdG9yeS5tb2R1bGVUeXBlLFxyXG4gICAgICAgICAgICBjcmVhdGU6IChwYXJlbnRJbmplY3RvcjogSW5qZWN0b3IpID0+IHtcclxuICAgICAgICAgICAgICBjb25zdCBtb2R1bGUgPSBmYWN0b3J5LmNyZWF0ZShwYXJlbnRJbmplY3Rvcik7XHJcbiAgICAgICAgICAgICAgY29uc3QgZ2V0TWV0aG9kID0gbW9kdWxlLmluamVjdG9yLmdldC5iaW5kKG1vZHVsZS5pbmplY3Rvcik7XHJcblxyXG4gICAgICAgICAgICAgIG1vZHVsZS5pbmplY3RvclsnZ2V0J10gPSAodG9rZW46IGFueSwgbm90Rm91bmRWYWx1ZTogYW55LCBmbGFncz86IGFueSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZ2V0UmVzdWx0ID0gZ2V0TWV0aG9kKHRva2VuLCBub3RGb3VuZFZhbHVlLCBmbGFncyk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHRva2VuID09PSBST1VURVMpIHtcclxuICAgICAgICAgICAgICAgICAgLy8gdHJhbnNsYXRlIGxhenkgcm91dGVzXHJcbiAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmxvY2FsaXplLmluaXRDaGlsZFJvdXRlcyhbXS5jb25jYXQoLi4uZ2V0UmVzdWx0KSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICByZXR1cm4gZ2V0UmVzdWx0O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgcmV0dXJuIG1vZHVsZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfTtcclxuICAgICAgICB9KSk7XHJcbiAgICAgIH0pKTtcclxuICAgIH07XHJcbiAgICAvLyAodGhpcyBhcyBhbnkpLm5hdmlnYXRpb25zID0gKHRoaXMgYXMgYW55KS5zZXR1cE5hdmlnYXRpb25zKCh0aGlzIGFzIGFueSkudHJhbnNpdGlvbnMpO1xyXG4gIH1cclxufVxyXG5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB3cmFwSW50b09ic2VydmFibGU8VD4odmFsdWU6IFQgfCBOZ01vZHVsZUZhY3Rvcnk8VD4gfCBQcm9taXNlPFQ+IHwgT2JzZXJ2YWJsZTxUPikge1xyXG4gIGlmIChpc09ic2VydmFibGUodmFsdWUpKSB7XHJcbiAgICByZXR1cm4gdmFsdWU7XHJcbiAgfVxyXG5cclxuICBpZiAoaXNQcm9taXNlKHZhbHVlKSkge1xyXG4gICAgLy8gVXNlIGBQcm9taXNlLnJlc29sdmUoKWAgdG8gd3JhcCBwcm9taXNlLWxpa2UgaW5zdGFuY2VzLlxyXG4gICAgLy8gUmVxdWlyZWQgaWUgd2hlbiBhIFJlc29sdmVyIHJldHVybnMgYSBBbmd1bGFySlMgYCRxYCBwcm9taXNlIHRvIGNvcnJlY3RseSB0cmlnZ2VyIHRoZVxyXG4gICAgLy8gY2hhbmdlIGRldGVjdGlvbi5cclxuICAgIHJldHVybiBmcm9tKFByb21pc2UucmVzb2x2ZSh2YWx1ZSkpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIG9mKHZhbHVlKTtcclxufVxyXG4iXX0=