import { __assign } from "tslib";
import { invariant, newInvariantError } from "../utilities/globals/index.js";
import { ApolloLink, execute } from "../link/core/index.js";
import { version } from "../version.js";
import { HttpLink } from "../link/http/index.js";
import { QueryManager } from "./QueryManager.js";
import { LocalState } from "./LocalState.js";
var hasSuggestedDevtools = false;
// Though mergeOptions now resides in @apollo/client/utilities, it was
// previously declared and exported from this module, and then reexported from
// @apollo/client/core. Since we need to preserve that API anyway, the easiest
// solution is to reexport mergeOptions where it was previously declared (here).
import { mergeOptions } from "../utilities/index.js";
import { getApolloClientMemoryInternals } from "../utilities/caching/getMemoryInternals.js";
export { mergeOptions };
/**
 * This is the primary Apollo Client class. It is used to send GraphQL documents (i.e. queries
 * and mutations) to a GraphQL spec-compliant server over an `ApolloLink` instance,
 * receive results from the server and cache the results in a store. It also delivers updates
 * to GraphQL queries through `Observable` instances.
 */
var ApolloClient = /** @class */ (function () {
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
    function ApolloClient(options) {
        var _this = this;
        this.resetStoreCallbacks = [];
        this.clearStoreCallbacks = [];
        if (!options.cache) {
            throw newInvariantError(15);
        }
        var uri = options.uri, credentials = options.credentials, headers = options.headers, cache = options.cache, documentTransform = options.documentTransform, _a = options.ssrMode, ssrMode = _a === void 0 ? false : _a, _b = options.ssrForceFetchDelay, ssrForceFetchDelay = _b === void 0 ? 0 : _b, 
        // Expose the client instance as window.__APOLLO_CLIENT__ and call
        // onBroadcast in queryManager.broadcastQueries to enable browser
        // devtools, but disable them by default in production.
        _c = options.connectToDevTools, 
        // Expose the client instance as window.__APOLLO_CLIENT__ and call
        // onBroadcast in queryManager.broadcastQueries to enable browser
        // devtools, but disable them by default in production.
        connectToDevTools = _c === void 0 ? typeof window === "object" &&
            !window.__APOLLO_CLIENT__ &&
            globalThis.__DEV__ !== false : _c, _d = options.queryDeduplication, queryDeduplication = _d === void 0 ? true : _d, defaultOptions = options.defaultOptions, defaultContext = options.defaultContext, _e = options.assumeImmutableResults, assumeImmutableResults = _e === void 0 ? cache.assumeImmutableResults : _e, resolvers = options.resolvers, typeDefs = options.typeDefs, fragmentMatcher = options.fragmentMatcher, clientAwarenessName = options.name, clientAwarenessVersion = options.version;
        var link = options.link;
        if (!link) {
            link =
                uri ? new HttpLink({ uri: uri, credentials: credentials, headers: headers }) : ApolloLink.empty();
        }
        this.link = link;
        this.cache = cache;
        this.disableNetworkFetches = ssrMode || ssrForceFetchDelay > 0;
        this.queryDeduplication = queryDeduplication;
        this.defaultOptions = defaultOptions || Object.create(null);
        this.typeDefs = typeDefs;
        if (ssrForceFetchDelay) {
            setTimeout(function () { return (_this.disableNetworkFetches = false); }, ssrForceFetchDelay);
        }
        this.watchQuery = this.watchQuery.bind(this);
        this.query = this.query.bind(this);
        this.mutate = this.mutate.bind(this);
        this.watchFragment = this.watchFragment.bind(this);
        this.resetStore = this.resetStore.bind(this);
        this.reFetchObservableQueries = this.reFetchObservableQueries.bind(this);
        this.version = version;
        this.localState = new LocalState({
            cache: cache,
            client: this,
            resolvers: resolvers,
            fragmentMatcher: fragmentMatcher,
        });
        this.queryManager = new QueryManager({
            cache: this.cache,
            link: this.link,
            defaultOptions: this.defaultOptions,
            defaultContext: defaultContext,
            documentTransform: documentTransform,
            queryDeduplication: queryDeduplication,
            ssrMode: ssrMode,
            clientAwareness: {
                name: clientAwarenessName,
                version: clientAwarenessVersion,
            },
            localState: this.localState,
            assumeImmutableResults: assumeImmutableResults,
            onBroadcast: connectToDevTools ?
                function () {
                    if (_this.devToolsHookCb) {
                        _this.devToolsHookCb({
                            action: {},
                            state: {
                                queries: _this.queryManager.getQueryStore(),
                                mutations: _this.queryManager.mutationStore || {},
                            },
                            dataWithOptimisticResults: _this.cache.extract(true),
                        });
                    }
                }
                : void 0,
        });
        if (connectToDevTools)
            this.connectToDevTools();
    }
    ApolloClient.prototype.connectToDevTools = function () {
        if (typeof window === "object") {
            var windowWithDevTools = window;
            var devtoolsSymbol = Symbol.for("apollo.devtools");
            (windowWithDevTools[devtoolsSymbol] =
                windowWithDevTools[devtoolsSymbol] || []).push(this);
            windowWithDevTools.__APOLLO_CLIENT__ = this;
        }
        /**
         * Suggest installing the devtools for developers who don't have them
         */
        if (!hasSuggestedDevtools && globalThis.__DEV__ !== false) {
            hasSuggestedDevtools = true;
            setTimeout(function () {
                if (typeof window !== "undefined" &&
                    window.document &&
                    window.top === window.self &&
                    !window.__APOLLO_DEVTOOLS_GLOBAL_HOOK__ &&
                    /^(https?|file):$/.test(window.location.protocol)) {
                    var nav = window.navigator;
                    var ua = nav && nav.userAgent;
                    var url = void 0;
                    if (typeof ua === "string") {
                        if (ua.indexOf("Chrome/") > -1) {
                            url =
                                "https://chrome.google.com/webstore/detail/" +
                                    "apollo-client-developer-t/jdkknkkbebbapilgoeccciglkfbmbnfm";
                        }
                        else if (ua.indexOf("Firefox/") > -1) {
                            url =
                                "https://addons.mozilla.org/en-US/firefox/addon/apollo-developer-tools/";
                        }
                    }
                    if (url) {
                        globalThis.__DEV__ !== false && invariant.log("Download the Apollo DevTools for a better development " +
                            "experience: %s", url);
                    }
                }
            }, 10000);
        }
    };
    Object.defineProperty(ApolloClient.prototype, "documentTransform", {
        /**
         * The `DocumentTransform` used to modify GraphQL documents before a request
         * is made. If a custom `DocumentTransform` is not provided, this will be the
         * default document transform.
         */
        get: function () {
            return this.queryManager.documentTransform;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Call this method to terminate any active client processes, making it safe
     * to dispose of this `ApolloClient` instance.
     */
    ApolloClient.prototype.stop = function () {
        this.queryManager.stop();
    };
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
    ApolloClient.prototype.watchQuery = function (options) {
        if (this.defaultOptions.watchQuery) {
            options = mergeOptions(this.defaultOptions.watchQuery, options);
        }
        // XXX Overwriting options is probably not the best way to do this long term...
        if (this.disableNetworkFetches &&
            (options.fetchPolicy === "network-only" ||
                options.fetchPolicy === "cache-and-network")) {
            options = __assign(__assign({}, options), { fetchPolicy: "cache-first" });
        }
        return this.queryManager.watchQuery(options);
    };
    /**
     * This resolves a single query according to the options specified and
     * returns a `Promise` which is either resolved with the resulting data
     * or rejected with an error.
     *
     * @param options - An object of type `QueryOptions` that allows us to
     * describe how this query should be treated e.g. whether it should hit the
     * server at all or just resolve from the cache, etc.
     */
    ApolloClient.prototype.query = function (options) {
        if (this.defaultOptions.query) {
            options = mergeOptions(this.defaultOptions.query, options);
        }
        invariant(options.fetchPolicy !== "cache-and-network", 16);
        if (this.disableNetworkFetches && options.fetchPolicy === "network-only") {
            options = __assign(__assign({}, options), { fetchPolicy: "cache-first" });
        }
        return this.queryManager.query(options);
    };
    /**
     * This resolves a single mutation according to the options specified and returns a
     * Promise which is either resolved with the resulting data or rejected with an
     * error. In some cases both `data` and `errors` might be undefined, for example
     * when `errorPolicy` is set to `'ignore'`.
     *
     * It takes options as an object with the following keys and values:
     */
    ApolloClient.prototype.mutate = function (options) {
        if (this.defaultOptions.mutate) {
            options = mergeOptions(this.defaultOptions.mutate, options);
        }
        return this.queryManager.mutate(options);
    };
    /**
     * This subscribes to a graphql subscription according to the options specified and returns an
     * `Observable` which either emits received data or an error.
     */
    ApolloClient.prototype.subscribe = function (options) {
        return this.queryManager.startGraphQLSubscription(options);
    };
    /**
     * Tries to read some data from the store in the shape of the provided
     * GraphQL query without making a network request. This method will start at
     * the root query. To start at a specific id returned by `dataIdFromObject`
     * use `readFragment`.
     *
     * @param optimistic - Set to `true` to allow `readQuery` to return
     * optimistic results. Is `false` by default.
     */
    ApolloClient.prototype.readQuery = function (options, optimistic) {
        if (optimistic === void 0) { optimistic = false; }
        return this.cache.readQuery(options, optimistic);
    };
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
    ApolloClient.prototype.watchFragment = function (options) {
        return this.cache.watchFragment(options);
    };
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
    ApolloClient.prototype.readFragment = function (options, optimistic) {
        if (optimistic === void 0) { optimistic = false; }
        return this.cache.readFragment(options, optimistic);
    };
    /**
     * Writes some data in the shape of the provided GraphQL query directly to
     * the store. This method will start at the root query. To start at a
     * specific id returned by `dataIdFromObject` then use `writeFragment`.
     */
    ApolloClient.prototype.writeQuery = function (options) {
        var ref = this.cache.writeQuery(options);
        if (options.broadcast !== false) {
            this.queryManager.broadcastQueries();
        }
        return ref;
    };
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
    ApolloClient.prototype.writeFragment = function (options) {
        var ref = this.cache.writeFragment(options);
        if (options.broadcast !== false) {
            this.queryManager.broadcastQueries();
        }
        return ref;
    };
    ApolloClient.prototype.__actionHookForDevTools = function (cb) {
        this.devToolsHookCb = cb;
    };
    ApolloClient.prototype.__requestRaw = function (payload) {
        return execute(this.link, payload);
    };
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
    ApolloClient.prototype.resetStore = function () {
        var _this = this;
        return Promise.resolve()
            .then(function () {
            return _this.queryManager.clearStore({
                discardWatches: false,
            });
        })
            .then(function () { return Promise.all(_this.resetStoreCallbacks.map(function (fn) { return fn(); })); })
            .then(function () { return _this.reFetchObservableQueries(); });
    };
    /**
     * Remove all data from the store. Unlike `resetStore`, `clearStore` will
     * not refetch any active queries.
     */
    ApolloClient.prototype.clearStore = function () {
        var _this = this;
        return Promise.resolve()
            .then(function () {
            return _this.queryManager.clearStore({
                discardWatches: true,
            });
        })
            .then(function () { return Promise.all(_this.clearStoreCallbacks.map(function (fn) { return fn(); })); });
    };
    /**
     * Allows callbacks to be registered that are executed when the store is
     * reset. `onResetStore` returns an unsubscribe function that can be used
     * to remove registered callbacks.
     */
    ApolloClient.prototype.onResetStore = function (cb) {
        var _this = this;
        this.resetStoreCallbacks.push(cb);
        return function () {
            _this.resetStoreCallbacks = _this.resetStoreCallbacks.filter(function (c) { return c !== cb; });
        };
    };
    /**
     * Allows callbacks to be registered that are executed when the store is
     * cleared. `onClearStore` returns an unsubscribe function that can be used
     * to remove registered callbacks.
     */
    ApolloClient.prototype.onClearStore = function (cb) {
        var _this = this;
        this.clearStoreCallbacks.push(cb);
        return function () {
            _this.clearStoreCallbacks = _this.clearStoreCallbacks.filter(function (c) { return c !== cb; });
        };
    };
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
    ApolloClient.prototype.reFetchObservableQueries = function (includeStandby) {
        return this.queryManager.reFetchObservableQueries(includeStandby);
    };
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
    ApolloClient.prototype.refetchQueries = function (options) {
        var map = this.queryManager.refetchQueries(options);
        var queries = [];
        var results = [];
        map.forEach(function (result, obsQuery) {
            queries.push(obsQuery);
            results.push(result);
        });
        var result = Promise.all(results);
        // In case you need the raw results immediately, without awaiting
        // Promise.all(results):
        result.queries = queries;
        result.results = results;
        // If you decide to ignore the result Promise because you're using
        // result.queries and result.results instead, you shouldn't have to worry
        // about preventing uncaught rejections for the Promise.all result.
        result.catch(function (error) {
            globalThis.__DEV__ !== false && invariant.debug(17, error);
        });
        return result;
    };
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
    ApolloClient.prototype.getObservableQueries = function (include) {
        if (include === void 0) { include = "active"; }
        return this.queryManager.getObservableQueries(include);
    };
    /**
     * Exposes the cache's complete state, in a serializable format for later restoration.
     */
    ApolloClient.prototype.extract = function (optimistic) {
        return this.cache.extract(optimistic);
    };
    /**
     * Replaces existing state in the cache (if any) with the values expressed by
     * `serializedState`.
     *
     * Called when hydrating a cache (server side rendering, or offline storage),
     * and also (potentially) during hot reloads.
     */
    ApolloClient.prototype.restore = function (serializedState) {
        return this.cache.restore(serializedState);
    };
    /**
     * Add additional local resolvers.
     */
    ApolloClient.prototype.addResolvers = function (resolvers) {
        this.localState.addResolvers(resolvers);
    };
    /**
     * Set (override existing) local resolvers.
     */
    ApolloClient.prototype.setResolvers = function (resolvers) {
        this.localState.setResolvers(resolvers);
    };
    /**
     * Get all registered local resolvers.
     */
    ApolloClient.prototype.getResolvers = function () {
        return this.localState.getResolvers();
    };
    /**
     * Set a custom local state fragment matcher.
     */
    ApolloClient.prototype.setLocalStateFragmentMatcher = function (fragmentMatcher) {
        this.localState.setFragmentMatcher(fragmentMatcher);
    };
    /**
     * Define a new ApolloLink (or link chain) that Apollo Client will use.
     */
    ApolloClient.prototype.setLink = function (newLink) {
        this.link = this.queryManager.link = newLink;
    };
    Object.defineProperty(ApolloClient.prototype, "defaultContext", {
        get: function () {
            return this.queryManager.defaultContext;
        },
        enumerable: false,
        configurable: true
    });
    return ApolloClient;
}());
export { ApolloClient };
if (globalThis.__DEV__ !== false) {
    ApolloClient.prototype.getMemoryInternals = getApolloClientMemoryInternals;
}
//# sourceMappingURL=ApolloClient.js.map