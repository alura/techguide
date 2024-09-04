import type { ExecutionResult, DocumentNode } from "graphql";
import type { FetchResult, GraphQLRequest } from "../link/core/index.js";
import { ApolloLink } from "../link/core/index.js";
import type { ApolloCache, DataProxy, Reference } from "../cache/index.js";
import type { DocumentTransform, Observable } from "../utilities/index.js";
import type { UriFunction } from "../link/http/index.js";
import type { ObservableQuery } from "./ObservableQuery.js";
import type { ApolloQueryResult, DefaultContext, OperationVariables, Resolvers, RefetchQueriesOptions, RefetchQueriesResult, RefetchQueriesInclude } from "./types.js";
import type { QueryOptions, WatchQueryOptions, MutationOptions, SubscriptionOptions } from "./watchQueryOptions.js";
import type { FragmentMatcher } from "./LocalState.js";
export interface DefaultOptions {
    watchQuery?: Partial<WatchQueryOptions<any, any>>;
    query?: Partial<QueryOptions<any, any>>;
    mutate?: Partial<MutationOptions<any, any, any>>;
}
export interface ApolloClientOptions<TCacheShape> {
    /**
     * The URI of the GraphQL endpoint that Apollo Client will communicate with.
     *
     * One of `uri` or `link` is **required**. If you provide both, `link` takes precedence.
     */
    uri?: string | UriFunction;
    credentials?: string;
    /**
     * An object representing headers to include in every HTTP request, such as `{Authorization: 'Bearer 1234'}`
     *
     * This value will be ignored when using the `link` option.
     */
    headers?: Record<string, string>;
    /**
     * You can provide an `ApolloLink` instance to serve as Apollo Client's network layer. For more information, see [Advanced HTTP networking](https://www.apollographql.com/docs/react/networking/advanced-http-networking/).
     *
     * One of `uri` or `link` is **required**. If you provide both, `link` takes precedence.
     */
    link?: ApolloLink;
    /**
     * The cache that Apollo Client should use to store query results locally. The recommended cache is `InMemoryCache`, which is provided by the `@apollo/client` package.
     *
     * For more information, see [Configuring the cache](https://www.apollographql.com/docs/react/caching/cache-configuration/).
     */
    cache: ApolloCache<TCacheShape>;
    /**
     * The time interval (in milliseconds) before Apollo Client force-fetches queries after a server-side render.
     *
     * @defaultValue `0` (no delay)
     */
    ssrForceFetchDelay?: number;
    /**
     * When using Apollo Client for [server-side rendering](https://www.apollographql.com/docs/react/performance/server-side-rendering/), set this to `true` so that the [`getDataFromTree` function](../react/ssr/#getdatafromtree) can work effectively.
     *
     * @defaultValue `false`
     */
    ssrMode?: boolean;
    /**
     * If `true`, the [Apollo Client Devtools](https://www.apollographql.com/docs/react/development-testing/developer-tooling/#apollo-client-devtools) browser extension can connect to Apollo Client.
     *
     * The default value is `false` in production and `true` in development (if there is a `window` object).
     */
    connectToDevTools?: boolean;
    /**
     * If `false`, Apollo Client sends every created query to the server, even if a _completely_ identical query (identical in terms of query string, variable values, and operationName) is already in flight.
     *
     * @defaultValue `true`
     */
    queryDeduplication?: boolean;
    /**
     * Provide this object to set application-wide default values for options you can provide to the `watchQuery`, `query`, and `mutate` functions. See below for an example object.
     *
     * See this [example object](https://www.apollographql.com/docs/react/api/core/ApolloClient#example-defaultoptions-object).
     */
    defaultOptions?: DefaultOptions;
    defaultContext?: Partial<DefaultContext>;
    /**
     * If `true`, Apollo Client will assume results read from the cache are never mutated by application code, which enables substantial performance optimizations.
     *
     * @defaultValue `false`
     */
    assumeImmutableResults?: boolean;
    resolvers?: Resolvers | Resolvers[];
    typeDefs?: string | string[] | DocumentNode | DocumentNode[];
    fragmentMatcher?: FragmentMatcher;
    /**
     * A custom name (e.g., `iOS`) that identifies this particular client among your set of clients. Apollo Server and Apollo Studio use this property as part of the [client awareness](https://www.apollographql.com/docs/apollo-server/monitoring/metrics#identifying-distinct-clients) feature.
     */
    name?: string;
    /**
     * A custom version that identifies the current version of this particular client (e.g., `1.2`). Apollo Server and Apollo Studio use this property as part of the [client awareness](https://www.apollographql.com/docs/apollo-server/monitoring/metrics#identifying-distinct-clients) feature.
     *
     * This is **not** the version of Apollo Client that you are using, but rather any version string that helps you differentiate between versions of your client.
     */
    version?: string;
    documentTransform?: DocumentTransform;
}
import { mergeOptions } from "../utilities/index.js";
import { getApolloClientMemoryInternals } from "../utilities/caching/getMemoryInternals.js";
import type { WatchFragmentOptions, WatchFragmentResult } from "../cache/core/cache.js";
export { mergeOptions };
/**
 * This is the primary Apollo Client class. It is used to send GraphQL documents (i.e. queries
 * and mutations) to a GraphQL spec-compliant server over an `ApolloLink` instance,
 * receive results from the server and cache the results in a store. It also delivers updates
 * to GraphQL queries through `Observable` instances.
 */
export declare class ApolloClient<TCacheShape> implements DataProxy {
    link: ApolloLink;
    cache: ApolloCache<TCacheShape>;
    disableNetworkFetches: boolean;
    version: string;
    queryDeduplication: boolean;
    defaultOptions: DefaultOptions;
    readonly typeDefs: ApolloClientOptions<TCacheShape>["typeDefs"];
    private queryManager;
    private devToolsHookCb?;
    private resetStoreCallbacks;
    private clearStoreCallbacks;
    private localState;
    /**
     * Constructs an instance of `ApolloClient`.
     *
     * @example
     * ```js
     * import { ApolloClient, InMemoryCache } from '@apollo/client';
     *
     * const cache = new InMemoryCache();
     *
     * const client = new ApolloClient({
     *   // Provide required constructor fields
     *   cache: cache,
     *   uri: 'http://localhost:4000/',
     *
     *   // Provide some optional constructor fields
     *   name: 'react-web-client',
     *   version: '1.3',
     *   queryDeduplication: false,
     *   defaultOptions: {
     *     watchQuery: {
     *       fetchPolicy: 'cache-and-network',
     *     },
     *   },
     * });
     * ```
     */
    constructor(options: ApolloClientOptions<TCacheShape>);
    private connectToDevTools;
    /**
     * The `DocumentTransform` used to modify GraphQL documents before a request
     * is made. If a custom `DocumentTransform` is not provided, this will be the
     * default document transform.
     */
    get documentTransform(): DocumentTransform;
    /**
     * Call this method to terminate any active client processes, making it safe
     * to dispose of this `ApolloClient` instance.
     */
    stop(): void;
    /**
     * This watches the cache store of the query according to the options specified and
     * returns an `ObservableQuery`. We can subscribe to this `ObservableQuery` and
     * receive updated results through an observer when the cache store changes.
     *
     * Note that this method is not an implementation of GraphQL subscriptions. Rather,
     * it uses Apollo's store in order to reactively deliver updates to your query results.
     *
     * For example, suppose you call watchQuery on a GraphQL query that fetches a person's
     * first and last name and this person has a particular object identifier, provided by
     * dataIdFromObject. Later, a different query fetches that same person's
     * first and last name and the first name has now changed. Then, any observers associated
     * with the results of the first query will be updated with a new result object.
     *
     * Note that if the cache does not change, the subscriber will *not* be notified.
     *
     * See [here](https://medium.com/apollo-stack/the-concepts-of-graphql-bc68bd819be3#.3mb0cbcmc) for
     * a description of store reactivity.
     */
    watchQuery<T = any, TVariables extends OperationVariables = OperationVariables>(options: WatchQueryOptions<TVariables, T>): ObservableQuery<T, TVariables>;
    /**
     * This resolves a single query according to the options specified and
     * returns a `Promise` which is either resolved with the resulting data
     * or rejected with an error.
     *
     * @param options - An object of type `QueryOptions` that allows us to
     * describe how this query should be treated e.g. whether it should hit the
     * server at all or just resolve from the cache, etc.
     */
    query<T = any, TVariables extends OperationVariables = OperationVariables>(options: QueryOptions<TVariables, T>): Promise<ApolloQueryResult<T>>;
    /**
     * This resolves a single mutation according to the options specified and returns a
     * Promise which is either resolved with the resulting data or rejected with an
     * error. In some cases both `data` and `errors` might be undefined, for example
     * when `errorPolicy` is set to `'ignore'`.
     *
     * It takes options as an object with the following keys and values:
     */
    mutate<TData = any, TVariables extends OperationVariables = OperationVariables, TContext extends Record<string, any> = DefaultContext, TCache extends ApolloCache<any> = ApolloCache<any>>(options: MutationOptions<TData, TVariables, TContext>): Promise<FetchResult<TData>>;
    /**
     * This subscribes to a graphql subscription according to the options specified and returns an
     * `Observable` which either emits received data or an error.
     */
    subscribe<T = any, TVariables extends OperationVariables = OperationVariables>(options: SubscriptionOptions<TVariables, T>): Observable<FetchResult<T>>;
    /**
     * Tries to read some data from the store in the shape of the provided
     * GraphQL query without making a network request. This method will start at
     * the root query. To start at a specific id returned by `dataIdFromObject`
     * use `readFragment`.
     *
     * @param optimistic - Set to `true` to allow `readQuery` to return
     * optimistic results. Is `false` by default.
     */
    readQuery<T = any, TVariables = OperationVariables>(options: DataProxy.Query<TVariables, T>, optimistic?: boolean): T | null;
    /**
     * Watches the cache store of the fragment according to the options specified
     * and returns an `Observable`. We can subscribe to this
     * `Observable` and receive updated results through an
     * observer when the cache store changes.
     *
     * You must pass in a GraphQL document with a single fragment or a document
     * with multiple fragments that represent what you are reading. If you pass
     * in a document with multiple fragments then you must also specify a
     * `fragmentName`.
     *
     * @since 3.10.0
     * @param options - An object of type `WatchFragmentOptions` that allows
     * the cache to identify the fragment and optionally specify whether to react
     * to optimistic updates.
     */
    watchFragment<TFragmentData = unknown, TVariables = OperationVariables>(options: WatchFragmentOptions<TFragmentData, TVariables>): Observable<WatchFragmentResult<TFragmentData>>;
    /**
     * Tries to read some data from the store in the shape of the provided
     * GraphQL fragment without making a network request. This method will read a
     * GraphQL fragment from any arbitrary id that is currently cached, unlike
     * `readQuery` which will only read from the root query.
     *
     * You must pass in a GraphQL document with a single fragment or a document
     * with multiple fragments that represent what you are reading. If you pass
     * in a document with multiple fragments then you must also specify a
     * `fragmentName`.
     *
     * @param optimistic - Set to `true` to allow `readFragment` to return
     * optimistic results. Is `false` by default.
     */
    readFragment<T = any, TVariables = OperationVariables>(options: DataProxy.Fragment<TVariables, T>, optimistic?: boolean): T | null;
    /**
     * Writes some data in the shape of the provided GraphQL query directly to
     * the store. This method will start at the root query. To start at a
     * specific id returned by `dataIdFromObject` then use `writeFragment`.
     */
    writeQuery<TData = any, TVariables = OperationVariables>(options: DataProxy.WriteQueryOptions<TData, TVariables>): Reference | undefined;
    /**
     * Writes some data in the shape of the provided GraphQL fragment directly to
     * the store. This method will write to a GraphQL fragment from any arbitrary
     * id that is currently cached, unlike `writeQuery` which will only write
     * from the root query.
     *
     * You must pass in a GraphQL document with a single fragment or a document
     * with multiple fragments that represent what you are writing. If you pass
     * in a document with multiple fragments then you must also specify a
     * `fragmentName`.
     */
    writeFragment<TData = any, TVariables = OperationVariables>(options: DataProxy.WriteFragmentOptions<TData, TVariables>): Reference | undefined;
    __actionHookForDevTools(cb: () => any): void;
    __requestRaw(payload: GraphQLRequest): Observable<ExecutionResult>;
    /**
     * Resets your entire store by clearing out your cache and then re-executing
     * all of your active queries. This makes it so that you may guarantee that
     * there is no data left in your store from a time before you called this
     * method.
     *
     * `resetStore()` is useful when your user just logged out. You’ve removed the
     * user session, and you now want to make sure that any references to data you
     * might have fetched while the user session was active is gone.
     *
     * It is important to remember that `resetStore()` *will* refetch any active
     * queries. This means that any components that might be mounted will execute
     * their queries again using your network interface. If you do not want to
     * re-execute any queries then you should make sure to stop watching any
     * active queries.
     */
    resetStore(): Promise<ApolloQueryResult<any>[] | null>;
    /**
     * Remove all data from the store. Unlike `resetStore`, `clearStore` will
     * not refetch any active queries.
     */
    clearStore(): Promise<any[]>;
    /**
     * Allows callbacks to be registered that are executed when the store is
     * reset. `onResetStore` returns an unsubscribe function that can be used
     * to remove registered callbacks.
     */
    onResetStore(cb: () => Promise<any>): () => void;
    /**
     * Allows callbacks to be registered that are executed when the store is
     * cleared. `onClearStore` returns an unsubscribe function that can be used
     * to remove registered callbacks.
     */
    onClearStore(cb: () => Promise<any>): () => void;
    /**
     * Refetches all of your active queries.
     *
     * `reFetchObservableQueries()` is useful if you want to bring the client back to proper state in case of a network outage
     *
     * It is important to remember that `reFetchObservableQueries()` *will* refetch any active
     * queries. This means that any components that might be mounted will execute
     * their queries again using your network interface. If you do not want to
     * re-execute any queries then you should make sure to stop watching any
     * active queries.
     * Takes optional parameter `includeStandby` which will include queries in standby-mode when refetching.
     */
    reFetchObservableQueries(includeStandby?: boolean): Promise<ApolloQueryResult<any>[]>;
    /**
     * Refetches specified active queries. Similar to "reFetchObservableQueries()" but with a specific list of queries.
     *
     * `refetchQueries()` is useful for use cases to imperatively refresh a selection of queries.
     *
     * It is important to remember that `refetchQueries()` *will* refetch specified active
     * queries. This means that any components that might be mounted will execute
     * their queries again using your network interface. If you do not want to
     * re-execute any queries then you should make sure to stop watching any
     * active queries.
     */
    refetchQueries<TCache extends ApolloCache<any> = ApolloCache<TCacheShape>, TResult = Promise<ApolloQueryResult<any>>>(options: RefetchQueriesOptions<TCache, TResult>): RefetchQueriesResult<TResult>;
    /**
     * Get all currently active `ObservableQuery` objects, in a `Map` keyed by
     * query ID strings.
     *
     * An "active" query is one that has observers and a `fetchPolicy` other than
     * "standby" or "cache-only".
     *
     * You can include all `ObservableQuery` objects (including the inactive ones)
     * by passing "all" instead of "active", or you can include just a subset of
     * active queries by passing an array of query names or DocumentNode objects.
     */
    getObservableQueries(include?: RefetchQueriesInclude): Map<string, ObservableQuery<any>>;
    /**
     * Exposes the cache's complete state, in a serializable format for later restoration.
     */
    extract(optimistic?: boolean): TCacheShape;
    /**
     * Replaces existing state in the cache (if any) with the values expressed by
     * `serializedState`.
     *
     * Called when hydrating a cache (server side rendering, or offline storage),
     * and also (potentially) during hot reloads.
     */
    restore(serializedState: TCacheShape): ApolloCache<TCacheShape>;
    /**
     * Add additional local resolvers.
     */
    addResolvers(resolvers: Resolvers | Resolvers[]): void;
    /**
     * Set (override existing) local resolvers.
     */
    setResolvers(resolvers: Resolvers | Resolvers[]): void;
    /**
     * Get all registered local resolvers.
     */
    getResolvers(): Resolvers;
    /**
     * Set a custom local state fragment matcher.
     */
    setLocalStateFragmentMatcher(fragmentMatcher: FragmentMatcher): void;
    /**
     * Define a new ApolloLink (or link chain) that Apollo Client will use.
     */
    setLink(newLink: ApolloLink): void;
    get defaultContext(): Partial<DefaultContext>;
    /**
     * @experimental
     * This is not a stable API - it is used in development builds to expose
     * information to the DevTools.
     * Use at your own risk!
     * For more details, see [Memory Management](https://www.apollographql.com/docs/react/caching/memory-management/#measuring-cache-usage)
     *
     * @example
     * ```ts
     * console.log(client.getMemoryInternals())
     * ```
     * Logs output in the following JSON format:
     * @example
     * ```json
     *{
     *  limits:     {
     *    parser: 1000,
     *    canonicalStringify: 1000,
     *    print: 2000,
     *    'documentTransform.cache': 2000,
     *    'queryManager.getDocumentInfo': 2000,
     *    'PersistedQueryLink.persistedQueryHashes': 2000,
     *    'fragmentRegistry.transform': 2000,
     *    'fragmentRegistry.lookup': 1000,
     *    'fragmentRegistry.findFragmentSpreads': 4000,
     *    'cache.fragmentQueryDocuments': 1000,
     *    'removeTypenameFromVariables.getVariableDefinitions': 2000,
     *    'inMemoryCache.maybeBroadcastWatch': 5000,
     *    'inMemoryCache.executeSelectionSet': 10000,
     *    'inMemoryCache.executeSubSelectedArray': 5000
     *  },
     *  sizes: {
     *    parser: 26,
     *    canonicalStringify: 4,
     *    print: 14,
     *    addTypenameDocumentTransform: [
     *      {
     *        cache: 14,
     *      },
     *    ],
     *    queryManager: {
     *      getDocumentInfo: 14,
     *      documentTransforms: [
     *        {
     *          cache: 14,
     *        },
     *        {
     *          cache: 14,
     *        },
     *      ],
     *    },
     *    fragmentRegistry: {
     *      findFragmentSpreads: 34,
     *      lookup: 20,
     *      transform: 14,
     *    },
     *    cache: {
     *      fragmentQueryDocuments: 22,
     *    },
     *    inMemoryCache: {
     *      executeSelectionSet: 4345,
     *      executeSubSelectedArray: 1206,
     *      maybeBroadcastWatch: 32,
     *    },
     *    links: [
     *      {
     *        PersistedQueryLink: {
     *          persistedQueryHashes: 14,
     *        },
     *      },
     *      {
     *        removeTypenameFromVariables: {
     *          getVariableDefinitions: 14,
     *        },
     *      },
     *    ],
     *  },
     * }
     *```
     */
    getMemoryInternals?: typeof getApolloClientMemoryInternals;
}
//# sourceMappingURL=ApolloClient.d.ts.map