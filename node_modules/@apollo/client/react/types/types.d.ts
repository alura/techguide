import type * as ReactTypes from "react";
import type { DocumentNode } from "graphql";
import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import type { Observable, ObservableSubscription } from "../../utilities/index.js";
import type { FetchResult } from "../../link/core/index.js";
import type { ApolloError } from "../../errors/index.js";
import type { ApolloCache, ApolloClient, DefaultContext, FetchPolicy, NetworkStatus, ObservableQuery, OperationVariables, InternalRefetchQueriesInclude, WatchQueryOptions, WatchQueryFetchPolicy, SubscribeToMoreOptions, ApolloQueryResult, FetchMoreQueryOptions, ErrorPolicy, RefetchWritePolicy } from "../../core/index.js";
import type { MutationSharedOptions, SharedWatchQueryOptions } from "../../core/watchQueryOptions.js";
export type { QueryReference, QueryRef, PreloadedQueryRef, } from "../internal/index.js";
export type { DefaultContext as Context } from "../../core/index.js";
export type CommonOptions<TOptions> = TOptions & {
    client?: ApolloClient<object>;
};
export interface BaseQueryOptions<TVariables extends OperationVariables = OperationVariables, TData = any> extends SharedWatchQueryOptions<TVariables, TData> {
    /**
     * Pass `false` to skip executing the query during [server-side rendering](https://www.apollographql.com/docs/react/performance/server-side-rendering/).
     * 
     * @docGroup
     * 
     * 2. Networking options
     */
    ssr?: boolean;
    /**
     * The instance of `ApolloClient` to use to execute the query.
     * 
     * By default, the instance that's passed down via context is used, but you can provide a different instance here.
     * 
     * @docGroup
     * 
     * 1. Operation options
     */
    client?: ApolloClient<any>;
    /**
     * If you're using [Apollo Link](https://www.apollographql.com/docs/react/api/link/introduction/), this object is the initial value of the `context` object that's passed along your link chain.
     * 
     * @docGroup
     * 
     * 2. Networking options
     */
    context?: DefaultContext;
}
export interface QueryFunctionOptions<TData = any, TVariables extends OperationVariables = OperationVariables> extends BaseQueryOptions<TVariables, TData> {
    /**
     * If true, the query is not executed.
     * 
     * The default value is `false`.
     * 
     * @docGroup
     * 
     * 1. Operation options
     */
    skip?: boolean;
    /**
     * A callback function that's called when your query successfully completes with zero errors (or if `errorPolicy` is `ignore` and partial data is returned).
     * 
     * This function is passed the query's result `data`.
     * 
     * @docGroup
     * 
     * 1. Operation options
     */
    onCompleted?: (data: TData) => void;
    /**
     * A callback function that's called when the query encounters one or more errors (unless `errorPolicy` is `ignore`).
     * 
     * This function is passed an `ApolloError` object that contains either a `networkError` object or a `graphQLErrors` array, depending on the error(s) that occurred.
     * 
     * @docGroup
     * 
     * 1. Operation options
     */
    onError?: (error: ApolloError) => void;
    /** @internal */
    defaultOptions?: Partial<WatchQueryOptions<TVariables, TData>>;
}
export interface ObservableQueryFields<TData, TVariables extends OperationVariables> {
    /**
     * A function that instructs the query to begin re-executing at a specified interval (in milliseconds).
     * 
     * 
     * @docGroup
     * 
     * 3. Helper functions
     */
    startPolling: (pollInterval: number) => void;
    /**
     * A function that instructs the query to stop polling after a previous call to `startPolling`.
     * 
     * 
     * @docGroup
     * 
     * 3. Helper functions
     */
    stopPolling: () => void;
    /**
     * A function that enables you to execute a [subscription](https://www.apollographql.com/docs/react/data/subscriptions/), usually to subscribe to specific fields that were included in the query.
     * 
     * This function returns _another_ function that you can call to terminate the subscription.
     * 
     * 
     * @docGroup
     * 
     * 3. Helper functions
     */
    subscribeToMore: <TSubscriptionData = TData, TSubscriptionVariables extends OperationVariables = TVariables>(options: SubscribeToMoreOptions<TData, TSubscriptionVariables, TSubscriptionData>) => () => void;
    /**
     * A function that enables you to update the query's cached result without executing a followup GraphQL operation.
     * 
     * See [using updateQuery and updateFragment](https://www.apollographql.com/docs/react/caching/cache-interaction/#using-updatequery-and-updatefragment) for additional information.
     * 
     * 
     * @docGroup
     * 
     * 3. Helper functions
     */
    updateQuery: <TVars extends OperationVariables = TVariables>(mapFn: (previousQueryResult: TData, options: Pick<WatchQueryOptions<TVars, TData>, "variables">) => TData) => void;
    /**
     * A function that enables you to re-execute the query, optionally passing in new `variables`.
     * 
     * To guarantee that the refetch performs a network request, its `fetchPolicy` is set to `network-only` (unless the original query's `fetchPolicy` is `no-cache` or `cache-and-network`, which also guarantee a network request).
     * 
     * See also [Refetching](https://www.apollographql.com/docs/react/data/queries/#refetching).
     * 
     * @docGroup
     * 
     * 3. Helper functions
     */
    refetch: (variables?: Partial<TVariables>) => Promise<ApolloQueryResult<TData>>;
    /** @internal */
    reobserve: (newOptions?: Partial<WatchQueryOptions<TVariables, TData>>, newNetworkStatus?: NetworkStatus) => Promise<ApolloQueryResult<TData>>;
    /**
     * An object containing the variables that were provided for the query.
     * 
     * @docGroup
     * 
     * 1. Operation data
     */
    variables: TVariables | undefined;
    /**
     * A function that helps you fetch the next set of results for a [paginated list field](https://www.apollographql.com/docs/react/pagination/core-api/).
     * 
     * 
     * @docGroup
     * 
     * 3. Helper functions
     */
    fetchMore: <TFetchData = TData, TFetchVars extends OperationVariables = TVariables>(fetchMoreOptions: FetchMoreQueryOptions<TFetchVars, TFetchData> & {
        updateQuery?: (previousQueryResult: TData, options: {
            fetchMoreResult: TFetchData;
            variables: TFetchVars;
        }) => TData;
    }) => Promise<ApolloQueryResult<TFetchData>>;
}
export interface QueryResult<TData = any, TVariables extends OperationVariables = OperationVariables> extends ObservableQueryFields<TData, TVariables> {
    /**
     * The instance of Apollo Client that executed the query. Can be useful for manually executing followup queries or writing data to the cache.
     * 
     * @docGroup
     * 
     * 2. Network info
     */
    client: ApolloClient<any>;
    /**
     * A reference to the internal `ObservableQuery` used by the hook.
     */
    observable: ObservableQuery<TData, TVariables>;
    /**
     * An object containing the result of your GraphQL query after it completes.
     * 
     * This value might be `undefined` if a query results in one or more errors (depending on the query's `errorPolicy`).
     * 
     * @docGroup
     * 
     * 1. Operation data
     */
    data: TData | undefined;
    /**
     * An object containing the result from the most recent _previous_ execution of this query.
     * 
     * This value is `undefined` if this is the query's first execution.
     * 
     * @docGroup
     * 
     * 1. Operation data
     */
    previousData?: TData;
    /**
     * If the query produces one or more errors, this object contains either an array of `graphQLErrors` or a single `networkError`. Otherwise, this value is `undefined`.
     * 
     * For more information, see [Handling operation errors](https://www.apollographql.com/docs/react/data/error-handling/).
     * 
     * @docGroup
     * 
     * 1. Operation data
     */
    error?: ApolloError;
    /**
     * If `true`, the query is still in flight and results have not yet been returned.
     * 
     * @docGroup
     * 
     * 2. Network info
     */
    loading: boolean;
    /**
     * A number indicating the current network state of the query's associated request. [See possible values.](https://github.com/apollographql/apollo-client/blob/d96f4578f89b933c281bb775a39503f6cdb59ee8/src/core/networkStatus.ts#L4)
     * 
     * Used in conjunction with the [`notifyOnNetworkStatusChange`](#notifyonnetworkstatuschange) option.
     * 
     * @docGroup
     * 
     * 2. Network info
     */
    networkStatus: NetworkStatus;
    /**
     * If `true`, the associated lazy query has been executed.
     * 
     * This field is only present on the result object returned by [`useLazyQuery`](/react/data/queries/#executing-queries-manually).
     * 
     * @docGroup
     * 
     * 2. Network info
     */
    called: boolean;
}
export interface QueryDataOptions<TData = any, TVariables extends OperationVariables = OperationVariables> extends QueryFunctionOptions<TData, TVariables> {
    children?: (result: QueryResult<TData, TVariables>) => ReactTypes.ReactNode;
    /**
     * A GraphQL query string parsed into an AST with the gql template literal.
     * 
     * @docGroup
     * 
     * 1. Operation options
     */
    query: DocumentNode | TypedDocumentNode<TData, TVariables>;
}
export interface QueryHookOptions<TData = any, TVariables extends OperationVariables = OperationVariables> extends QueryFunctionOptions<TData, TVariables> {
}
export interface LazyQueryHookOptions<TData = any, TVariables extends OperationVariables = OperationVariables> extends BaseQueryOptions<TVariables, TData> {
    /**
     * A callback function that's called when your query successfully completes with zero errors (or if `errorPolicy` is `ignore` and partial data is returned).
     * 
     * This function is passed the query's result `data`.
     * 
     * @docGroup
     * 
     * 1. Operation options
     */
    onCompleted?: (data: TData) => void;
    /**
     * A callback function that's called when the query encounters one or more errors (unless `errorPolicy` is `ignore`).
     * 
     * This function is passed an `ApolloError` object that contains either a `networkError` object or a `graphQLErrors` array, depending on the error(s) that occurred.
     * 
     * @docGroup
     * 
     * 1. Operation options
     */
    onError?: (error: ApolloError) => void;
    /** @internal */
    defaultOptions?: Partial<WatchQueryOptions<TVariables, TData>>;
}
export interface LazyQueryHookExecOptions<TData = any, TVariables extends OperationVariables = OperationVariables> extends LazyQueryHookOptions<TData, TVariables> {
    query?: DocumentNode | TypedDocumentNode<TData, TVariables>;
}
export type SuspenseQueryHookFetchPolicy = Extract<WatchQueryFetchPolicy, "cache-first" | "network-only" | "no-cache" | "cache-and-network">;
export interface SuspenseQueryHookOptions<TData = unknown, TVariables extends OperationVariables = OperationVariables> {
    /**
     * The instance of `ApolloClient` to use to execute the query.
     * 
     * By default, the instance that's passed down via context is used, but you can provide a different instance here.
     * 
     * @docGroup
     * 
     * 1. Operation options
     */
    client?: ApolloClient<any>;
    /**
     * If you're using [Apollo Link](https://www.apollographql.com/docs/react/api/link/introduction/), this object is the initial value of the `context` object that's passed along your link chain.
     * 
     * @docGroup
     * 
     * 2. Networking options
     */
    context?: DefaultContext;
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
     * Whether to canonize cache results before returning them. Canonization takes some extra time, but it speeds up future deep equality comparisons. Defaults to false.
     * 
     * @deprecated
     * 
     * Using `canonizeResults` can result in memory leaks so we generally do not recommend using this option anymore. A future version of Apollo Client will contain a similar feature without the risk of memory leaks.
     */
    canonizeResults?: boolean;
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
     * Watched queries must opt into overwriting existing data on refetch, by passing refetchWritePolicy: "overwrite" in their WatchQueryOptions.
     * 
     * The default value is "overwrite".
     * 
     * @docGroup
     * 
     * 3. Caching options
     */
    refetchWritePolicy?: RefetchWritePolicy;
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
    fetchPolicy?: SuspenseQueryHookFetchPolicy;
    /**
     * A unique identifier for the query. Each item in the array must be a stable identifier to prevent infinite fetches.
     * 
     * This is useful when using the same query and variables combination in more than one component, otherwise the components may clobber each other. This can also be used to force the query to re-evaluate fresh.
     * 
     * @docGroup
     * 
     * 1. Operation options
     */
    queryKey?: string | number | any[];
    /**
     * If `true`, the query is not executed. The default value is `false`.
     * 
     * @deprecated
     * 
     * We recommend using `skipToken` in place of the `skip` option as it is more type-safe.
     * 
     * This option is deprecated and only supported to ease the migration from useQuery. It will be removed in a future release.
     * 
     * @docGroup
     * 
     * 1. Operation options
     * 
     * 
     * @example Recommended usage of `skipToken`:
     * ```ts
     * import { skipToken, useSuspenseQuery } from '@apollo/client';
     * 
     * const { data } = useSuspenseQuery(query, id ? { variables: { id } } : skipToken);
     * ```
     */
    skip?: boolean;
}
export type BackgroundQueryHookFetchPolicy = Extract<WatchQueryFetchPolicy, "cache-first" | "network-only" | "no-cache" | "cache-and-network">;
export interface BackgroundQueryHookOptions<TData = unknown, TVariables extends OperationVariables = OperationVariables> extends Pick<QueryHookOptions<TData, TVariables>, "client" | "variables" | "errorPolicy" | "context" | "canonizeResults" | "returnPartialData" | "refetchWritePolicy"> {
    fetchPolicy?: BackgroundQueryHookFetchPolicy;
    queryKey?: string | number | any[];
    /**
     * If `true`, the query is not executed. The default value is `false`.
     * 
     * @deprecated
     * 
     * We recommend using `skipToken` in place of the `skip` option as it is more type-safe.
     * 
     * This option is deprecated and only supported to ease the migration from useQuery. It will be removed in a future release.
     * 
     * @docGroup
     * 
     * 1. Operation options
     * 
     * 
     * @example Recommended usage of `skipToken`:
     * ```ts
     * import { skipToken, useBackgroundQuery } from '@apollo/client';
     * 
     * const [queryRef] = useBackgroundQuery(query, id ? { variables: { id } } : skipToken);
     * ```
     */
    skip?: boolean;
}
export type LoadableQueryHookFetchPolicy = Extract<WatchQueryFetchPolicy, "cache-first" | "network-only" | "no-cache" | "cache-and-network">;
export interface LoadableQueryHookOptions {
    /**
     * Whether to canonize cache results before returning them. Canonization takes some extra time, but it speeds up future deep equality comparisons. Defaults to false.
     * 
     * @deprecated
     * 
     * Using `canonizeResults` can result in memory leaks so we generally do not recommend using this option anymore. A future version of Apollo Client will contain a similar feature without the risk of memory leaks.
     */
    canonizeResults?: boolean;
    /**
     * The instance of `ApolloClient` to use to execute the query.
     * 
     * By default, the instance that's passed down via context is used, but you can provide a different instance here.
     * 
     * @docGroup
     * 
     * 1. Operation options
     */
    client?: ApolloClient<any>;
    /**
     * If you're using [Apollo Link](https://www.apollographql.com/docs/react/api/link/introduction/), this object is the initial value of the `context` object that's passed along your link chain.
     * 
     * @docGroup
     * 
     * 2. Networking options
     */
    context?: DefaultContext;
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
    fetchPolicy?: LoadableQueryHookFetchPolicy;
    /**
     * A unique identifier for the query. Each item in the array must be a stable identifier to prevent infinite fetches.
     * 
     * This is useful when using the same query and variables combination in more than one component, otherwise the components may clobber each other. This can also be used to force the query to re-evaluate fresh.
     * 
     * @docGroup
     * 
     * 1. Operation options
     */
    queryKey?: string | number | any[];
    /**
     * Specifies whether a `NetworkStatus.refetch` operation should merge incoming field data with existing data, or overwrite the existing data. Overwriting is probably preferable, but merging is currently the default behavior, for backwards compatibility with Apollo Client 3.x.
     * 
     * @docGroup
     * 
     * 3. Caching options
     */
    refetchWritePolicy?: RefetchWritePolicy;
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
}
/**
 * @deprecated This type will be removed in the next major version of Apollo Client
 */
export interface QueryLazyOptions<TVariables> {
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
     * If you're using [Apollo Link](https://www.apollographql.com/docs/react/api/link/introduction/), this object is the initial value of the `context` object that's passed along your link chain.
     * 
     * @docGroup
     * 
     * 2. Networking options
     */
    context?: DefaultContext;
}
/**
 * @deprecated This type will be removed in the next major version of Apollo Client
 */
export type LazyQueryResult<TData, TVariables extends OperationVariables> = QueryResult<TData, TVariables>;
/**
 * @deprecated This type will be removed in the next major version of Apollo Client
 */
export type QueryTuple<TData, TVariables extends OperationVariables> = LazyQueryResultTuple<TData, TVariables>;
export type LazyQueryExecFunction<TData, TVariables extends OperationVariables> = (options?: Partial<LazyQueryHookExecOptions<TData, TVariables>>) => Promise<QueryResult<TData, TVariables>>;
export type LazyQueryResultTuple<TData, TVariables extends OperationVariables> = [
    execute: LazyQueryExecFunction<TData, TVariables>,
    result: QueryResult<TData, TVariables>
];
export type RefetchQueriesFunction = (...args: any[]) => InternalRefetchQueriesInclude;
export interface BaseMutationOptions<TData = any, TVariables = OperationVariables, TContext = DefaultContext, TCache extends ApolloCache<any> = ApolloCache<any>> extends MutationSharedOptions<TData, TVariables, TContext, TCache> {
    /**
     * The instance of `ApolloClient` to use to execute the mutation.
     * 
     * By default, the instance that's passed down via context is used, but you can provide a different instance here.
     * 
     * @docGroup
     * 
     * 2. Networking options
     */
    client?: ApolloClient<object>;
    /**
     * If `true`, the in-progress mutation's associated component re-renders whenever the network status changes or a network error occurs.
     * 
     * The default value is `false`.
     * 
     * @docGroup
     * 
     * 2. Networking options
     */
    notifyOnNetworkStatusChange?: boolean;
    /**
     * A callback function that's called when your mutation successfully completes with zero errors (or if `errorPolicy` is `ignore` and partial data is returned).
     * 
     * This function is passed the mutation's result `data` and any options passed to the mutation.
     * 
     * @docGroup
     * 
     * 1. Operation options
     */
    onCompleted?: (data: TData, clientOptions?: BaseMutationOptions) => void;
    /**
     * A callback function that's called when the mutation encounters one or more errors (unless `errorPolicy` is `ignore`).
     * 
     * This function is passed an [`ApolloError`](https://github.com/apollographql/apollo-client/blob/d96f4578f89b933c281bb775a39503f6cdb59ee8/src/errors/index.ts#L36-L39) object that contains either a `networkError` object or a `graphQLErrors` array, depending on the error(s) that occurred, as well as any options passed the mutation.
     * 
     * @docGroup
     * 
     * 1. Operation options
     */
    onError?: (error: ApolloError, clientOptions?: BaseMutationOptions) => void;
    /**
     * If `true`, the mutation's `data` property is not updated with the mutation's result.
     * 
     * The default value is `false`.
     * 
     * @docGroup
     * 
     * 1. Operation options
     */
    ignoreResults?: boolean;
}
export interface MutationFunctionOptions<TData = any, TVariables = OperationVariables, TContext = DefaultContext, TCache extends ApolloCache<any> = ApolloCache<any>> extends BaseMutationOptions<TData, TVariables, TContext, TCache> {
    /**
     * A GraphQL document, often created with `gql` from the `graphql-tag` package, that contains a single mutation inside of it.
     * 
     * @docGroup
     * 
     * 1. Operation options
     */
    mutation?: DocumentNode | TypedDocumentNode<TData, TVariables>;
}
export interface MutationResult<TData = any> {
    /**
     * The data returned from your mutation. Can be `undefined` if `ignoreResults` is `true`.
     */
    data?: TData | null;
    /**
     * If the mutation produces one or more errors, this object contains either an array of `graphQLErrors` or a single `networkError`. Otherwise, this value is `undefined`.
     * 
     * For more information, see [Handling operation errors](https://www.apollographql.com/docs/react/data/error-handling/).
     */
    error?: ApolloError;
    /**
     * If `true`, the mutation is currently in flight.
     */
    loading: boolean;
    /**
     * If `true`, the mutation's mutate function has been called.
     */
    called: boolean;
    /**
     * The instance of Apollo Client that executed the mutation.
     * 
     * Can be useful for manually executing followup operations or writing data to the cache.
     */
    client: ApolloClient<object>;
    /**
     * A function that you can call to reset the mutation's result to its initial, uncalled state.
     */
    reset(): void;
}
export declare type MutationFunction<TData = any, TVariables = OperationVariables, TContext = DefaultContext, TCache extends ApolloCache<any> = ApolloCache<any>> = (options?: MutationFunctionOptions<TData, TVariables, TContext, TCache>) => Promise<FetchResult<TData>>;
export interface MutationHookOptions<TData = any, TVariables = OperationVariables, TContext = DefaultContext, TCache extends ApolloCache<any> = ApolloCache<any>> extends BaseMutationOptions<TData, TVariables, TContext, TCache> {
}
export interface MutationDataOptions<TData = any, TVariables = OperationVariables, TContext = DefaultContext, TCache extends ApolloCache<any> = ApolloCache<any>> extends BaseMutationOptions<TData, TVariables, TContext, TCache> {
    mutation: DocumentNode | TypedDocumentNode<TData, TVariables>;
}
export type MutationTuple<TData, TVariables, TContext = DefaultContext, TCache extends ApolloCache<any> = ApolloCache<any>> = [
    mutate: (options?: MutationFunctionOptions<TData, TVariables, TContext, TCache>) => Promise<FetchResult<TData>>,
    result: MutationResult<TData>
];
export interface OnDataOptions<TData = any> {
    client: ApolloClient<object>;
    data: SubscriptionResult<TData>;
}
export interface OnSubscriptionDataOptions<TData = any> {
    client: ApolloClient<object>;
    subscriptionData: SubscriptionResult<TData>;
}
export interface BaseSubscriptionOptions<TData = any, TVariables extends OperationVariables = OperationVariables> {
    /**
     * An object containing all of the variables your subscription needs to execute
     */
    variables?: TVariables;
    /**
     * How you want your component to interact with the Apollo cache. For details, see [Setting a fetch policy](https://www.apollographql.com/docs/react/data/queries/#setting-a-fetch-policy).
     */
    fetchPolicy?: FetchPolicy;
    /**
     * Determines if your subscription should be unsubscribed and subscribed again when an input to the hook (such as `subscription` or `variables`) changes.
     */
    shouldResubscribe?: boolean | ((options: BaseSubscriptionOptions<TData, TVariables>) => boolean);
    /**
     * An `ApolloClient` instance. By default `useSubscription` / `Subscription` uses the client passed down via context, but a different client can be passed in.
     */
    client?: ApolloClient<object>;
    /**
     * Determines if the current subscription should be skipped. Useful if, for example, variables depend on previous queries and are not ready yet.
     */
    skip?: boolean;
    /**
     * Shared context between your component and your network interface (Apollo Link).
     */
    context?: DefaultContext;
    /**
     * Allows the registration of a callback function that will be triggered each time the `useSubscription` Hook / `Subscription` component completes the subscription.
     * 
     * @since
     * 
     * 3.7.0
     */
    onComplete?: () => void;
    /**
     * Allows the registration of a callback function that will be triggered each time the `useSubscription` Hook / `Subscription` component receives data. The callback `options` object param consists of the current Apollo Client instance in `client`, and the received subscription data in `data`.
     * 
     * @since
     * 
     * 3.7.0
     */
    onData?: (options: OnDataOptions<TData>) => any;
    /**
     * Allows the registration of a callback function that will be triggered each time the `useSubscription` Hook / `Subscription` component receives data. The callback `options` object param consists of the current Apollo Client instance in `client`, and the received subscription data in `subscriptionData`.
     * 
     * @deprecated
     * 
     * Use `onData` instead
     */
    onSubscriptionData?: (options: OnSubscriptionDataOptions<TData>) => any;
    /**
     * Allows the registration of a callback function that will be triggered each time the `useSubscription` Hook / `Subscription` component receives an error.
     * 
     * @since
     * 
     * 3.7.0
     */
    onError?: (error: ApolloError) => void;
    /**
     * Allows the registration of a callback function that will be triggered when the `useSubscription` Hook / `Subscription` component completes the subscription.
     * 
     * @deprecated
     * 
     * Use `onComplete` instead
     */
    onSubscriptionComplete?: () => void;
}
export interface SubscriptionResult<TData = any, TVariables = any> {
    /**
     * A boolean that indicates whether any initial data has been returned
     */
    loading: boolean;
    /**
     * An object containing the result of your GraphQL subscription. Defaults to an empty object.
     */
    data?: TData;
    /**
     * A runtime error with `graphQLErrors` and `networkError` properties
     */
    error?: ApolloError;
    /**
     * @internal
     */
    variables?: TVariables;
}
export interface SubscriptionHookOptions<TData = any, TVariables extends OperationVariables = OperationVariables> extends BaseSubscriptionOptions<TData, TVariables> {
}
export interface SubscriptionDataOptions<TData = any, TVariables extends OperationVariables = OperationVariables> extends BaseSubscriptionOptions<TData, TVariables> {
    subscription: DocumentNode | TypedDocumentNode<TData, TVariables>;
    children?: null | ((result: SubscriptionResult<TData>) => ReactTypes.ReactNode);
}
export interface SubscriptionCurrentObservable {
    query?: Observable<any>;
    subscription?: ObservableSubscription;
}
/**
Helper type that allows using a type in a way that cannot be "widened" by inference on the value it is used on.

This type was first suggested [in this Github discussion](https://github.com/microsoft/TypeScript/issues/14829#issuecomment-504042546).

Example usage:
```ts
export function useQuery<
  TData = any,
  TVariables extends OperationVariables = OperationVariables,
>(
  query: DocumentNode | TypedDocumentNode<TData, TVariables>,
  options: QueryHookOptions<NoInfer<TData>, NoInfer<TVariables>> = Object.create(null),
)
```
In this case, `TData` and `TVariables` should be inferred from `query`, but never widened from something in `options`.

So, in this code example:
```ts
declare const typedNode: TypedDocumentNode<{ foo: string}, { bar: number }>
const { variables } = useQuery(typedNode, { variables: { bar: 4, nonExistingVariable: "string" } });
```
Without the use of `NoInfer`, `variables` would now be of the type `{ bar: number, nonExistingVariable: "string" }`.
With `NoInfer`, it will instead give an error on `nonExistingVariable`.
 */
export type NoInfer<T> = [T][T extends any ? 0 : never];
//# sourceMappingURL=types.d.ts.map