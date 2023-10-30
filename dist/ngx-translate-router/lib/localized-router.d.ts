import { Router } from '@angular/router';
import { NgModuleFactory } from '@angular/core';
import { Observable } from 'rxjs';
import * as i0 from "@angular/core";
export declare class LocalizedRouter extends Router {
    private platformId;
    private compiler;
    private localize;
    constructor();
    static ɵfac: i0.ɵɵFactoryDeclaration<LocalizedRouter, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<LocalizedRouter>;
}
export declare function wrapIntoObservable<T>(value: T | NgModuleFactory<T> | Promise<T> | Observable<T>): Observable<T | NgModuleFactory<T>>;
