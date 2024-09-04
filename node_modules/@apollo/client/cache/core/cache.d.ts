import type { DocumentNode } from "graphql";
import type { StoreObject, Reference, DeepPartial } from "../../utilities/index.js";
import { Observable } from "../../utilities/index.js";
import type { DataProxy } from "./types/DataProxy.js";
import type { Cache } from "./types/Cache.js";
import { getApolloCacheMemoryInternals } from "../../utilities/caching/getMemoryInternals.js";
import type { OperationVariables, TypedDocumentNode } from "../../core/types.js";
import type { MissingTree } from "./types/common.js";
export type Transaction<T> = (c: ApolloCache<T>) => void;
/**
 * Watched fragment options.
 */
export interface WatchFragmentOptions<TData, TVars> {
    /**
     * A GraphQL fragment document parsed into an AST with the `gql`
     * template literal.
     *
     * @docGroup 1. Required options
     */
    fragment: DocumentNode | TypedDocumentNode<TData, TVars>;
    /**
     * An object containing a `__typename` and primary key fields
     * (such as `id`) identifying the entity object from which the fragment will
     * be retrieved, or a `{ __ref: "..." }` reference, or a `string` ID
     * (uncommon).
     *
     * @docGroup 1. Required options
     */
    from: StoreObject | Reference | string;
    /**
     * Any variables that the GraphQL fragment may depend on.
     *
     * @docGroup 2. Cache options
     */
    variables?: TVars;
    /**
     * The name of the fragment defined in the fragment document.
     *
     * Required if the fragment document includes more than one fragment,
     * optional otherwise.
     *
     * @docGroup 2. Cache options
     */
    fragmentName?: string;
    /**
     * If `true`, `watchFragment` returns optimistic results.
     *
     * The default value is `true`.
     *
     * @docGroup 2. Cache options
     */
    optimistic?: boolean;
    /**
     * @deprecated
     * Using `canonizeResults` can result in memory leaks so we generally do not
     * recommend using this option anymore.
     * A future version of Apollo Client will contain a similar feature.
     *
     * Whether to canonize cache results before returning them. Canonization
     * takes some extra time, but it speeds up future deep equality comparisons.
     * Defaults to false.
     */
    canonizeResults?: boolean;
}
/**
 * Watched fragment results.
 */
export type WatchFragmentResult<TData> = {
    data: TData;
    complete: true;
    missing?: never;
} | {
    data: DeepPartial<TData>;
    complete: false;
    missing: MissingTree;
};
export declare abstract class ApolloCache<TSerialized> implements DataProxy {
    readonly assumeImmutableResults: boolean;
    abstract read<TData = any, TVariables = any>(query: Cache.ReadOptions<TVariables, TData>): TData | null;
    abstract write<TData = any, TVariables = any>(write: Cache.WriteOptions<TData, TVariables>): Reference | undefined;
    abstract diff<T>(query: Cache.DiffOptions): Cache.DiffResult<T>;
    abstract watch<TData = any, TVariables = any>(watch: Cache.WatchOptions<TData, TVariables>): () => void;
    abstract reset(options?: Cache.ResetOptions): Promise<void>;
    abstract evict(options: Cache.EvictOptions): boolean;
    /**
     * Replaces existing state in the cache (if any) with the values expressed by
     * `serializedState`.
     *
     * Called when hydrating a cache (server side rendering, or offline storage),
     * and also (potentially) during hot reloads.
     */
    abstract restore(serializedState: TSerialized): ApolloCache<TSerialized>;
    /**
     * Exposes the cache's complete state, in a serializable format for later restoration.
     */
    abstract extract(optimistic?: boolean): TSerialized;
    abstract removeOptimistic(id: string): void;
    batch<U>(options: Cache.BatchOptions<this, U>): U;
    abstract performTransaction(transaction: Transaction<TSerialized>, optimisticId?: string | null): void;
    recordOptimisticTransaction(transaction: Transaction<TSerialized>, optimisticId: string): void;
    transformDocument(document: DocumentNode): DocumentNode;
    transformForLink(document: DocumentNode): DocumentNode;
    identify(object: StoreObject | Reference): string | undefined;
    gc(): string[];
    modify<Entity extends Record<string, any> = Record<string, any>>(options: Cache.ModifyOptions<Entity>): boolean;
    readQuery<QueryType, TVariables = any>(options: Cache.ReadQueryOptions<QueryType, TVariables>, optimistic?: boolean): QueryType | null;
    /**
     * Watches the cache store of the fragment according to the options specified and returns an `Observable`. We can subscribe to this `Observable` and receive updated results through an observer when the cache store changes.
     * 
     * You must pass in a GraphQL document with a single fragment or a document with multiple fragments that represent what you are reading. If you pass in a document with multiple fragments then you must also specify a `fragmentName`.
     * 
     * @param options - An object of type `WatchFragmentOptions` that allows the cache to identify the fragment and optionally specify whether to react to optimistic updates.
     * 
     * @since
     * 
     * 3.10.0
     */
    watchFragment<TData = any, TVars = OperationVariables>(options: WatchFragmentOptions<TData, TVars>): Observable<WatchFragmentResult<TData>>;
    private getFragmentDoc;
    readFragment<FragmentType, TVariables = any>(options: Cache.ReadFragmentOptions<FragmentType, TVariables>, optimistic?: boolean): FragmentType | null;
    writeQuery<TData = any, TVariables = any>({ id, data, ...options }: Cache.WriteQueryOptions<TData, TVariables>): Reference | undefined;
    writeFragment<TData = any, TVariables = any>({ id, data, fragment, fragmentName, ...options }: Cache.WriteFragmentOptions<TData, TVariables>): Reference | undefined;
    updateQuery<TData = any, TVariables = any>(options: Cache.UpdateQueryOptions<TData, TVariables>, update: (data: TData | null) => TData | null | void): TData | null;
    updateFragment<TData = any, TVariables = any>(options: Cache.UpdateFragmentOptions<TData, TVariables>, update: (data: TData | null) => TData | null | void): TData | null;
    /**
     * @experimental
     * @internal
     * This is not a stable API - it is used in development builds to expose
     * information to the DevTools.
     * Use at your own risk!
     */
    getMemoryInternals?: typeof getApolloCacheMemoryInternals;
}
//# sourceMappingURL=cache.d.ts.map