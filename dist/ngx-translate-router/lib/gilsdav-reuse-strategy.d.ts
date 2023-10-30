import { RouteReuseStrategy, DetachedRouteHandle, ActivatedRouteSnapshot } from '@angular/router';
export declare class GilsdavReuseStrategy implements RouteReuseStrategy {
    constructor();
    shouldDetach(route: ActivatedRouteSnapshot): boolean;
    store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void;
    shouldAttach(route: ActivatedRouteSnapshot): boolean;
    retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle;
    shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean;
    private getKey;
}
