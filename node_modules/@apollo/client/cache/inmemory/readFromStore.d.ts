import type { SelectionSetNode } from "graphql";
import type { Reference, StoreObject } from "../../utilities/index.js";
import type { Cache } from "../core/types/Cache.js";
import type { DiffQueryAgainstStoreOptions, InMemoryCacheConfig, ReadMergeModifyContext } from "./types.js";
import type { InMemoryCache } from "./inMemoryCache.js";
import type { MissingTree } from "../core/types/common.js";
import { ObjectCanon } from "./object-canon.js";
export type VariableMap = {
    [name: string]: any;
};
export type ExecResult<R = any> = {
    result: R;
    missing?: MissingTree;
};
export interface StoreReaderConfig {
    cache: InMemoryCache;
    addTypename?: boolean;
    resultCacheMaxSize?: number;
    canonizeResults?: boolean;
    canon?: ObjectCanon;
    fragments?: InMemoryCacheConfig["fragments"];
}
export declare class StoreReader {
    private executeSelectionSet;
    private executeSubSelectedArray;
    private config;
    private knownResults;
    canon: ObjectCanon;
    resetCanon(): void;
    constructor(config: StoreReaderConfig);
    /**
     * Given a store and a query, return as much of the result as possible and
     * identify if any data was missing from the store.
     */
    diffQueryAgainstStore<T>({ store, query, rootId, variables, returnPartialData, canonizeResults, }: DiffQueryAgainstStoreOptions): Cache.DiffResult<T>;
    isFresh(result: Record<string, any>, parent: StoreObject | Reference, selectionSet: SelectionSetNode, context: ReadMergeModifyContext): boolean;
    private execSelectionSetImpl;
    private execSubSelectedArrayImpl;
}
//# sourceMappingURL=readFromStore.d.ts.map