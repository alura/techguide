import { __assign, __awaiter, __generator } from "tslib";
import { invariant, newInvariantError } from "../utilities/globals/index.js";
import { equal } from "@wry/equality";
import { execute } from "../link/core/index.js";
import { hasDirectives, isExecutionPatchIncrementalResult, isExecutionPatchResult, removeDirectivesFromDocument, } from "../utilities/index.js";
import { canonicalStringify } from "../cache/index.js";
import { getDefaultValues, getOperationDefinition, getOperationName, hasClientExports, graphQLResultHasError, getGraphQLErrorsFromResult, Observable, asyncMap, isNonEmptyArray, Concast, makeUniqueId, isDocumentNode, isNonNullObject, DocumentTransform, } from "../utilities/index.js";
import { mergeIncrementalData } from "../utilities/common/incrementalResult.js";
import { ApolloError, isApolloError, graphQLResultHasProtocolErrors, } from "../errors/index.js";
import { ObservableQuery, logMissingFieldErrors } from "./ObservableQuery.js";
import { NetworkStatus, isNetworkRequestInFlight } from "./networkStatus.js";
import { LocalState } from "./LocalState.js";
import { QueryInfo, shouldWriteResult, } from "./QueryInfo.js";
import { PROTOCOL_ERRORS_SYMBOL } from "../errors/index.js";
import { print } from "../utilities/index.js";
var hasOwnProperty = Object.prototype.hasOwnProperty;
var IGNORE = Object.create(null);
import { Trie } from "@wry/trie";
import { AutoCleanedWeakCache, cacheSizes } from "../utilities/index.js";
var QueryManager = /** @class */ (function () {
    function QueryManager(_a) {
        var cache = _a.cache, link = _a.link, defaultOptions = _a.defaultOptions, documentTransform = _a.documentTransform, _b = _a.queryDeduplication, queryDeduplication = _b === void 0 ? false : _b, onBroadcast = _a.onBroadcast, _c = _a.ssrMode, ssrMode = _c === void 0 ? false : _c, _d = _a.clientAwareness, clientAwareness = _d === void 0 ? {} : _d, localState = _a.localState, _e = _a.assumeImmutableResults, assumeImmutableResults = _e === void 0 ? !!cache.assumeImmutableResults : _e, defaultContext = _a.defaultContext;
        var _this = this;
        this.clientAwareness = {};
        // All the queries that the QueryManager is currently managing (not
        // including mutations and subscriptions).
        this.queries = new Map();
        // Maps from queryId strings to Promise rejection functions for
        // currently active queries and fetches.
        // Use protected instead of private field so
        // @apollo/experimental-nextjs-app-support can access type info.
        this.fetchCancelFns = new Map();
        this.transformCache = new AutoCleanedWeakCache(cacheSizes["queryManager.getDocumentInfo"] ||
            2000 /* defaultCacheSizes["queryManager.getDocumentInfo"] */);
        this.queryIdCounter = 1;
        this.requestIdCounter = 1;
        this.mutationIdCounter = 1;
        // Use protected instead of private field so
        // @apollo/experimental-nextjs-app-support can access type info.
        this.inFlightLinkObservables = new Trie(false);
        var defaultDocumentTransform = new DocumentTransform(function (document) { return _this.cache.transformDocument(document); }, 
        // Allow the apollo cache to manage its own transform caches
        { cache: false });
        this.cache = cache;
        this.link = link;
        this.defaultOptions = defaultOptions || Object.create(null);
        this.queryDeduplication = queryDeduplication;
        this.clientAwareness = clientAwareness;
        this.localState = localState || new LocalState({ cache: cache });
        this.ssrMode = ssrMode;
        this.assumeImmutableResults = assumeImmutableResults;
        this.documentTransform =
            documentTransform ?
                defaultDocumentTransform
                    .concat(documentTransform)
                    // The custom document transform may add new fragment spreads or new
                    // field selections, so we want to give the cache a chance to run
                    // again. For example, the InMemoryCache adds __typename to field
                    // selections and fragments from the fragment registry.
                    .concat(defaultDocumentTransform)
                : defaultDocumentTransform;
        this.defaultContext = defaultContext || Object.create(null);
        if ((this.onBroadcast = onBroadcast)) {
            this.mutationStore = Object.create(null);
        }
    }
    /**
     * Call this method to terminate any active query processes, making it safe
     * to dispose of this QueryManager instance.
     */
    QueryManager.prototype.stop = function () {
        var _this = this;
        this.queries.forEach(function (_info, queryId) {
            _this.stopQueryNoBroadcast(queryId);
        });
        this.cancelPendingFetches(newInvariantError(25));
    };
    QueryManager.prototype.cancelPendingFetches = function (error) {
        this.fetchCancelFns.forEach(function (cancel) { return cancel(error); });
        this.fetchCancelFns.clear();
    };
    QueryManager.prototype.mutate = function (_a) {
        return __awaiter(this, arguments, void 0, function (_b) {
            var mutationId, hasClientExports, mutationStoreValue, isOptimistic, self;
            var _c, _d;
            var mutation = _b.mutation, variables = _b.variables, optimisticResponse = _b.optimisticResponse, updateQueries = _b.updateQueries, _e = _b.refetchQueries, refetchQueries = _e === void 0 ? [] : _e, _f = _b.awaitRefetchQueries, awaitRefetchQueries = _f === void 0 ? false : _f, updateWithProxyFn = _b.update, onQueryUpdated = _b.onQueryUpdated, _g = _b.fetchPolicy, fetchPolicy = _g === void 0 ? ((_c = this.defaultOptions.mutate) === null || _c === void 0 ? void 0 : _c.fetchPolicy) || "network-only" : _g, _h = _b.errorPolicy, errorPolicy = _h === void 0 ? ((_d = this.defaultOptions.mutate) === null || _d === void 0 ? void 0 : _d.errorPolicy) || "none" : _h, keepRootFields = _b.keepRootFields, context = _b.context;
            return __generator(this, function (_j) {
                switch (_j.label) {
                    case 0:
                        invariant(mutation, 26);
                        invariant(fetchPolicy === "network-only" || fetchPolicy === "no-cache", 27);
                        mutationId = this.generateMutationId();
                        mutation = this.cache.transformForLink(this.transform(mutation));
                        hasClientExports = this.getDocumentInfo(mutation).hasClientExports;
                        variables = this.getVariables(mutation, variables);
                        if (!hasClientExports) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.localState.addExportedVariables(mutation, variables, context)];
                    case 1:
                        variables = (_j.sent());
                        _j.label = 2;
                    case 2:
                        mutationStoreValue = this.mutationStore &&
                            (this.mutationStore[mutationId] = {
                                mutation: mutation,
                                variables: variables,
                                loading: true,
                                error: null,
                            });
                        isOptimistic = optimisticResponse &&
                            this.markMutationOptimistic(optimisticResponse, {
                                mutationId: mutationId,
                                document: mutation,
                                variables: variables,
                                fetchPolicy: fetchPolicy,
                                errorPolicy: errorPolicy,
                                context: context,
                                updateQueries: updateQueries,
                                update: updateWithProxyFn,
                                keepRootFields: keepRootFields,
                            });
                        this.broadcastQueries();
                        self = this;
                        return [2 /*return*/, new Promise(function (resolve, reject) {
                                return asyncMap(self.getObservableFromLink(mutation, __assign(__assign({}, context), { optimisticResponse: isOptimistic ? optimisticResponse : void 0 }), variables, false), function (result) {
                                    if (graphQLResultHasError(result) && errorPolicy === "none") {
                                        throw new ApolloError({
                                            graphQLErrors: getGraphQLErrorsFromResult(result),
                                        });
                                    }
                                    if (mutationStoreValue) {
                                        mutationStoreValue.loading = false;
                                        mutationStoreValue.error = null;
                                    }
                                    var storeResult = __assign({}, result);
                                    if (typeof refetchQueries === "function") {
                                        refetchQueries = refetchQueries(storeResult);
                                    }
                                    if (errorPolicy === "ignore" && graphQLResultHasError(storeResult)) {
                                        delete storeResult.errors;
                                    }
                                    return self.markMutationResult({
                                        mutationId: mutationId,
                                        result: storeResult,
                                        document: mutation,
                                        variables: variables,
                                        fetchPolicy: fetchPolicy,
                                        errorPolicy: errorPolicy,
                                        context: context,
                                        update: updateWithProxyFn,
                                        updateQueries: updateQueries,
                                        awaitRefetchQueries: awaitRefetchQueries,
                                        refetchQueries: refetchQueries,
                                        removeOptimistic: isOptimistic ? mutationId : void 0,
                                        onQueryUpdated: onQueryUpdated,
                                        keepRootFields: keepRootFields,
                                    });
                                }).subscribe({
                                    next: function (storeResult) {
                                        self.broadcastQueries();
                                        // Since mutations might receive multiple payloads from the
                                        // ApolloLink chain (e.g. when used with @defer),
                                        // we resolve with a SingleExecutionResult or after the final
                                        // ExecutionPatchResult has arrived and we have assembled the
                                        // multipart response into a single result.
                                        if (!("hasNext" in storeResult) || storeResult.hasNext === false) {
                                            resolve(storeResult);
                                        }
                                    },
                                    error: function (err) {
                                        if (mutationStoreValue) {
                                            mutationStoreValue.loading = false;
                                            mutationStoreValue.error = err;
                                        }
                                        if (isOptimistic) {
                                            self.cache.removeOptimistic(mutationId);
                                        }
                                        self.broadcastQueries();
                                        reject(err instanceof ApolloError ? err : (new ApolloError({
                                            networkError: err,
                                        })));
                                    },
                                });
                            })];
                }
            });
        });
    };
    QueryManager.prototype.markMutationResult = function (mutation, cache) {
        var _this = this;
        if (cache === void 0) { cache = this.cache; }
        var result = mutation.result;
        var cacheWrites = [];
        var skipCache = mutation.fetchPolicy === "no-cache";
        if (!skipCache && shouldWriteResult(result, mutation.errorPolicy)) {
            if (!isExecutionPatchIncrementalResult(result)) {
                cacheWrites.push({
                    result: result.data,
                    dataId: "ROOT_MUTATION",
                    query: mutation.document,
                    variables: mutation.variables,
                });
            }
            if (isExecutionPatchIncrementalResult(result) &&
                isNonEmptyArray(result.incremental)) {
                var diff = cache.diff({
                    id: "ROOT_MUTATION",
                    // The cache complains if passed a mutation where it expects a
                    // query, so we transform mutations and subscriptions to queries
                    // (only once, thanks to this.transformCache).
                    query: this.getDocumentInfo(mutation.document).asQuery,
                    variables: mutation.variables,
                    optimistic: false,
                    returnPartialData: true,
                });
                var mergedData = void 0;
                if (diff.result) {
                    mergedData = mergeIncrementalData(diff.result, result);
                }
                if (typeof mergedData !== "undefined") {
                    // cast the ExecutionPatchResult to FetchResult here since
                    // ExecutionPatchResult never has `data` when returned from the server
                    result.data = mergedData;
                    cacheWrites.push({
                        result: mergedData,
                        dataId: "ROOT_MUTATION",
                        query: mutation.document,
                        variables: mutation.variables,
                    });
                }
            }
            var updateQueries_1 = mutation.updateQueries;
            if (updateQueries_1) {
                this.queries.forEach(function (_a, queryId) {
                    var observableQuery = _a.observableQuery;
                    var queryName = observableQuery && observableQuery.queryName;
                    if (!queryName || !hasOwnProperty.call(updateQueries_1, queryName)) {
                        return;
                    }
                    var updater = updateQueries_1[queryName];
                    var _b = _this.queries.get(queryId), document = _b.document, variables = _b.variables;
                    // Read the current query result from the store.
                    var _c = cache.diff({
                        query: document,
                        variables: variables,
                        returnPartialData: true,
                        optimistic: false,
                    }), currentQueryResult = _c.result, complete = _c.complete;
                    if (complete && currentQueryResult) {
                        // Run our reducer using the current query result and the mutation result.
                        var nextQueryResult = updater(currentQueryResult, {
                            mutationResult: result,
                            queryName: (document && getOperationName(document)) || void 0,
                            queryVariables: variables,
                        });
                        // Write the modified result back into the store if we got a new result.
                        if (nextQueryResult) {
                            cacheWrites.push({
                                result: nextQueryResult,
                                dataId: "ROOT_QUERY",
                                query: document,
                                variables: variables,
                            });
                        }
                    }
                });
            }
        }
        if (cacheWrites.length > 0 ||
            (mutation.refetchQueries || "").length > 0 ||
            mutation.update ||
            mutation.onQueryUpdated ||
            mutation.removeOptimistic) {
            var results_1 = [];
            this.refetchQueries({
                updateCache: function (cache) {
                    if (!skipCache) {
                        cacheWrites.forEach(function (write) { return cache.write(write); });
                    }
                    // If the mutation has some writes associated with it then we need to
                    // apply those writes to the store by running this reducer again with
                    // a write action.
                    var update = mutation.update;
                    // Determine whether result is a SingleExecutionResult,
                    // or the final ExecutionPatchResult.
                    var isFinalResult = !isExecutionPatchResult(result) ||
                        (isExecutionPatchIncrementalResult(result) && !result.hasNext);
                    if (update) {
                        if (!skipCache) {
                            // Re-read the ROOT_MUTATION data we just wrote into the cache
                            // (the first cache.write call in the cacheWrites.forEach loop
                            // above), so field read functions have a chance to run for
                            // fields within mutation result objects.
                            var diff = cache.diff({
                                id: "ROOT_MUTATION",
                                // The cache complains if passed a mutation where it expects a
                                // query, so we transform mutations and subscriptions to queries
                                // (only once, thanks to this.transformCache).
                                query: _this.getDocumentInfo(mutation.document).asQuery,
                                variables: mutation.variables,
                                optimistic: false,
                                returnPartialData: true,
                            });
                            if (diff.complete) {
                                result = __assign(__assign({}, result), { data: diff.result });
                                if ("incremental" in result) {
                                    delete result.incremental;
                                }
                                if ("hasNext" in result) {
                                    delete result.hasNext;
                                }
                            }
                        }
                        // If we've received the whole response,
                        // either a SingleExecutionResult or the final ExecutionPatchResult,
                        // call the update function.
                        if (isFinalResult) {
                            update(cache, result, {
                                context: mutation.context,
                                variables: mutation.variables,
                            });
                        }
                    }
                    // TODO Do this with cache.evict({ id: 'ROOT_MUTATION' }) but make it
                    // shallow to allow rolling back optimistic evictions.
                    if (!skipCache && !mutation.keepRootFields && isFinalResult) {
                        cache.modify({
                            id: "ROOT_MUTATION",
                            fields: function (value, _a) {
                                var fieldName = _a.fieldName, DELETE = _a.DELETE;
                                return fieldName === "__typename" ? value : DELETE;
                            },
                        });
                    }
                },
                include: mutation.refetchQueries,
                // Write the final mutation.result to the root layer of the cache.
                optimistic: false,
                // Remove the corresponding optimistic layer at the same time as we
                // write the final non-optimistic result.
                removeOptimistic: mutation.removeOptimistic,
                // Let the caller of client.mutate optionally determine the refetching
                // behavior for watched queries after the mutation.update function runs.
                // If no onQueryUpdated function was provided for this mutation, pass
                // null instead of undefined to disable the default refetching behavior.
                onQueryUpdated: mutation.onQueryUpdated || null,
            }).forEach(function (result) { return results_1.push(result); });
            if (mutation.awaitRefetchQueries || mutation.onQueryUpdated) {
                // Returning a promise here makes the mutation await that promise, so we
                // include results in that promise's work if awaitRefetchQueries or an
                // onQueryUpdated function was specified.
                return Promise.all(results_1).then(function () { return result; });
            }
        }
        return Promise.resolve(result);
    };
    QueryManager.prototype.markMutationOptimistic = function (optimisticResponse, mutation) {
        var _this = this;
        var data = typeof optimisticResponse === "function" ?
            optimisticResponse(mutation.variables, { IGNORE: IGNORE })
            : optimisticResponse;
        if (data === IGNORE) {
            return false;
        }
        this.cache.recordOptimisticTransaction(function (cache) {
            try {
                _this.markMutationResult(__assign(__assign({}, mutation), { result: { data: data } }), cache);
            }
            catch (error) {
                globalThis.__DEV__ !== false && invariant.error(error);
            }
        }, mutation.mutationId);
        return true;
    };
    QueryManager.prototype.fetchQuery = function (queryId, options, networkStatus) {
        return this.fetchConcastWithInfo(queryId, options, networkStatus).concast
            .promise;
    };
    QueryManager.prototype.getQueryStore = function () {
        var store = Object.create(null);
        this.queries.forEach(function (info, queryId) {
            store[queryId] = {
                variables: info.variables,
                networkStatus: info.networkStatus,
                networkError: info.networkError,
                graphQLErrors: info.graphQLErrors,
            };
        });
        return store;
    };
    QueryManager.prototype.resetErrors = function (queryId) {
        var queryInfo = this.queries.get(queryId);
        if (queryInfo) {
            queryInfo.networkError = undefined;
            queryInfo.graphQLErrors = [];
        }
    };
    QueryManager.prototype.transform = function (document) {
        return this.documentTransform.transformDocument(document);
    };
    QueryManager.prototype.getDocumentInfo = function (document) {
        var transformCache = this.transformCache;
        if (!transformCache.has(document)) {
            var cacheEntry = {
                // TODO These three calls (hasClientExports, shouldForceResolvers, and
                // usesNonreactiveDirective) are performing independent full traversals
                // of the transformed document. We should consider merging these
                // traversals into a single pass in the future, though the work is
                // cached after the first time.
                hasClientExports: hasClientExports(document),
                hasForcedResolvers: this.localState.shouldForceResolvers(document),
                hasNonreactiveDirective: hasDirectives(["nonreactive"], document),
                clientQuery: this.localState.clientQuery(document),
                serverQuery: removeDirectivesFromDocument([
                    { name: "client", remove: true },
                    { name: "connection" },
                    { name: "nonreactive" },
                ], document),
                defaultVars: getDefaultValues(getOperationDefinition(document)),
                // Transform any mutation or subscription operations to query operations
                // so we can read/write them from/to the cache.
                asQuery: __assign(__assign({}, document), { definitions: document.definitions.map(function (def) {
                        if (def.kind === "OperationDefinition" &&
                            def.operation !== "query") {
                            return __assign(__assign({}, def), { operation: "query" });
                        }
                        return def;
                    }) }),
            };
            transformCache.set(document, cacheEntry);
        }
        return transformCache.get(document);
    };
    QueryManager.prototype.getVariables = function (document, variables) {
        return __assign(__assign({}, this.getDocumentInfo(document).defaultVars), variables);
    };
    QueryManager.prototype.watchQuery = function (options) {
        var query = this.transform(options.query);
        // assign variable default values if supplied
        // NOTE: We don't modify options.query here with the transformed query to
        // ensure observable.options.query is set to the raw untransformed query.
        options = __assign(__assign({}, options), { variables: this.getVariables(query, options.variables) });
        if (typeof options.notifyOnNetworkStatusChange === "undefined") {
            options.notifyOnNetworkStatusChange = false;
        }
        var queryInfo = new QueryInfo(this);
        var observable = new ObservableQuery({
            queryManager: this,
            queryInfo: queryInfo,
            options: options,
        });
        observable["lastQuery"] = query;
        this.queries.set(observable.queryId, queryInfo);
        // We give queryInfo the transformed query to ensure the first cache diff
        // uses the transformed query instead of the raw query
        queryInfo.init({
            document: query,
            observableQuery: observable,
            variables: observable.variables,
        });
        return observable;
    };
    QueryManager.prototype.query = function (options, queryId) {
        var _this = this;
        if (queryId === void 0) { queryId = this.generateQueryId(); }
        invariant(options.query, 28);
        invariant(options.query.kind === "Document", 29);
        invariant(!options.returnPartialData, 30);
        invariant(!options.pollInterval, 31);
        return this.fetchQuery(queryId, __assign(__assign({}, options), { query: this.transform(options.query) })).finally(function () { return _this.stopQuery(queryId); });
    };
    QueryManager.prototype.generateQueryId = function () {
        return String(this.queryIdCounter++);
    };
    QueryManager.prototype.generateRequestId = function () {
        return this.requestIdCounter++;
    };
    QueryManager.prototype.generateMutationId = function () {
        return String(this.mutationIdCounter++);
    };
    QueryManager.prototype.stopQueryInStore = function (queryId) {
        this.stopQueryInStoreNoBroadcast(queryId);
        this.broadcastQueries();
    };
    QueryManager.prototype.stopQueryInStoreNoBroadcast = function (queryId) {
        var queryInfo = this.queries.get(queryId);
        if (queryInfo)
            queryInfo.stop();
    };
    QueryManager.prototype.clearStore = function (options) {
        if (options === void 0) { options = {
            discardWatches: true,
        }; }
        // Before we have sent the reset action to the store, we can no longer
        // rely on the results returned by in-flight requests since these may
        // depend on values that previously existed in the data portion of the
        // store. So, we cancel the promises and observers that we have issued
        // so far and not yet resolved (in the case of queries).
        this.cancelPendingFetches(newInvariantError(32));
        this.queries.forEach(function (queryInfo) {
            if (queryInfo.observableQuery) {
                // Set loading to true so listeners don't trigger unless they want
                // results with partial data.
                queryInfo.networkStatus = NetworkStatus.loading;
            }
            else {
                queryInfo.stop();
            }
        });
        if (this.mutationStore) {
            this.mutationStore = Object.create(null);
        }
        // begin removing data from the store
        return this.cache.reset(options);
    };
    QueryManager.prototype.getObservableQueries = function (include) {
        var _this = this;
        if (include === void 0) { include = "active"; }
        var queries = new Map();
        var queryNamesAndDocs = new Map();
        var legacyQueryOptions = new Set();
        if (Array.isArray(include)) {
            include.forEach(function (desc) {
                if (typeof desc === "string") {
                    queryNamesAndDocs.set(desc, false);
                }
                else if (isDocumentNode(desc)) {
                    queryNamesAndDocs.set(_this.transform(desc), false);
                }
                else if (isNonNullObject(desc) && desc.query) {
                    legacyQueryOptions.add(desc);
                }
            });
        }
        this.queries.forEach(function (_a, queryId) {
            var oq = _a.observableQuery, document = _a.document;
            if (oq) {
                if (include === "all") {
                    queries.set(queryId, oq);
                    return;
                }
                var queryName = oq.queryName, fetchPolicy = oq.options.fetchPolicy;
                if (fetchPolicy === "standby" ||
                    (include === "active" && !oq.hasObservers())) {
                    return;
                }
                if (include === "active" ||
                    (queryName && queryNamesAndDocs.has(queryName)) ||
                    (document && queryNamesAndDocs.has(document))) {
                    queries.set(queryId, oq);
                    if (queryName)
                        queryNamesAndDocs.set(queryName, true);
                    if (document)
                        queryNamesAndDocs.set(document, true);
                }
            }
        });
        if (legacyQueryOptions.size) {
            legacyQueryOptions.forEach(function (options) {
                // We will be issuing a fresh network request for this query, so we
                // pre-allocate a new query ID here, using a special prefix to enable
                // cleaning up these temporary queries later, after fetching.
                var queryId = makeUniqueId("legacyOneTimeQuery");
                var queryInfo = _this.getQuery(queryId).init({
                    document: options.query,
                    variables: options.variables,
                });
                var oq = new ObservableQuery({
                    queryManager: _this,
                    queryInfo: queryInfo,
                    options: __assign(__assign({}, options), { fetchPolicy: "network-only" }),
                });
                invariant(oq.queryId === queryId);
                queryInfo.setObservableQuery(oq);
                queries.set(queryId, oq);
            });
        }
        if (globalThis.__DEV__ !== false && queryNamesAndDocs.size) {
            queryNamesAndDocs.forEach(function (included, nameOrDoc) {
                if (!included) {
                    globalThis.__DEV__ !== false && invariant.warn(typeof nameOrDoc === "string" ? 33 : 34, nameOrDoc);
                }
            });
        }
        return queries;
    };
    QueryManager.prototype.reFetchObservableQueries = function (includeStandby) {
        var _this = this;
        if (includeStandby === void 0) { includeStandby = false; }
        var observableQueryPromises = [];
        this.getObservableQueries(includeStandby ? "all" : "active").forEach(function (observableQuery, queryId) {
            var fetchPolicy = observableQuery.options.fetchPolicy;
            observableQuery.resetLastResults();
            if (includeStandby ||
                (fetchPolicy !== "standby" && fetchPolicy !== "cache-only")) {
                observableQueryPromises.push(observableQuery.refetch());
            }
            _this.getQuery(queryId).setDiff(null);
        });
        this.broadcastQueries();
        return Promise.all(observableQueryPromises);
    };
    QueryManager.prototype.setObservableQuery = function (observableQuery) {
        this.getQuery(observableQuery.queryId).setObservableQuery(observableQuery);
    };
    QueryManager.prototype.startGraphQLSubscription = function (_a) {
        var _this = this;
        var query = _a.query, fetchPolicy = _a.fetchPolicy, _b = _a.errorPolicy, errorPolicy = _b === void 0 ? "none" : _b, variables = _a.variables, _c = _a.context, context = _c === void 0 ? {} : _c;
        query = this.transform(query);
        variables = this.getVariables(query, variables);
        var makeObservable = function (variables) {
            return _this.getObservableFromLink(query, context, variables).map(function (result) {
                if (fetchPolicy !== "no-cache") {
                    // the subscription interface should handle not sending us results we no longer subscribe to.
                    // XXX I don't think we ever send in an object with errors, but we might in the future...
                    if (shouldWriteResult(result, errorPolicy)) {
                        _this.cache.write({
                            query: query,
                            result: result.data,
                            dataId: "ROOT_SUBSCRIPTION",
                            variables: variables,
                        });
                    }
                    _this.broadcastQueries();
                }
                var hasErrors = graphQLResultHasError(result);
                var hasProtocolErrors = graphQLResultHasProtocolErrors(result);
                if (hasErrors || hasProtocolErrors) {
                    var errors = {};
                    if (hasErrors) {
                        errors.graphQLErrors = result.errors;
                    }
                    if (hasProtocolErrors) {
                        errors.protocolErrors = result.extensions[PROTOCOL_ERRORS_SYMBOL];
                    }
                    // `errorPolicy` is a mechanism for handling GraphQL errors, according
                    // to our documentation, so we throw protocol errors regardless of the
                    // set error policy.
                    if (errorPolicy === "none" || hasProtocolErrors) {
                        throw new ApolloError(errors);
                    }
                }
                if (errorPolicy === "ignore") {
                    delete result.errors;
                }
                return result;
            });
        };
        if (this.getDocumentInfo(query).hasClientExports) {
            var observablePromise_1 = this.localState
                .addExportedVariables(query, variables, context)
                .then(makeObservable);
            return new Observable(function (observer) {
                var sub = null;
                observablePromise_1.then(function (observable) { return (sub = observable.subscribe(observer)); }, observer.error);
                return function () { return sub && sub.unsubscribe(); };
            });
        }
        return makeObservable(variables);
    };
    QueryManager.prototype.stopQuery = function (queryId) {
        this.stopQueryNoBroadcast(queryId);
        this.broadcastQueries();
    };
    QueryManager.prototype.stopQueryNoBroadcast = function (queryId) {
        this.stopQueryInStoreNoBroadcast(queryId);
        this.removeQuery(queryId);
    };
    QueryManager.prototype.removeQuery = function (queryId) {
        // teardown all links
        // Both `QueryManager.fetchRequest` and `QueryManager.query` create separate promises
        // that each add their reject functions to fetchCancelFns.
        // A query created with `QueryManager.query()` could trigger a `QueryManager.fetchRequest`.
        // The same queryId could have two rejection fns for two promises
        this.fetchCancelFns.delete(queryId);
        if (this.queries.has(queryId)) {
            this.getQuery(queryId).stop();
            this.queries.delete(queryId);
        }
    };
    QueryManager.prototype.broadcastQueries = function () {
        if (this.onBroadcast)
            this.onBroadcast();
        this.queries.forEach(function (info) { return info.notify(); });
    };
    QueryManager.prototype.getLocalState = function () {
        return this.localState;
    };
    QueryManager.prototype.getObservableFromLink = function (query, context, variables, 
    // Prefer context.queryDeduplication if specified.
    deduplication) {
        var _this = this;
        var _a;
        if (deduplication === void 0) { deduplication = (_a = context === null || context === void 0 ? void 0 : context.queryDeduplication) !== null && _a !== void 0 ? _a : this.queryDeduplication; }
        var observable;
        var _b = this.getDocumentInfo(query), serverQuery = _b.serverQuery, clientQuery = _b.clientQuery;
        if (serverQuery) {
            var _c = this, inFlightLinkObservables_1 = _c.inFlightLinkObservables, link = _c.link;
            var operation = {
                query: serverQuery,
                variables: variables,
                operationName: getOperationName(serverQuery) || void 0,
                context: this.prepareContext(__assign(__assign({}, context), { forceFetch: !deduplication })),
            };
            context = operation.context;
            if (deduplication) {
                var printedServerQuery_1 = print(serverQuery);
                var varJson_1 = canonicalStringify(variables);
                var entry = inFlightLinkObservables_1.lookup(printedServerQuery_1, varJson_1);
                observable = entry.observable;
                if (!observable) {
                    var concast = new Concast([
                        execute(link, operation),
                    ]);
                    observable = entry.observable = concast;
                    concast.beforeNext(function () {
                        inFlightLinkObservables_1.remove(printedServerQuery_1, varJson_1);
                    });
                }
            }
            else {
                observable = new Concast([
                    execute(link, operation),
                ]);
            }
        }
        else {
            observable = new Concast([Observable.of({ data: {} })]);
            context = this.prepareContext(context);
        }
        if (clientQuery) {
            observable = asyncMap(observable, function (result) {
                return _this.localState.runResolvers({
                    document: clientQuery,
                    remoteResult: result,
                    context: context,
                    variables: variables,
                });
            });
        }
        return observable;
    };
    QueryManager.prototype.getResultsFromLink = function (queryInfo, cacheWriteBehavior, options) {
        var requestId = (queryInfo.lastRequestId = this.generateRequestId());
        // Performing transformForLink here gives this.cache a chance to fill in
        // missing fragment definitions (for example) before sending this document
        // through the link chain.
        var linkDocument = this.cache.transformForLink(options.query);
        return asyncMap(this.getObservableFromLink(linkDocument, options.context, options.variables), function (result) {
            var graphQLErrors = getGraphQLErrorsFromResult(result);
            var hasErrors = graphQLErrors.length > 0;
            // If we interrupted this request by calling getResultsFromLink again
            // with the same QueryInfo object, we ignore the old results.
            if (requestId >= queryInfo.lastRequestId) {
                if (hasErrors && options.errorPolicy === "none") {
                    // Throwing here effectively calls observer.error.
                    throw queryInfo.markError(new ApolloError({
                        graphQLErrors: graphQLErrors,
                    }));
                }
                // Use linkDocument rather than queryInfo.document so the
                // operation/fragments used to write the result are the same as the
                // ones used to obtain it from the link.
                queryInfo.markResult(result, linkDocument, options, cacheWriteBehavior);
                queryInfo.markReady();
            }
            var aqr = {
                data: result.data,
                loading: false,
                networkStatus: NetworkStatus.ready,
            };
            if (hasErrors && options.errorPolicy !== "ignore") {
                aqr.errors = graphQLErrors;
                aqr.networkStatus = NetworkStatus.error;
            }
            return aqr;
        }, function (networkError) {
            var error = isApolloError(networkError) ? networkError : (new ApolloError({ networkError: networkError }));
            // Avoid storing errors from older interrupted queries.
            if (requestId >= queryInfo.lastRequestId) {
                queryInfo.markError(error);
            }
            throw error;
        });
    };
    QueryManager.prototype.fetchConcastWithInfo = function (queryId, options, 
    // The initial networkStatus for this fetch, most often
    // NetworkStatus.loading, but also possibly fetchMore, poll, refetch,
    // or setVariables.
    networkStatus, query) {
        var _this = this;
        if (networkStatus === void 0) { networkStatus = NetworkStatus.loading; }
        if (query === void 0) { query = options.query; }
        var variables = this.getVariables(query, options.variables);
        var queryInfo = this.getQuery(queryId);
        var defaults = this.defaultOptions.watchQuery;
        var _a = options.fetchPolicy, fetchPolicy = _a === void 0 ? (defaults && defaults.fetchPolicy) || "cache-first" : _a, _b = options.errorPolicy, errorPolicy = _b === void 0 ? (defaults && defaults.errorPolicy) || "none" : _b, _c = options.returnPartialData, returnPartialData = _c === void 0 ? false : _c, _d = options.notifyOnNetworkStatusChange, notifyOnNetworkStatusChange = _d === void 0 ? false : _d, _e = options.context, context = _e === void 0 ? {} : _e;
        var normalized = Object.assign({}, options, {
            query: query,
            variables: variables,
            fetchPolicy: fetchPolicy,
            errorPolicy: errorPolicy,
            returnPartialData: returnPartialData,
            notifyOnNetworkStatusChange: notifyOnNetworkStatusChange,
            context: context,
        });
        var fromVariables = function (variables) {
            // Since normalized is always a fresh copy of options, it's safe to
            // modify its properties here, rather than creating yet another new
            // WatchQueryOptions object.
            normalized.variables = variables;
            var sourcesWithInfo = _this.fetchQueryByPolicy(queryInfo, normalized, networkStatus);
            if (
            // If we're in standby, postpone advancing options.fetchPolicy using
            // applyNextFetchPolicy.
            normalized.fetchPolicy !== "standby" &&
                // The "standby" policy currently returns [] from fetchQueryByPolicy, so
                // this is another way to detect when nothing was done/fetched.
                sourcesWithInfo.sources.length > 0 &&
                queryInfo.observableQuery) {
                queryInfo.observableQuery["applyNextFetchPolicy"]("after-fetch", options);
            }
            return sourcesWithInfo;
        };
        // This cancel function needs to be set before the concast is created,
        // in case concast creation synchronously cancels the request.
        var cleanupCancelFn = function () { return _this.fetchCancelFns.delete(queryId); };
        this.fetchCancelFns.set(queryId, function (reason) {
            cleanupCancelFn();
            // This delay ensures the concast variable has been initialized.
            setTimeout(function () { return concast.cancel(reason); });
        });
        var concast, containsDataFromLink;
        // If the query has @export(as: ...) directives, then we need to
        // process those directives asynchronously. When there are no
        // @export directives (the common case), we deliberately avoid
        // wrapping the result of this.fetchQueryByPolicy in a Promise,
        // since the timing of result delivery is (unfortunately) important
        // for backwards compatibility. TODO This code could be simpler if
        // we deprecated and removed LocalState.
        if (this.getDocumentInfo(normalized.query).hasClientExports) {
            concast = new Concast(this.localState
                .addExportedVariables(normalized.query, normalized.variables, normalized.context)
                .then(fromVariables)
                .then(function (sourcesWithInfo) { return sourcesWithInfo.sources; }));
            // there is just no way we can synchronously get the *right* value here,
            // so we will assume `true`, which is the behaviour before the bug fix in
            // #10597. This means that bug is not fixed in that case, and is probably
            // un-fixable with reasonable effort for the edge case of @export as
            // directives.
            containsDataFromLink = true;
        }
        else {
            var sourcesWithInfo = fromVariables(normalized.variables);
            containsDataFromLink = sourcesWithInfo.fromLink;
            concast = new Concast(sourcesWithInfo.sources);
        }
        concast.promise.then(cleanupCancelFn, cleanupCancelFn);
        return {
            concast: concast,
            fromLink: containsDataFromLink,
        };
    };
    QueryManager.prototype.refetchQueries = function (_a) {
        var _this = this;
        var updateCache = _a.updateCache, include = _a.include, _b = _a.optimistic, optimistic = _b === void 0 ? false : _b, _c = _a.removeOptimistic, removeOptimistic = _c === void 0 ? optimistic ? makeUniqueId("refetchQueries") : void 0 : _c, onQueryUpdated = _a.onQueryUpdated;
        var includedQueriesById = new Map();
        if (include) {
            this.getObservableQueries(include).forEach(function (oq, queryId) {
                includedQueriesById.set(queryId, {
                    oq: oq,
                    lastDiff: _this.getQuery(queryId).getDiff(),
                });
            });
        }
        var results = new Map();
        if (updateCache) {
            this.cache.batch({
                update: updateCache,
                // Since you can perform any combination of cache reads and/or writes in
                // the cache.batch update function, its optimistic option can be either
                // a boolean or a string, representing three distinct modes of
                // operation:
                //
                // * false: read/write only the root layer
                // * true: read/write the topmost layer
                // * string: read/write a fresh optimistic layer with that ID string
                //
                // When typeof optimistic === "string", a new optimistic layer will be
                // temporarily created within cache.batch with that string as its ID. If
                // we then pass that same string as the removeOptimistic option, we can
                // make cache.batch immediately remove the optimistic layer after
                // running the updateCache function, triggering only one broadcast.
                //
                // However, the refetchQueries method accepts only true or false for its
                // optimistic option (not string). We interpret true to mean a temporary
                // optimistic layer should be created, to allow efficiently rolling back
                // the effect of the updateCache function, which involves passing a
                // string instead of true as the optimistic option to cache.batch, when
                // refetchQueries receives optimistic: true.
                //
                // In other words, we are deliberately not supporting the use case of
                // writing to an *existing* optimistic layer (using the refetchQueries
                // updateCache function), since that would potentially interfere with
                // other optimistic updates in progress. Instead, you can read/write
                // only the root layer by passing optimistic: false to refetchQueries,
                // or you can read/write a brand new optimistic layer that will be
                // automatically removed by passing optimistic: true.
                optimistic: (optimistic && removeOptimistic) || false,
                // The removeOptimistic option can also be provided by itself, even if
                // optimistic === false, to remove some previously-added optimistic
                // layer safely and efficiently, like we do in markMutationResult.
                //
                // If an explicit removeOptimistic string is provided with optimistic:
                // true, the removeOptimistic string will determine the ID of the
                // temporary optimistic layer, in case that ever matters.
                removeOptimistic: removeOptimistic,
                onWatchUpdated: function (watch, diff, lastDiff) {
                    var oq = watch.watcher instanceof QueryInfo && watch.watcher.observableQuery;
                    if (oq) {
                        if (onQueryUpdated) {
                            // Since we're about to handle this query now, remove it from
                            // includedQueriesById, in case it was added earlier because of
                            // options.include.
                            includedQueriesById.delete(oq.queryId);
                            var result = onQueryUpdated(oq, diff, lastDiff);
                            if (result === true) {
                                // The onQueryUpdated function requested the default refetching
                                // behavior by returning true.
                                result = oq.refetch();
                            }
                            // Record the result in the results Map, as long as onQueryUpdated
                            // did not return false to skip/ignore this result.
                            if (result !== false) {
                                results.set(oq, result);
                            }
                            // Allow the default cache broadcast to happen, except when
                            // onQueryUpdated returns false.
                            return result;
                        }
                        if (onQueryUpdated !== null) {
                            // If we don't have an onQueryUpdated function, and onQueryUpdated
                            // was not disabled by passing null, make sure this query is
                            // "included" like any other options.include-specified query.
                            includedQueriesById.set(oq.queryId, { oq: oq, lastDiff: lastDiff, diff: diff });
                        }
                    }
                },
            });
        }
        if (includedQueriesById.size) {
            includedQueriesById.forEach(function (_a, queryId) {
                var oq = _a.oq, lastDiff = _a.lastDiff, diff = _a.diff;
                var result;
                // If onQueryUpdated is provided, we want to use it for all included
                // queries, even the QueryOptions ones.
                if (onQueryUpdated) {
                    if (!diff) {
                        var info = oq["queryInfo"];
                        info.reset(); // Force info.getDiff() to read from cache.
                        diff = info.getDiff();
                    }
                    result = onQueryUpdated(oq, diff, lastDiff);
                }
                // Otherwise, we fall back to refetching.
                if (!onQueryUpdated || result === true) {
                    result = oq.refetch();
                }
                if (result !== false) {
                    results.set(oq, result);
                }
                if (queryId.indexOf("legacyOneTimeQuery") >= 0) {
                    _this.stopQueryNoBroadcast(queryId);
                }
            });
        }
        if (removeOptimistic) {
            // In case no updateCache callback was provided (so cache.batch was not
            // called above, and thus did not already remove the optimistic layer),
            // remove it here. Since this is a no-op when the layer has already been
            // removed, we do it even if we called cache.batch above, since it's
            // possible this.cache is an instance of some ApolloCache subclass other
            // than InMemoryCache, and does not fully support the removeOptimistic
            // option for cache.batch.
            this.cache.removeOptimistic(removeOptimistic);
        }
        return results;
    };
    QueryManager.prototype.fetchQueryByPolicy = function (queryInfo, _a, 
    // The initial networkStatus for this fetch, most often
    // NetworkStatus.loading, but also possibly fetchMore, poll, refetch,
    // or setVariables.
    networkStatus) {
        var _this = this;
        var query = _a.query, variables = _a.variables, fetchPolicy = _a.fetchPolicy, refetchWritePolicy = _a.refetchWritePolicy, errorPolicy = _a.errorPolicy, returnPartialData = _a.returnPartialData, context = _a.context, notifyOnNetworkStatusChange = _a.notifyOnNetworkStatusChange;
        var oldNetworkStatus = queryInfo.networkStatus;
        queryInfo.init({
            document: query,
            variables: variables,
            networkStatus: networkStatus,
        });
        var readCache = function () { return queryInfo.getDiff(); };
        var resultsFromCache = function (diff, networkStatus) {
            if (networkStatus === void 0) { networkStatus = queryInfo.networkStatus || NetworkStatus.loading; }
            var data = diff.result;
            if (globalThis.__DEV__ !== false && !returnPartialData && !equal(data, {})) {
                logMissingFieldErrors(diff.missing);
            }
            var fromData = function (data) {
                return Observable.of(__assign({ data: data, loading: isNetworkRequestInFlight(networkStatus), networkStatus: networkStatus }, (diff.complete ? null : { partial: true })));
            };
            if (data && _this.getDocumentInfo(query).hasForcedResolvers) {
                return _this.localState
                    .runResolvers({
                    document: query,
                    remoteResult: { data: data },
                    context: context,
                    variables: variables,
                    onlyRunForcedResolvers: true,
                })
                    .then(function (resolved) { return fromData(resolved.data || void 0); });
            }
            // Resolves https://github.com/apollographql/apollo-client/issues/10317.
            // If errorPolicy is 'none' and notifyOnNetworkStatusChange is true,
            // data was incorrectly returned from the cache on refetch:
            // if diff.missing exists, we should not return cache data.
            if (errorPolicy === "none" &&
                networkStatus === NetworkStatus.refetch &&
                Array.isArray(diff.missing)) {
                return fromData(void 0);
            }
            return fromData(data);
        };
        var cacheWriteBehavior = fetchPolicy === "no-cache" ? 0 /* CacheWriteBehavior.FORBID */
            // Watched queries must opt into overwriting existing data on refetch,
            // by passing refetchWritePolicy: "overwrite" in their WatchQueryOptions.
            : (networkStatus === NetworkStatus.refetch &&
                refetchWritePolicy !== "merge") ?
                1 /* CacheWriteBehavior.OVERWRITE */
                : 2 /* CacheWriteBehavior.MERGE */;
        var resultsFromLink = function () {
            return _this.getResultsFromLink(queryInfo, cacheWriteBehavior, {
                query: query,
                variables: variables,
                context: context,
                fetchPolicy: fetchPolicy,
                errorPolicy: errorPolicy,
            });
        };
        var shouldNotify = notifyOnNetworkStatusChange &&
            typeof oldNetworkStatus === "number" &&
            oldNetworkStatus !== networkStatus &&
            isNetworkRequestInFlight(networkStatus);
        switch (fetchPolicy) {
            default:
            case "cache-first": {
                var diff = readCache();
                if (diff.complete) {
                    return {
                        fromLink: false,
                        sources: [resultsFromCache(diff, queryInfo.markReady())],
                    };
                }
                if (returnPartialData || shouldNotify) {
                    return {
                        fromLink: true,
                        sources: [resultsFromCache(diff), resultsFromLink()],
                    };
                }
                return { fromLink: true, sources: [resultsFromLink()] };
            }
            case "cache-and-network": {
                var diff = readCache();
                if (diff.complete || returnPartialData || shouldNotify) {
                    return {
                        fromLink: true,
                        sources: [resultsFromCache(diff), resultsFromLink()],
                    };
                }
                return { fromLink: true, sources: [resultsFromLink()] };
            }
            case "cache-only":
                return {
                    fromLink: false,
                    sources: [resultsFromCache(readCache(), queryInfo.markReady())],
                };
            case "network-only":
                if (shouldNotify) {
                    return {
                        fromLink: true,
                        sources: [resultsFromCache(readCache()), resultsFromLink()],
                    };
                }
                return { fromLink: true, sources: [resultsFromLink()] };
            case "no-cache":
                if (shouldNotify) {
                    return {
                        fromLink: true,
                        // Note that queryInfo.getDiff() for no-cache queries does not call
                        // cache.diff, but instead returns a { complete: false } stub result
                        // when there is no queryInfo.diff already defined.
                        sources: [resultsFromCache(queryInfo.getDiff()), resultsFromLink()],
                    };
                }
                return { fromLink: true, sources: [resultsFromLink()] };
            case "standby":
                return { fromLink: false, sources: [] };
        }
    };
    QueryManager.prototype.getQuery = function (queryId) {
        if (queryId && !this.queries.has(queryId)) {
            this.queries.set(queryId, new QueryInfo(this, queryId));
        }
        return this.queries.get(queryId);
    };
    QueryManager.prototype.prepareContext = function (context) {
        if (context === void 0) { context = {}; }
        var newContext = this.localState.prepareContext(context);
        return __assign(__assign(__assign({}, this.defaultContext), newContext), { clientAwareness: this.clientAwareness });
    };
    return QueryManager;
}());
export { QueryManager };
//# sourceMappingURL=QueryManager.js.map