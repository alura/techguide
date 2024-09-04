import "./fixPolyfills.js";
import type { DocumentNode } from "graphql";
import { ApolloCache } from "../core/cache.js";
import type { Cache } from "../core/types/Cache.js";
import type { StoreObject, Reference } from "../../utilities/index.js";
import type { InMemoryCacheConfig, NormalizedCacheObject } from "./types.js";
import { makeVar } from "./reactiveVars.js";
import { Policies } from "./policies.js";
import type { OperationVariables } from "../../core/index.js";
import { getInMemoryCacheMemoryInternals } from "../../utilities/caching/getMemoryInternals.js";
type BroadcastOptions = Pick<Cache.BatchOptions<InMemoryCache>, "optimistic" | "onWatchUpdated">;
export declare class InMemoryCache extends ApolloCache<NormalizedCacheObject> {
    private data;
    private optimisticData;
    protected config: InMemoryCacheConfig;
    private watches;
    private addTypename;
    private storeReader;
    private storeWriter;
    private addTypenameTransform;
    private maybeBroadcastWatch;
    readonly assumeImmutableResults = true;
    readonly policies: Policies;
    readonly makeVar: typeof makeVar;
    constructor(config?: InMemoryCacheConfig);
    private init;
    private resetResultCache;
    restore(data: NormalizedCacheObject): this;
    extract(optimistic?: boolean): NormalizedCacheObject;
    read<T>(options: Cache.ReadOptions): T | null;
    write(options: Cache.WriteOptions): Reference | undefined;
    modify<Entity extends Record<string, any> = Record<string, any>>(options: Cache.ModifyOptions<Entity>): boolean;
    diff<TData, TVariables extends OperationVariables = any>(options: Cache.DiffOptions<TData, TVariables>): Cache.DiffResult<TData>;
    watch<TData = any, TVariables = any>(watch: Cache.WatchOptions<TData, TVariables>): () => void;
    gc(options?: {
        resetResultCache?: boolean;
        resetResultIdentities?: boolean;
    }): string[];
    retain(rootId: string, optimistic?: boolean): number;
    release(rootId: string, optimistic?: boolean): number;
    identify(object: StoreObject | Reference): string | undefined;
    evict(options: Cache.EvictOptions): boolean;
    reset(options?: Cache.ResetOptions): Promise<void>;
    removeOptimistic(idToRemove: string): void;
    private txCount;
    batch<TUpdateResult>(options: Cache.BatchOptions<InMemoryCache, TUpdateResult>): TUpdateResult;
    performTransaction(update: (cache: InMemoryCache) => any, optimisticId?: string | null): any;
    transformDocument(document: DocumentNode): DocumentNode;
    protected broadcastWatches(options?: BroadcastOptions): void;
    private addFragmentsToDocument;
    private addTypenameToDocument;
    private broadcastWatch;
    /**
     * @experimental
     * @internal
     * This is not a stable API - it is used in development builds to expose
     * information to the DevTools.
     * Use at your own risk!
     */
    getMemoryInternals?: typeof getInMemoryCacheMemoryInternals;
}
export {};
//# sourceMappingURL=inMemoryCache.d.ts.map