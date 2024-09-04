import { OptimisticWrapOptions } from "./index.js";
import { Dep } from "./dep.js";
import { Unsubscribable } from "./helpers.js";
type Value<T> = [] | [T] | [void, any];
export type AnyEntry = Entry<any, any>;
export declare class Entry<TArgs extends any[], TValue> {
    readonly fn: (...args: TArgs) => TValue;
    static count: number;
    normalizeResult: OptimisticWrapOptions<TArgs, any, any, TValue>["normalizeResult"];
    subscribe: OptimisticWrapOptions<TArgs>["subscribe"];
    unsubscribe: Unsubscribable["unsubscribe"];
    readonly parents: Set<AnyEntry>;
    readonly childValues: Map<AnyEntry, Value<any>>;
    dirtyChildren: Set<AnyEntry> | null;
    dirty: boolean;
    recomputing: boolean;
    readonly value: Value<TValue>;
    constructor(fn: (...args: TArgs) => TValue);
    peek(): TValue | undefined;
    recompute(args: TArgs): TValue;
    setDirty(): void;
    dispose(): void;
    forget(): void;
    private deps;
    dependOn(dep: Dep<any>): void;
    forgetDeps(): void;
}
export {};
