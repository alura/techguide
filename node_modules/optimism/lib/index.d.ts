import { Trie } from "@wry/trie";
import { CommonCache } from "@wry/caches";
import { Entry } from "./entry.js";
import type { NoInfer } from "./helpers.js";
export { bindContext, noContext, nonReactive, setTimeout, asyncFromGen, Slot, } from "./context.js";
export { dep, OptimisticDependencyFunction } from "./dep.js";
export declare function defaultMakeCacheKey(...args: any[]): object;
export { Trie as KeyTrie };
export type OptimisticWrapperFunction<TArgs extends any[], TResult, TKeyArgs extends any[] = TArgs, TCacheKey = any> = ((...args: TArgs) => TResult) & {
    readonly size: number;
    options: OptionsWithCacheInstance<TArgs, TKeyArgs, TCacheKey>;
    dirty: (...args: TKeyArgs) => void;
    dirtyKey: (key: TCacheKey | undefined) => void;
    peek: (...args: TKeyArgs) => TResult | undefined;
    peekKey: (key: TCacheKey | undefined) => TResult | undefined;
    forget: (...args: TKeyArgs) => boolean;
    forgetKey: (key: TCacheKey | undefined) => boolean;
    getKey: (...args: TArgs) => TCacheKey | undefined;
    makeCacheKey: (...args: TKeyArgs) => TCacheKey | undefined;
};
export { CommonCache };
export interface CommonCacheConstructor<TCacheKey, TResult, TArgs extends any[]> extends Function {
    new <K extends TCacheKey, V extends Entry<TArgs, TResult>>(max?: number, dispose?: (value: V, key?: K) => void): CommonCache<K, V>;
}
export type OptimisticWrapOptions<TArgs extends any[], TKeyArgs extends any[] = TArgs, TCacheKey = any, TResult = any> = {
    max?: number;
    keyArgs?: (...args: TArgs) => TKeyArgs;
    makeCacheKey?: (...args: NoInfer<TKeyArgs>) => TCacheKey | undefined;
    normalizeResult?: (newer: TResult, older: TResult) => TResult;
    subscribe?: (...args: TArgs) => void | (() => any);
    cache?: CommonCache<NoInfer<TCacheKey>, Entry<NoInfer<TArgs>, NoInfer<TResult>>> | CommonCacheConstructor<NoInfer<TCacheKey>, NoInfer<TResult>, NoInfer<TArgs>>;
};
export interface OptionsWithCacheInstance<TArgs extends any[], TKeyArgs extends any[] = TArgs, TCacheKey = any, TResult = any> extends OptimisticWrapOptions<TArgs, TKeyArgs, TCacheKey, TResult> {
    cache: CommonCache<NoInfer<TCacheKey>, Entry<NoInfer<TArgs>, NoInfer<TResult>>>;
}
export declare function wrap<TArgs extends any[], TResult, TKeyArgs extends any[] = TArgs, TCacheKey = any>(originalFunction: (...args: TArgs) => TResult, { max, keyArgs, makeCacheKey, normalizeResult, subscribe, cache: cacheOption, }?: OptimisticWrapOptions<TArgs, TKeyArgs, TCacheKey, TResult>): OptimisticWrapperFunction<TArgs, TResult, TKeyArgs, TCacheKey>;
