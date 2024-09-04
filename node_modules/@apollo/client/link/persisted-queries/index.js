import { __assign } from "tslib";
import { invariant } from "../../utilities/globals/index.js";
import { print } from "../../utilities/index.js";
import { ApolloLink } from "../core/index.js";
import { Observable, compact, isNonEmptyArray } from "../../utilities/index.js";
import { cacheSizes, AutoCleanedWeakCache, } from "../../utilities/index.js";
export var VERSION = 1;
function processErrors(graphQLErrors) {
    var byMessage = Object.create(null), byCode = Object.create(null);
    if (isNonEmptyArray(graphQLErrors)) {
        graphQLErrors.forEach(function (error) {
            var _a;
            byMessage[error.message] = error;
            if (typeof ((_a = error.extensions) === null || _a === void 0 ? void 0 : _a.code) == "string")
                byCode[error.extensions.code] = error;
        });
    }
    return {
        persistedQueryNotSupported: !!(byMessage.PersistedQueryNotSupported ||
            byCode.PERSISTED_QUERY_NOT_SUPPORTED),
        persistedQueryNotFound: !!(byMessage.PersistedQueryNotFound || byCode.PERSISTED_QUERY_NOT_FOUND),
    };
}
var defaultOptions = {
    disable: function (_a) {
        var meta = _a.meta;
        return meta.persistedQueryNotSupported;
    },
    retry: function (_a) {
        var meta = _a.meta;
        return meta.persistedQueryNotSupported || meta.persistedQueryNotFound;
    },
    useGETForHashedQueries: false,
};
function operationDefinesMutation(operation) {
    return operation.query.definitions.some(function (d) { return d.kind === "OperationDefinition" && d.operation === "mutation"; });
}
export var createPersistedQueryLink = function (options) {
    var hashesByQuery;
    function resetHashCache() {
        hashesByQuery = undefined;
    }
    // Ensure a SHA-256 hash function is provided, if a custom hash
    // generation function is not provided. We don't supply a SHA-256 hash
    // function by default, to avoid forcing one as a dependency. Developers
    // should pick the most appropriate SHA-256 function (sync or async) for
    // their needs/environment, or provide a fully custom hash generation
    // function (via the `generateHash` option) if they want to handle
    // hashing with something other than SHA-256.
    invariant(options &&
        (typeof options.sha256 === "function" ||
            typeof options.generateHash === "function"), 40);
    var _a = compact(defaultOptions, options), sha256 = _a.sha256, 
    // If both a `sha256` and `generateHash` option are provided, the
    // `sha256` option will be ignored. Developers can configure and
    // use any hashing approach they want in a custom `generateHash`
    // function; they aren't limited to SHA-256.
    _b = _a.generateHash, 
    // If both a `sha256` and `generateHash` option are provided, the
    // `sha256` option will be ignored. Developers can configure and
    // use any hashing approach they want in a custom `generateHash`
    // function; they aren't limited to SHA-256.
    generateHash = _b === void 0 ? function (query) {
        return Promise.resolve(sha256(print(query)));
    } : _b, disable = _a.disable, retry = _a.retry, useGETForHashedQueries = _a.useGETForHashedQueries;
    var supportsPersistedQueries = true;
    var getHashPromise = function (query) {
        return new Promise(function (resolve) { return resolve(generateHash(query)); });
    };
    function getQueryHash(query) {
        if (!query || typeof query !== "object") {
            // If the query is not an object, we won't be able to store its hash as
            // a property of query[hashesKey], so we let generateHash(query) decide
            // what to do with the bogus query.
            return getHashPromise(query);
        }
        if (!hashesByQuery) {
            hashesByQuery = new AutoCleanedWeakCache(cacheSizes["PersistedQueryLink.persistedQueryHashes"] ||
                2000 /* defaultCacheSizes["PersistedQueryLink.persistedQueryHashes"] */);
        }
        var hash = hashesByQuery.get(query);
        if (!hash)
            hashesByQuery.set(query, (hash = getHashPromise(query)));
        return hash;
    }
    return Object.assign(new ApolloLink(function (operation, forward) {
        invariant(forward, 41);
        var query = operation.query;
        return new Observable(function (observer) {
            var subscription;
            var retried = false;
            var originalFetchOptions;
            var setFetchOptions = false;
            var maybeRetry = function (_a, cb) {
                var response = _a.response, networkError = _a.networkError;
                if (!retried && ((response && response.errors) || networkError)) {
                    retried = true;
                    var graphQLErrors = [];
                    var responseErrors = response && response.errors;
                    if (isNonEmptyArray(responseErrors)) {
                        graphQLErrors.push.apply(graphQLErrors, responseErrors);
                    }
                    // Network errors can return GraphQL errors on for example a 403
                    var networkErrors = void 0;
                    if (typeof (networkError === null || networkError === void 0 ? void 0 : networkError.result) !== "string") {
                        networkErrors =
                            networkError &&
                                networkError.result &&
                                networkError.result.errors;
                    }
                    if (isNonEmptyArray(networkErrors)) {
                        graphQLErrors.push.apply(graphQLErrors, networkErrors);
                    }
                    var disablePayload = {
                        response: response,
                        networkError: networkError,
                        operation: operation,
                        graphQLErrors: isNonEmptyArray(graphQLErrors) ? graphQLErrors : void 0,
                        meta: processErrors(graphQLErrors),
                    };
                    // if the server doesn't support persisted queries, don't try anymore
                    supportsPersistedQueries = !disable(disablePayload);
                    if (!supportsPersistedQueries) {
                        // clear hashes from cache, we don't need them anymore
                        resetHashCache();
                    }
                    // if its not found, we can try it again, otherwise just report the error
                    if (retry(disablePayload)) {
                        // need to recall the link chain
                        if (subscription)
                            subscription.unsubscribe();
                        // actually send the query this time
                        operation.setContext({
                            http: {
                                includeQuery: true,
                                includeExtensions: supportsPersistedQueries,
                            },
                            fetchOptions: {
                                // Since we're including the full query, which may be
                                // large, we should send it in the body of a POST request.
                                // See issue #7456.
                                method: "POST",
                            },
                        });
                        if (setFetchOptions) {
                            operation.setContext({ fetchOptions: originalFetchOptions });
                        }
                        subscription = forward(operation).subscribe(handler);
                        return;
                    }
                }
                cb();
            };
            var handler = {
                next: function (response) {
                    maybeRetry({ response: response }, function () { return observer.next(response); });
                },
                error: function (networkError) {
                    maybeRetry({ networkError: networkError }, function () { return observer.error(networkError); });
                },
                complete: observer.complete.bind(observer),
            };
            // don't send the query the first time
            operation.setContext({
                http: {
                    includeQuery: !supportsPersistedQueries,
                    includeExtensions: supportsPersistedQueries,
                },
            });
            // If requested, set method to GET if there are no mutations. Remember the
            // original fetchOptions so we can restore them if we fall back to a
            // non-hashed request.
            if (useGETForHashedQueries &&
                supportsPersistedQueries &&
                !operationDefinesMutation(operation)) {
                operation.setContext(function (_a) {
                    var _b = _a.fetchOptions, fetchOptions = _b === void 0 ? {} : _b;
                    originalFetchOptions = fetchOptions;
                    return {
                        fetchOptions: __assign(__assign({}, fetchOptions), { method: "GET" }),
                    };
                });
                setFetchOptions = true;
            }
            if (supportsPersistedQueries) {
                getQueryHash(query)
                    .then(function (sha256Hash) {
                    operation.extensions.persistedQuery = {
                        version: VERSION,
                        sha256Hash: sha256Hash,
                    };
                    subscription = forward(operation).subscribe(handler);
                })
                    .catch(observer.error.bind(observer));
            }
            else {
                subscription = forward(operation).subscribe(handler);
            }
            return function () {
                if (subscription)
                    subscription.unsubscribe();
            };
        });
    }), {
        resetHashCache: resetHashCache,
    }, globalThis.__DEV__ !== false ?
        {
            getMemoryInternals: function () {
                var _a;
                return {
                    PersistedQueryLink: {
                        persistedQueryHashes: (_a = hashesByQuery === null || hashesByQuery === void 0 ? void 0 : hashesByQuery.size) !== null && _a !== void 0 ? _a : 0,
                    },
                };
            },
        }
        : {});
};
//# sourceMappingURL=index.js.map