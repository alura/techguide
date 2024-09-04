import { AnyEntry } from "./entry.js";
import { OptimisticWrapOptions } from "./index.js";
import { Unsubscribable } from "./helpers.js";
type EntryMethodName = keyof typeof EntryMethods;
declare const EntryMethods: {
    setDirty: boolean;
    dispose: boolean;
    forget: boolean;
};
export type OptimisticDependencyFunction<TKey> = ((key: TKey) => void) & {
    dirty: (key: TKey, entryMethodName?: EntryMethodName) => void;
};
export type Dep<TKey> = Set<AnyEntry> & {
    subscribe: OptimisticWrapOptions<[TKey]>["subscribe"];
} & Unsubscribable;
export declare function dep<TKey>(options?: {
    subscribe: Dep<TKey>["subscribe"];
}): OptimisticDependencyFunction<TKey>;
export {};
