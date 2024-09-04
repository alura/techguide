import type { AnyFunction, AnyFunctionMap } from 'apollo-server-types';
declare type Args<F> = F extends (...args: infer A) => any ? A : never;
declare type AsFunction<F> = F extends AnyFunction ? F : never;
declare type StripPromise<T> = T extends Promise<infer U> ? U : never;
declare type DidEndHook<TArgs extends any[]> = (...args: TArgs) => void;
declare type AsyncDidEndHook<TArgs extends any[]> = (...args: TArgs) => Promise<void>;
export declare class Dispatcher<T extends AnyFunctionMap> {
    protected targets: T[];
    constructor(targets: T[]);
    private callTargets;
    hasHook(methodName: keyof T): boolean;
    invokeHook<TMethodName extends keyof T, THookReturn extends StripPromise<ReturnType<AsFunction<T[TMethodName]>>>>(methodName: TMethodName, ...args: Args<T[TMethodName]>): Promise<THookReturn[]>;
    invokeHooksUntilNonNull<TMethodName extends keyof T>(methodName: TMethodName, ...args: Args<T[TMethodName]>): Promise<StripPromise<ReturnType<AsFunction<T[TMethodName]>>> | null>;
    invokeDidStartHook<TMethodName extends keyof T, TEndHookArgs extends Args<StripPromise<ReturnType<AsFunction<T[TMethodName]>>>>>(methodName: TMethodName, ...args: Args<T[TMethodName]>): Promise<AsyncDidEndHook<TEndHookArgs>>;
    invokeSyncDidStartHook<TMethodName extends keyof T, TEndHookArgs extends Args<ReturnType<AsFunction<T[TMethodName]>>>>(methodName: TMethodName, ...args: Args<T[TMethodName]>): DidEndHook<TEndHookArgs>;
}
export {};
//# sourceMappingURL=dispatcher.d.ts.map