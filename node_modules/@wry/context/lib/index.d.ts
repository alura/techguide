import { Slot } from "./slot.js";
export { Slot };
export declare const bind: <TArgs extends any[], TResult, TThis = any>(callback: (this: TThis, ...args: TArgs) => TResult) => (this: TThis, ...args: TArgs) => TResult, noContext: <TResult, TArgs extends any[], TThis = any>(callback: (this: TThis, ...args: TArgs) => TResult, args?: TArgs | undefined, thisArg?: TThis | undefined) => TResult;
export { setTimeoutWithContext as setTimeout };
declare function setTimeoutWithContext(callback: () => any, delay: number): any;
export declare function asyncFromGen<TArgs extends any[], TYield = any, TReturn = any, TNext = any>(genFn: (...args: TArgs) => Generator<TYield, TReturn, TNext>): (...args: TArgs) => Promise<any>;
export declare function wrapYieldingFiberMethods<F extends Function>(Fiber: F): F;
