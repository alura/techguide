import { Slot } from "@wry/context";
import { AnyEntry } from "./entry.js";
export declare const parentEntrySlot: {
    readonly id: string;
    hasValue(): boolean;
    getValue(): AnyEntry | undefined;
    withValue<TResult, TArgs extends any[], TThis = any>(value: AnyEntry | undefined, callback: (this: TThis, ...args: TArgs) => TResult, args?: TArgs | undefined, thisArg?: TThis | undefined): TResult;
};
export declare function nonReactive<R>(fn: () => R): R;
export { Slot };
export { bind as bindContext, noContext, setTimeout, asyncFromGen, } from "@wry/context";
