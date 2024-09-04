import type { DocumentNode } from "graphql";
import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import type { FetchResult } from "../link/core/index.js";
import type { DefaultContext, MutationQueryReducersMap, OperationVariables, MutationUpdaterFunction, OnQueryUpdated, InternalRefetchQueriesInclude } from "./types.js";
import type { ApolloCache } from "../cache/index.js";
import type { ObservableQuery } from "./ObservableQuery.js";
import type { IgnoreModifier } from "../cache/core/types/common.js";
/**
 * fetchPolicy determines where the client may return a result from. The options are:
 * - cache-first (default): return result from cache. Only fetch from network if cached result is not available.
 * - cache-and-network: return result from cache first (if it exists), then return network result once it's available.
 * - cache-only: return result from cache if available, fail otherwise.
 * - no-cache: return result from network, fail if network call doesn't succeed, don't save to cache
 * - network-only: return result from network, fail if network call doesn't succeed, save to cache
 * - standby: only for queries that aren't actively watched, but should be available for refetch and updateQueries.
 */
export type FetchPolicy = "cache-first" | "network-only" | "cache-only" | "no-cache" | "standby";
export type WatchQueryFetchPolicy = FetchPolicy | "cache-and-network";
export type MutationFetchPolicy = Extract<FetchPolicy, "network-only" | "no-cache">;
export type RefetchWritePolicy = "merge" | "overwrite";
/**
 * errorPolicy determines the level of events for errors in the execution result. The options are:
 * - none (default): any errors from the request are treated like runtime errors and the observable is stopped
 * - ignore: errors from the request do not stop the observable, but also don't call `next`
 * - all: errors are treated like data and will notify observables
 */
export type ErrorPolicy = "none" | "ignore" | "all";
/**
 * Query options.
 */
export interface QueryOptions<TVariables = OperationVariables, TData = any> {
    /**
     * A GraphQL query string parsed into an AST with the gql template literal.
     * 
     * @docGroup
     * 
     * 1. Operation options
     */
    query: DocumentNode | TypedDocumentNode<TData, TVariables>;
    /**
     * An object containing all of the GraphQL variables your query requires to execute.
     * 
     * Each key in the object corresponds to a variable name, and that key's value corresponds to the variable value.
     * 
     * @docGroup
     * 
     * 1. Operation options
     */
    variables?: TVariables;
    /**
     * Specifies how the query handles a response that returns both GraphQL errors and partial results.
     * 
     * For details, see [GraphQL error policies](https://www.apollographql.com/docs/react/data/error-handling/#graphql-error-policies).
     * 
     * The default value is `none`, meaning that the query result includes error details but not partial results.
     * 
     * @docGroup
     * 
     * 1. Operation options
     */
    errorPolicy?: ErrorPolicy;
    /**
     * If you're using [Apollo Link](https://www.apollographql.com/docs/react/api/link/introduction/), this object is the initial value of the `context` object that's passed along your link chain.
     * 
     * @docGroup
     * 
     * 2. Networking options
     */
    context?: DefaultContext;
    /**
     * Specifies how the query interacts with the Apollo Client cache during execution (for example, whether it checks the cache for results before sending a request to the server).
     * 
     * For details, see [Setting a fetch policy](https://www.apollographql.com/docs/react/data/queries/#setting-a-fetch-policy).
     * 
     * The default value is `cache-first`.
     * 
     * @docGroup
     * 
     * 3. Caching options
     */
    fetchPolicy?: FetchPolicy;
    /**
     * Specifies the interval (in milliseconds) at which the query polls for updated results.
     * 
     * The default value is `0` (no polling).
     * 
     * @docGroup
     * 
     * 2. Networking options
     */
    pollInterval?: number;
    /**
     * If `true`, the in-progress query's associated component re-renders whenever the network status changes or a network error occurs.
     * 
     * The default value is `false`.
     * 
     * @docGroup
     * 
     * 2. Networking options
     */
    notifyOnNetworkStatusChange?: boolean;
    /**
     * If `true`, the query can return partial results from the cache if the cache doesn't contain results for all queried fields.
     * 
     * The default value is `false`.
     * 
     * @docGroup
     * 
     * 3. Caching options
     */
    returnPartialData?: boolean;
    /**
     * If `true`, causes a query refetch if the query result is detected as partial.
     * 
     * The default value is `false`.
     * 
     * @deprecated
     * 
     * Setting this option is unnecessary in Apollo Client 3, thanks to a more consistent application of fetch policies. It might be removed in a future release.
     */
    partialRefetch?: boolean;
    /**
     * Whether to canonize cache results before returning them. Canonization takes some extra time, but it speeds up future deep equality comparisons. Defaults to false.
     * 
     * @deprecated
     * 
     * Using `canonizeResults` can result in memory leaks so we generally do not recommend using this option anymore. A future version of Apollo Client will contain a similar feature without the risk of memory leaks.
     */
    canonizeResults?: boolean;
}
/**
 * Watched query options.
 */
export interface WatchQueryOptions<TVariables extends OperationVariables = OperationVariables, TData = any> extends SharedWatchQueryOptions<TVariables, TData> {
    /**
     * A GraphQL query string parsed into an AST with the gql template literal.
     * 
     * @docGroup
     * 
     * 1. Operation options
     */
    query: DocumentNode | TypedDocumentNode<TData, TVariables>;
}
export interface SharedWatchQueryOptions<TVariables extends OperationVariables, TData> {
    /**
     * Specifies how the query interacts with the Apollo Client cache during execution (for example, whether it checks the cache for results before sending a request to the server).
     * 
     * For details, see [Setting a fetch policy](https://www.apollographql.com/docs/react/data/queries/#setting-a-fetch-policy).
     * 
     * The default value is `cache-first`.
     * 
     * @docGroup
     * 
     * 3. Caching options
     */
    fetchPolicy?: WatchQueryFetchPolicy;
    /**
     * Specifies the `FetchPolicy` to be used after this query has completed.
     * 
     * @docGroup
     * 
     * 3. Caching options
     */
    nextFetchPolicy?: WatchQueryFetchPolicy | ((this: WatchQueryOptions<TVariables, TData>, currentFetchPolicy: WatchQueryFetchPolicy, context: NextFetchPolicyContext<TData, TVariables>) => WatchQueryFetchPolicy);
    /**
     * Defaults to the initial value of options.fetchPolicy, but can be explicitly configured to specify the WatchQueryFetchPolicy to revert back to whenever variables change (unless nextFetchPolicy intervenes).
     * 
     * @docGroup
     * 
     * 3. Caching options
     */
    initialFetchPolicy?: WatchQueryFetchPolicy;
    /**
     * Specifies whether a `NetworkStatus.refetch` operation should merge incoming field data with existing data, or overwrite the existing data. Overwriting is probably preferable, but merging is currently the default behavior, for backwards compatibility with Apollo Client 3.x.
     * 
     * @docGroup
     * 
     * 3. Caching options
     */
    refetchWritePolicy?: RefetchWritePolicy;
    /**
     * An object containing all of the GraphQL variables your query requires to execute.
     * 
     * Each key in the object corresponds to a variable name, and that key's value corresponds to the variable value.
     * 
     * @docGroup
     * 
     * 1. Operation options
     */
    variables?: TVariables;
    /**
     * Specifies how the query handles a response that returns both GraphQL errors and partial results.
     * 
     * For details, see [GraphQL error policies](https://www.apollographql.com/docs/react/data/error-handling/#graphql-error-policies).
     * 
     * The default value is `none`, meaning that the query result includes error details but not partial results.
     * 
     * @docGroup
     * 
     * 1. Operation options
     */
    errorPolicy?: ErrorPolicy;
    /**
     * If you're using [Apollo Link](https://www.apollographql.com/docs/react/api/link/introduction/), this object is the initial value of the `context` object that's passed along your link chain.
     * 
     * @docGroup
     * 
     * 2. Networking options
     */
    context?: DefaultContext;
    /**
     * Specifies the interval (in milliseconds) at which the query polls for updated results.
     * 
     * The default value is `0` (no polling).
     * 
     * @docGroup
     * 
     * 2. Networking options
     */
    pollInterval?: number;
    /**
     * If `true`, the in-progress query's associated component re-renders whenever the network status changes or a network error occurs.
     * 
     * The default value is `false`.
     * 
     * @docGroup
     * 
     * 2. Networking options
     */
    notifyOnNetworkStatusChange?: boolean;
    /**
     * If `true`, the query can return partial results from the cache if the cache doesn't contain results for all queried fields.
     * 
     * The default value is `false`.
     * 
     * @docGroup
     * 
     * 3. Caching options
     */
    returnPartialData?: boolean;
    /**
     * If `true`, causes a query refetch if the query result is detected as partial.
     * 
     * The default value is `false`.
     * 
     * @deprecated
     * 
     * Setting this option is unnecessary in Apollo Client 3, thanks to a more consistent application of fetch policies. It might be removed in a future release.
     */
    partialRefetch?: boolean;
    /**
     * Whether to canonize cache results before returning them. Canonization takes some extra time, but it speeds up future deep equality comparisons. Defaults to false.
     * 
     * @deprecated
     * 
     * Using `canonizeResults` can result in memory leaks so we generally do not recommend using this option anymore. A future version of Apollo Client will contain a similar feature without the risk of memory leaks.
     */
    canonizeResults?: boolean;
    /**
     * A callback function that's called whenever a refetch attempt occurs while polling. If the function returns `true`, the refetch is skipped and not reattempted until the next poll interval.
     * 
     * @docGroup
     * 
     * 2. Networking options
     */
    skipPollAttempt?: () => boolean;
}
export interface NextFetchPolicyContext<TData, TVariables extends OperationVariables> {
    reason: "after-fetch" | "variables-changed";
    observable: ObservableQuery<TData, TVariables>;
    options: WatchQueryOptions<TVariables, TData>;
    initialFetchPolicy: WatchQueryFetchPolicy;
}
export interface FetchMoreQueryOptions<TVariables, TData = any> {
    /**
     * A GraphQL query string parsed into an AST with the gql template literal.
     * 
     * @docGroup
     * 
     * 1. Operation options
     */
    query?: DocumentNode | TypedDocumentNode<TData, TVariables>;
    /**
     * An object containing all of the GraphQL variables your query requires to execute.
     * 
     * Each key in the object corresponds to a variable name, and that key's value corresponds to the variable value.
     * 
     * @docGroup
     * 
     * 1. Operation options
     */
    variables?: Partial<TVariables>;
    context?: DefaultContext;
}
export type UpdateQueryFn<TData = any, TSubscriptionVariables = OperationVariables, TSubscriptionData = TData> = (previousQueryResult: TData, options: {
    subscriptionData: {
        data: TSubscriptionData;
    };
    variables?: TSubscriptionVariables;
}) => TData;
export type SubscribeToMoreOptions<TData = any, TSubscriptionVariables = OperationVariables, TSubscriptionData = TData> = {
    document: DocumentNode | TypedDocumentNode<TSubscriptionData, TSubscriptionVariables>;
    variables?: TSubscriptionVariables;
    updateQuery?: UpdateQueryFn<TData, TSubscriptionVariables, TSubscriptionData>;
    onError?: (error: Error) => void;
    context?: DefaultContext;
};
export interface SubscriptionOptions<TVariables = OperationVariables, TData = any> {
    /**
     * A GraphQL document, often created with `gql` from the `graphql-tag` package, that contains a single subscription inside of it.
     */
    query: DocumentNode | TypedDocumentNode<TData, TVariables>;
    /**
     * An object containing all of the variables your subscription needs to execute
     */
    variables?: TVariables;
    /**
     * How you want your component to interact with the Apollo cache. For details, see [Setting a fetch policy](https://www.apollographql.com/docs/react/data/queries/#setting-a-fetch-policy).
     */
    fetchPolicy?: FetchPolicy;
    /**
     * Specifies the `ErrorPolicy` to be used for this operation
     */
    errorPolicy?: ErrorPolicy;
    /**
     * Shared context between your component and your network interface (Apollo Link).
     */
    context?: DefaultContext;
}
export interface MutationBaseOptions<TData = any, TVariables = OperationVariables, TContext = DefaultContext, TCache extends ApolloCache<any> = ApolloCache<any>> {
    /**
     * By providing either an object or a callback function that, when invoked after a mutation, allows you to return optimistic data and optionally skip updates via the `IGNORE` sentinel object, Apollo Client caches this temporary (and potentially incorrect) response until the mutation completes, enabling more responsive UI updates.
     * 
     * For more information, see [Optimistic mutation results](https://www.apollographql.com/docs/react/performance/optimistic-ui/).
     * 
     * @docGroup
     * 
     * 3. Caching options
     */
    optimisticResponse?: TData | ((vars: TVariables, { IGNORE }: {
        IGNORE: IgnoreModifier;
    }) => TData);
    /**
     * A `MutationQueryReducersMap`, which is map from query names to mutation query reducers. Briefly, this map defines how to incorporate the results of the mutation into the results of queries that are currently being watched by your application.
     */
    updateQueries?: MutationQueryReducersMap<TData>;
    /**
     * An array (or a function that _returns_ an array) that specifies which queries you want to refetch after the mutation occurs.
     * 
     * Each array value can be either:
     * 
     * - An object containing the `query` to execute, along with any `variables`
     * 
     * - A string indicating the operation name of the query to refetch
     * 
     * @docGroup
     * 
     * 1. Operation options
     */
    refetchQueries?: ((result: FetchResult<TData>) => InternalRefetchQueriesInclude) | InternalRefetchQueriesInclude;
    /**
     * If `true`, makes sure all queries included in `refetchQueries` are completed before the mutation is considered complete.
     * 
     * The default value is `false` (queries are refetched asynchronously).
     * 
     * @docGroup
     * 
     * 1. Operation options
     */
    awaitRefetchQueries?: boolean;
    /**
     * A function used to update the Apollo Client cache after the mutation completes.
     * 
     * For more information, see [Updating the cache after a mutation](https://www.apollographql.com/docs/react/data/mutations#updating-the-cache-after-a-mutation).
     * 
     * @docGroup
     * 
     * 3. Caching options
     */
    update?: MutationUpdaterFunction<TData, TVariables, TContext, TCache>;
    /**
     * Optional callback for intercepting queries whose cache data has been updated by the mutation, as well as any queries specified in the `refetchQueries: [...]` list passed to `client.mutate`.
     * 
     * Returning a `Promise` from `onQueryUpdated` will cause the final mutation `Promise` to await the returned `Promise`. Returning `false` causes the query to be ignored.
     * 
     * @docGroup
     * 
     * 1. Operation options
     */
    onQueryUpdated?: OnQueryUpdated<any>;
    /**
     * Specifies how the mutation handles a response that returns both GraphQL errors and partial results.
     * 
     * For details, see [GraphQL error policies](https://www.apollographql.com/docs/react/data/error-handling/#graphql-error-policies).
     * 
     * The default value is `none`, meaning that the mutation result includes error details but _not_ partial results.
     * 
     * @docGroup
     * 
     * 1. Operation options
     */
    errorPolicy?: ErrorPolicy;
    /**
     * An object containing all of the GraphQL variables your mutation requires to execute.
     * 
     * Each key in the object corresponds to a variable name, and that key's value corresponds to the variable value.
     * 
     * @docGroup
     * 
     * 1. Operation options
     */
    variables?: TVariables;
    /**
     * If you're using [Apollo Link](https://www.apollographql.com/docs/react/api/link/introduction/), this object is the initial value of the `context` object that's passed along your link chain.
     * 
     * @docGroup
     * 
     * 2. Networking options
     */
    context?: TContext;
}
export interface MutationOptions<TData = any, TVariables = OperationVariables, TContext = DefaultContext, TCache extends ApolloCache<any> = ApolloCache<any>> extends MutationSharedOptions<TData, TVariables, TContext, TCache> {
    /**
     * A GraphQL document, often created with `gql` from the `graphql-tag` package, that contains a single mutation inside of it.
     * 
     * @docGroup
     * 
     * 1. Operation options
     */
    mutation: DocumentNode | TypedDocumentNode<TData, TVariables>;
}
export interface MutationSharedOptions<TData = any, TVariables = OperationVariables, TContext = DefaultContext, TCache extends ApolloCache<any> = ApolloCache<any>> extends MutationBaseOptions<TData, TVariables, TContext, TCache> {
    /**
     * Provide `no-cache` if the mutation's result should _not_ be written to the Apollo Client cache.
     * 
     * The default value is `network-only` (which means the result _is_ written to the cache).
     * 
     * Unlike queries, mutations _do not_ support [fetch policies](https://www.apollographql.com/docs/react/data/queries/#setting-a-fetch-policy) besides `network-only` and `no-cache`.
     * 
     * @docGroup
     * 
     * 3. Caching options
     */
    fetchPolicy?: MutationFetchPolicy;
    /**
     * To avoid retaining sensitive information from mutation root field arguments, Apollo Client v3.4+ automatically clears any `ROOT_MUTATION` fields from the cache after each mutation finishes. If you need this information to remain in the cache, you can prevent the removal by passing `keepRootFields: true` to the mutation. `ROOT_MUTATION` result data are also passed to the mutation `update` function, so we recommend obtaining the results that way, rather than using this option, if possible.
     */
    keepRootFields?: boolean;
}
//# sourceMappingURL=watchQueryOptions.d.ts.map