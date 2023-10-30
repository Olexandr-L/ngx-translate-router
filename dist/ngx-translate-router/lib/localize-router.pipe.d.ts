import { PipeTransform, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { LocalizeRouterService } from './localize-router.service';
import * as i0 from "@angular/core";
export declare class LocalizeRouterPipe implements PipeTransform, OnDestroy {
    private localize;
    private _ref;
    private value;
    private lastKey;
    private lastLanguage;
    private subscription;
    /**
     * CTOR
     */
    constructor(localize: LocalizeRouterService, _ref: ChangeDetectorRef);
    ngOnDestroy(): void;
    /**
     * Transform current url to localized one
     */
    transform(query: string | any[]): string | any[];
    static ɵfac: i0.ɵɵFactoryDeclaration<LocalizeRouterPipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<LocalizeRouterPipe, "localize", false>;
}
