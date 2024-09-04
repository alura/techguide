import type { SelectionSetNode, FieldNode } from "graphql";
import type { FragmentMap, FragmentMapFunction, StoreObject, Reference } from "../../utilities/index.js";
import type { NormalizedCache, ReadMergeModifyContext, MergeTree, InMemoryCacheConfig } from "./types.js";
import type { StoreReader } from "./readFromStore.js";
import type { InMemoryCache } from "./inMemoryCache.js";
import type { Cache } from "../../core/index.js";
export interface WriteContext extends ReadMergeModifyContext {
    readonly written: {
        [dataId: string]: SelectionSetNode[];
    };
    readonly fragmentMap: FragmentMap;
    lookupFragment: FragmentMapFunction;
    merge<T>(existing: T, incoming: T): T;
    overwrite: boolean;
    incomingById: Map<string, {
        storeObject: StoreObject;
        mergeTree?: MergeTree;
        fieldNodeSet: Set<FieldNode>;
    }>;
    clientOnly: boolean;
    deferred: boolean;
    flavors: Map<string, FlavorableWriteContext>;
}
type FlavorableWriteContext = Pick<WriteContext, "clientOnly" | "deferred" | "flavors">;
export declare class StoreWriter {
    readonly cache: InMemoryCache;
    private reader?;
    private fragments?;
    constructor(cache: InMemoryCache, reader?: StoreReader | undefined, fragments?: InMemoryCacheConfig["fragments"]);
    writeToStore(store: NormalizedCache, { query, result, dataId, variables, overwrite }: Cache.WriteOptions): Reference | undefined;
    private processSelectionSet;
    private processFieldValue;
    private flattenFields;
    private applyMerges;
}
export {};
//# sourceMappingURL=writeToStore.d.ts.map