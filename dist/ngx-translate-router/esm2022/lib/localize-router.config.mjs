import { Inject, InjectionToken, Injectable } from '@angular/core';
import * as i0 from "@angular/core";
/**
 * Guard to make sure we have single initialization of forRoot
 */
export const LOCALIZE_ROUTER_FORROOT_GUARD = new InjectionToken('LOCALIZE_ROUTER_FORROOT_GUARD');
/**
 * Static provider for keeping track of routes
 */
export const RAW_ROUTES = new InjectionToken('RAW_ROUTES');
/**
 * Type for Caching of default language
 */
// export type CacheMechanism = 'LocalStorage' | 'Cookie';
/**
 * Namespace for fail proof access of CacheMechanism
 */
export var CacheMechanism;
(function (CacheMechanism) {
    CacheMechanism["LocalStorage"] = "LocalStorage";
    CacheMechanism["SessionStorage"] = "SessionStorage";
    CacheMechanism["Cookie"] = "Cookie";
})(CacheMechanism || (CacheMechanism = {}));
/**
 * Boolean to indicate whether to use cached language value
 */
export const USE_CACHED_LANG = new InjectionToken('USE_CACHED_LANG');
/**
 * Cache mechanism type
 */
export const CACHE_MECHANISM = new InjectionToken('CACHE_MECHANISM');
/**
 * Cache name
 */
export const CACHE_NAME = new InjectionToken('CACHE_NAME');
/**
 * Cookie cache format
 */
export const COOKIE_FORMAT = new InjectionToken('COOKIE_FORMAT');
/**
 * Cookie cache format
 */
export const INITIAL_NAVIGATION = new InjectionToken('INITIAL_NAVIGATION');
/**
 * Function for calculating default language
 */
export const DEFAULT_LANG_FUNCTION = new InjectionToken('DEFAULT_LANG_FUNCTION');
/**
 * Boolean to indicate whether prefix should be set for single language scenarios
 */
export const ALWAYS_SET_PREFIX = new InjectionToken('ALWAYS_SET_PREFIX');
const LOCALIZE_CACHE_NAME = 'LOCALIZE_DEFAULT_LANGUAGE';
const DEFAULT_COOKIE_FORMAT = '{{value}};{{expires}}';
const DEFAULT_INITIAL_NAVIGATION = false;
export class LocalizeRouterSettings {
    /**
     * Settings for localize router
     */
    constructor(useCachedLang = true, alwaysSetPrefix = true, cacheMechanism = CacheMechanism.LocalStorage, cacheName = LOCALIZE_CACHE_NAME, defaultLangFunction = void 0, cookieFormat = DEFAULT_COOKIE_FORMAT, initialNavigation = DEFAULT_INITIAL_NAVIGATION) {
        this.useCachedLang = useCachedLang;
        this.alwaysSetPrefix = alwaysSetPrefix;
        this.cacheName = cacheName;
        this.cookieFormat = cookieFormat;
        this.initialNavigation = initialNavigation;
        this.cacheMechanism = cacheMechanism;
        this.defaultLangFunction = defaultLangFunction;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.10", ngImport: i0, type: LocalizeRouterSettings, deps: [{ token: USE_CACHED_LANG }, { token: ALWAYS_SET_PREFIX }, { token: CACHE_MECHANISM }, { token: CACHE_NAME }, { token: DEFAULT_LANG_FUNCTION }, { token: COOKIE_FORMAT }, { token: INITIAL_NAVIGATION }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.2.10", ngImport: i0, type: LocalizeRouterSettings }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.10", ngImport: i0, type: LocalizeRouterSettings, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [USE_CACHED_LANG]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [ALWAYS_SET_PREFIX]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [CACHE_MECHANISM]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [CACHE_NAME]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DEFAULT_LANG_FUNCTION]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [COOKIE_FORMAT]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [INITIAL_NAVIGATION]
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYWxpemUtcm91dGVyLmNvbmZpZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL25neC10cmFuc2xhdGUtcm91dGVyL3NyYy9saWIvbG9jYWxpemUtcm91dGVyLmNvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsTUFBTSxFQUFFLGNBQWMsRUFBWSxVQUFVLEVBQVksTUFBTSxlQUFlLENBQUM7O0FBSXZGOztHQUVHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sNkJBQTZCLEdBQUcsSUFBSSxjQUFjLENBQXVCLCtCQUErQixDQUFDLENBQUM7QUFFdkg7O0dBRUc7QUFDSCxNQUFNLENBQUMsTUFBTSxVQUFVLEdBQTZCLElBQUksY0FBYyxDQUFXLFlBQVksQ0FBQyxDQUFDO0FBRS9GOztHQUVHO0FBQ0gsMERBQTBEO0FBRTFEOztHQUVHO0FBQ0gsTUFBTSxDQUFOLElBQVksY0FJWDtBQUpELFdBQVksY0FBYztJQUN4QiwrQ0FBNkIsQ0FBQTtJQUM3QixtREFBaUMsQ0FBQTtJQUNqQyxtQ0FBaUIsQ0FBQTtBQUNuQixDQUFDLEVBSlcsY0FBYyxLQUFkLGNBQWMsUUFJekI7QUFFRDs7R0FFRztBQUNILE1BQU0sQ0FBQyxNQUFNLGVBQWUsR0FBRyxJQUFJLGNBQWMsQ0FBVSxpQkFBaUIsQ0FBQyxDQUFDO0FBQzlFOztHQUVHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sZUFBZSxHQUFHLElBQUksY0FBYyxDQUFpQixpQkFBaUIsQ0FBQyxDQUFDO0FBQ3JGOztHQUVHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sVUFBVSxHQUFHLElBQUksY0FBYyxDQUFTLFlBQVksQ0FBQyxDQUFDO0FBQ25FOztHQUVHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sYUFBYSxHQUFHLElBQUksY0FBYyxDQUFVLGVBQWUsQ0FBQyxDQUFDO0FBQzFFOztHQUVHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sa0JBQWtCLEdBQUcsSUFBSSxjQUFjLENBQVUsb0JBQW9CLENBQUMsQ0FBQztBQVFwRjs7R0FFRztBQUNILE1BQU0sQ0FBQyxNQUFNLHFCQUFxQixHQUFHLElBQUksY0FBYyxDQUEwQix1QkFBdUIsQ0FBQyxDQUFDO0FBRTFHOztHQUVHO0FBQ0gsTUFBTSxDQUFDLE1BQU0saUJBQWlCLEdBQUcsSUFBSSxjQUFjLENBQVUsbUJBQW1CLENBQUMsQ0FBQztBQWdCbEYsTUFBTSxtQkFBbUIsR0FBRywyQkFBMkIsQ0FBQztBQUN4RCxNQUFNLHFCQUFxQixHQUFHLHVCQUF1QixDQUFDO0FBQ3RELE1BQU0sMEJBQTBCLEdBQUcsS0FBSyxDQUFDO0FBR3pDLE1BQU0sT0FBTyxzQkFBc0I7SUFLakM7O09BRUc7SUFDSCxZQUNrQyxnQkFBeUIsSUFBSSxFQUMzQixrQkFBMkIsSUFBSSxFQUN4QyxjQUFjLEdBQUcsY0FBYyxDQUFDLFlBQVksRUFDMUMsWUFBb0IsbUJBQW1CLEVBQ25DLG1CQUFtQixHQUFHLEtBQUssQ0FBQyxFQUM3QixlQUF1QixxQkFBcUIsRUFDdkMsb0JBQTZCLDBCQUEwQjtRQU4xRCxrQkFBYSxHQUFiLGFBQWEsQ0FBZ0I7UUFDM0Isb0JBQWUsR0FBZixlQUFlLENBQWdCO1FBRXRDLGNBQVMsR0FBVCxTQUFTLENBQThCO1FBRXBDLGlCQUFZLEdBQVosWUFBWSxDQUFnQztRQUN2QyxzQkFBaUIsR0FBakIsaUJBQWlCLENBQXNDO1FBRTFGLElBQUksQ0FBQyxjQUFjLEdBQUcsY0FBYyxDQUFDO1FBQ3JDLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxtQkFBbUIsQ0FBQztJQUNqRCxDQUFDOytHQW5CVSxzQkFBc0Isa0JBU3ZCLGVBQWUsYUFDZixpQkFBaUIsYUFDakIsZUFBZSxhQUNmLFVBQVUsYUFDVixxQkFBcUIsYUFDckIsYUFBYSxhQUNiLGtCQUFrQjttSEFmakIsc0JBQXNCOzs0RkFBdEIsc0JBQXNCO2tCQURsQyxVQUFVOzswQkFVTixNQUFNOzJCQUFDLGVBQWU7OzBCQUN0QixNQUFNOzJCQUFDLGlCQUFpQjs7MEJBQ3hCLE1BQU07MkJBQUMsZUFBZTs7MEJBQ3RCLE1BQU07MkJBQUMsVUFBVTs7MEJBQ2pCLE1BQU07MkJBQUMscUJBQXFCOzswQkFDNUIsTUFBTTsyQkFBQyxhQUFhOzswQkFDcEIsTUFBTTsyQkFBQyxrQkFBa0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3QsIEluamVjdGlvblRva2VuLCBQcm92aWRlciwgSW5qZWN0YWJsZSwgT3B0aW9uYWwgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgUm91dGVzIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcclxuaW1wb3J0IHsgTG9jYWxpemVSb3V0ZXJNb2R1bGUgfSBmcm9tICcuL2xvY2FsaXplLXJvdXRlci5tb2R1bGUnO1xyXG5cclxuLyoqXHJcbiAqIEd1YXJkIHRvIG1ha2Ugc3VyZSB3ZSBoYXZlIHNpbmdsZSBpbml0aWFsaXphdGlvbiBvZiBmb3JSb290XHJcbiAqL1xyXG5leHBvcnQgY29uc3QgTE9DQUxJWkVfUk9VVEVSX0ZPUlJPT1RfR1VBUkQgPSBuZXcgSW5qZWN0aW9uVG9rZW48TG9jYWxpemVSb3V0ZXJNb2R1bGU+KCdMT0NBTElaRV9ST1VURVJfRk9SUk9PVF9HVUFSRCcpO1xyXG5cclxuLyoqXHJcbiAqIFN0YXRpYyBwcm92aWRlciBmb3Iga2VlcGluZyB0cmFjayBvZiByb3V0ZXNcclxuICovXHJcbmV4cG9ydCBjb25zdCBSQVdfUk9VVEVTOiBJbmplY3Rpb25Ub2tlbjxSb3V0ZXNbXT4gPSBuZXcgSW5qZWN0aW9uVG9rZW48Um91dGVzW10+KCdSQVdfUk9VVEVTJyk7XHJcblxyXG4vKipcclxuICogVHlwZSBmb3IgQ2FjaGluZyBvZiBkZWZhdWx0IGxhbmd1YWdlXHJcbiAqL1xyXG4vLyBleHBvcnQgdHlwZSBDYWNoZU1lY2hhbmlzbSA9ICdMb2NhbFN0b3JhZ2UnIHwgJ0Nvb2tpZSc7XHJcblxyXG4vKipcclxuICogTmFtZXNwYWNlIGZvciBmYWlsIHByb29mIGFjY2VzcyBvZiBDYWNoZU1lY2hhbmlzbVxyXG4gKi9cclxuZXhwb3J0IGVudW0gQ2FjaGVNZWNoYW5pc20ge1xyXG4gIExvY2FsU3RvcmFnZSA9ICdMb2NhbFN0b3JhZ2UnLFxyXG4gIFNlc3Npb25TdG9yYWdlID0gJ1Nlc3Npb25TdG9yYWdlJyxcclxuICBDb29raWUgPSAnQ29va2llJ1xyXG59XHJcblxyXG4vKipcclxuICogQm9vbGVhbiB0byBpbmRpY2F0ZSB3aGV0aGVyIHRvIHVzZSBjYWNoZWQgbGFuZ3VhZ2UgdmFsdWVcclxuICovXHJcbmV4cG9ydCBjb25zdCBVU0VfQ0FDSEVEX0xBTkcgPSBuZXcgSW5qZWN0aW9uVG9rZW48Ym9vbGVhbj4oJ1VTRV9DQUNIRURfTEFORycpO1xyXG4vKipcclxuICogQ2FjaGUgbWVjaGFuaXNtIHR5cGVcclxuICovXHJcbmV4cG9ydCBjb25zdCBDQUNIRV9NRUNIQU5JU00gPSBuZXcgSW5qZWN0aW9uVG9rZW48Q2FjaGVNZWNoYW5pc20+KCdDQUNIRV9NRUNIQU5JU00nKTtcclxuLyoqXHJcbiAqIENhY2hlIG5hbWVcclxuICovXHJcbmV4cG9ydCBjb25zdCBDQUNIRV9OQU1FID0gbmV3IEluamVjdGlvblRva2VuPHN0cmluZz4oJ0NBQ0hFX05BTUUnKTtcclxuLyoqXHJcbiAqIENvb2tpZSBjYWNoZSBmb3JtYXRcclxuICovXHJcbmV4cG9ydCBjb25zdCBDT09LSUVfRk9STUFUID0gbmV3IEluamVjdGlvblRva2VuPGJvb2xlYW4+KCdDT09LSUVfRk9STUFUJyk7XHJcbi8qKlxyXG4gKiBDb29raWUgY2FjaGUgZm9ybWF0XHJcbiAqL1xyXG5leHBvcnQgY29uc3QgSU5JVElBTF9OQVZJR0FUSU9OID0gbmV3IEluamVjdGlvblRva2VuPGJvb2xlYW4+KCdJTklUSUFMX05BVklHQVRJT04nKTtcclxuXHJcbi8qKlxyXG4gKiBUeXBlIGZvciBkZWZhdWx0IGxhbmd1YWdlIGZ1bmN0aW9uXHJcbiAqIFVzZWQgdG8gb3ZlcnJpZGUgYmFzaWMgYmVoYXZpb3VyXHJcbiAqL1xyXG5leHBvcnQgdHlwZSBEZWZhdWx0TGFuZ3VhZ2VGdW5jdGlvbiA9IChsYW5ndWFnZXM6IHN0cmluZ1tdLCBjYWNoZWRMYW5nPzogc3RyaW5nLCBicm93c2VyTGFuZz86IHN0cmluZykgPT4gc3RyaW5nO1xyXG5cclxuLyoqXHJcbiAqIEZ1bmN0aW9uIGZvciBjYWxjdWxhdGluZyBkZWZhdWx0IGxhbmd1YWdlXHJcbiAqL1xyXG5leHBvcnQgY29uc3QgREVGQVVMVF9MQU5HX0ZVTkNUSU9OID0gbmV3IEluamVjdGlvblRva2VuPERlZmF1bHRMYW5ndWFnZUZ1bmN0aW9uPignREVGQVVMVF9MQU5HX0ZVTkNUSU9OJyk7XHJcblxyXG4vKipcclxuICogQm9vbGVhbiB0byBpbmRpY2F0ZSB3aGV0aGVyIHByZWZpeCBzaG91bGQgYmUgc2V0IGZvciBzaW5nbGUgbGFuZ3VhZ2Ugc2NlbmFyaW9zXHJcbiAqL1xyXG5leHBvcnQgY29uc3QgQUxXQVlTX1NFVF9QUkVGSVggPSBuZXcgSW5qZWN0aW9uVG9rZW48Ym9vbGVhbj4oJ0FMV0FZU19TRVRfUFJFRklYJyk7XHJcblxyXG4vKipcclxuICogQ29uZmlnIGludGVyZmFjZSBmb3IgTG9jYWxpemVSb3V0ZXJcclxuICovXHJcbmV4cG9ydCBpbnRlcmZhY2UgTG9jYWxpemVSb3V0ZXJDb25maWcge1xyXG4gIHBhcnNlcj86IFByb3ZpZGVyO1xyXG4gIHVzZUNhY2hlZExhbmc/OiBib29sZWFuO1xyXG4gIGNhY2hlTWVjaGFuaXNtPzogQ2FjaGVNZWNoYW5pc207XHJcbiAgY2FjaGVOYW1lPzogc3RyaW5nO1xyXG4gIGRlZmF1bHRMYW5nRnVuY3Rpb24/OiBEZWZhdWx0TGFuZ3VhZ2VGdW5jdGlvbjtcclxuICBhbHdheXNTZXRQcmVmaXg/OiBib29sZWFuO1xyXG4gIGNvb2tpZUZvcm1hdD86IHN0cmluZztcclxuICBpbml0aWFsTmF2aWdhdGlvbj86IGJvb2xlYW47XHJcbn1cclxuXHJcbmNvbnN0IExPQ0FMSVpFX0NBQ0hFX05BTUUgPSAnTE9DQUxJWkVfREVGQVVMVF9MQU5HVUFHRSc7XHJcbmNvbnN0IERFRkFVTFRfQ09PS0lFX0ZPUk1BVCA9ICd7e3ZhbHVlfX07e3tleHBpcmVzfX0nO1xyXG5jb25zdCBERUZBVUxUX0lOSVRJQUxfTkFWSUdBVElPTiA9IGZhbHNlO1xyXG5cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgTG9jYWxpemVSb3V0ZXJTZXR0aW5ncyBpbXBsZW1lbnRzIExvY2FsaXplUm91dGVyQ29uZmlnIHtcclxuXHJcbiAgcHVibGljIGNhY2hlTWVjaGFuaXNtOiBDYWNoZU1lY2hhbmlzbTtcclxuICBwdWJsaWMgZGVmYXVsdExhbmdGdW5jdGlvbjogRGVmYXVsdExhbmd1YWdlRnVuY3Rpb247XHJcblxyXG4gIC8qKlxyXG4gICAqIFNldHRpbmdzIGZvciBsb2NhbGl6ZSByb3V0ZXJcclxuICAgKi9cclxuICBjb25zdHJ1Y3RvcihcclxuICAgIEBJbmplY3QoVVNFX0NBQ0hFRF9MQU5HKSBwdWJsaWMgdXNlQ2FjaGVkTGFuZzogYm9vbGVhbiA9IHRydWUsXHJcbiAgICBASW5qZWN0KEFMV0FZU19TRVRfUFJFRklYKSBwdWJsaWMgYWx3YXlzU2V0UHJlZml4OiBib29sZWFuID0gdHJ1ZSxcclxuICAgIEBJbmplY3QoQ0FDSEVfTUVDSEFOSVNNKSBjYWNoZU1lY2hhbmlzbSA9IENhY2hlTWVjaGFuaXNtLkxvY2FsU3RvcmFnZSxcclxuICAgIEBJbmplY3QoQ0FDSEVfTkFNRSkgcHVibGljIGNhY2hlTmFtZTogc3RyaW5nID0gTE9DQUxJWkVfQ0FDSEVfTkFNRSxcclxuICAgIEBJbmplY3QoREVGQVVMVF9MQU5HX0ZVTkNUSU9OKSBkZWZhdWx0TGFuZ0Z1bmN0aW9uID0gdm9pZCAwLFxyXG4gICAgQEluamVjdChDT09LSUVfRk9STUFUKSBwdWJsaWMgY29va2llRm9ybWF0OiBzdHJpbmcgPSBERUZBVUxUX0NPT0tJRV9GT1JNQVQsXHJcbiAgICBASW5qZWN0KElOSVRJQUxfTkFWSUdBVElPTikgcHVibGljIGluaXRpYWxOYXZpZ2F0aW9uOiBib29sZWFuID0gREVGQVVMVF9JTklUSUFMX05BVklHQVRJT04sXHJcbiAgKSB7XHJcbiAgICB0aGlzLmNhY2hlTWVjaGFuaXNtID0gY2FjaGVNZWNoYW5pc207XHJcbiAgICB0aGlzLmRlZmF1bHRMYW5nRnVuY3Rpb24gPSBkZWZhdWx0TGFuZ0Z1bmN0aW9uO1xyXG4gIH1cclxuXHJcbn1cclxuIl19