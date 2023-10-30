/**
 * Compare if two objects are same
 */
export declare function equals(o1: any, o2: any): boolean;
/**
 * Determine if the argument is shaped like a Promise
 */
export declare function isPromise(obj: any): obj is Promise<any>;
/**
 * Deep copy of object and array
 */
export declare function deepCopy<t>(object: t): t;
export declare function flatten<T>(list: Array<T | T[]>): T[];
