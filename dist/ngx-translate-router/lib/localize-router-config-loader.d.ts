import { NgModuleFactory, Injector, Type, NgModuleRef } from '@angular/core';
export declare class LocalizeNgModuleFactory extends NgModuleFactory<any> {
    moduleType: Type<any>;
    constructor(moduleType: Type<any>);
    create: (parentInjector: Injector) => NgModuleRef<any>;
}
export declare function translateModule(moduleType: Type<any>): LocalizeNgModuleFactory;
