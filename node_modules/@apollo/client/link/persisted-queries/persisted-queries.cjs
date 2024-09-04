'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var globals = require('../../utilities/globals');
var utilities = require('../../utilities');
var core = require('../core');

var VERSION = 1;
function processErrors(graphQLErrors) {
    var byMessage = Object.create(null), byCode = Object.create(null);
    if (utilities.isNonEmptyArray(graphQLErrors)) {
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
var createPersistedQueryLink = function (options) {
    var hashesByQuery;
    function resetHashCache() {
        hashesByQuery = undefined;
    }
    globals.invariant(options &&
        (typeof options.sha256 === "function" ||
            typeof options.generateHash === "function"), 40);
    var _a = utilities.compact(defaultOptions, options), sha256 = _a.sha256,
    _b = _a.generateHash,
    generateHash = _b === void 0 ? function (query) {
        return Promise.resolve(sha256(utilities.print(query)));
    } : _b, disable = _a.disable, retry = _a.retry, useGETForHashedQueries = _a.useGETForHashedQueries;
    var supportsPersistedQueries = true;
    var getHashPromise = function (query) {
        return new Promise(function (resolve) { return resolve(generateHash(query)); });
    };
    function getQueryHash(query) {
        if (!query || typeof query !== "object") {
            return getHashPromise(query);
        }
        if (!hashesByQuery) {
            hashesByQuery = new utilities.AutoCleanedWeakCache(utilities.cacheSizes["PersistedQueryLink.persistedQueryHashes"] ||
                2000 );
        }
        var hash = hashesByQuery.get(query);
        if (!hash)
            hashesByQuery.set(query, (hash = getHashPromise(query)));
        return hash;
    }
    return Object.assign(new core.ApolloLink(function (operation, forward) {
        globals.invariant(forward, 41);
        var query = operation.query;
        return new utilities.Observable(function (observer) {
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
                    if (utilities.isNonEmptyArray(responseErrors)) {
                        graphQLErrors.push.apply(graphQLErrors, responseErrors);
                    }
                    var networkErrors = void 0;
                    if (typeof (networkError === null || networkError === void 0 ? void 0 : networkError.result) !== "string") {
                        networkErrors =
                            networkError &&
                                networkError.result &&
                                networkError.result.errors;
                    }
                    if (utilities.isNonEmptyArray(networkErrors)) {
                        graphQLErrors.push.apply(graphQLErrors, networkErrors);
                    }
                    var disablePayload = {
                        response: response,
                        networkError: networkError,
                        operation: operation,
                        graphQLErrors: utilities.isNonEmptyArray(graphQLErrors) ? graphQLErrors : void 0,
                        meta: processErrors(graphQLErrors),
                    };
                    supportsPersistedQueries = !disable(disablePayload);
                    if (!supportsPersistedQueries) {
                        resetHashCache();
                    }
                    if (retry(disablePayload)) {
                        if (subscription)
                            subscription.unsubscribe();
                        operation.setContext({
                            http: {
                                includeQuery: true,
                                includeExtensions: supportsPersistedQueries,
                            },
                            fetchOptions: {
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
            operation.setContext({
                http: {
                    includeQuery: !supportsPersistedQueries,
                    includeExtensions: supportsPersistedQueries,
                },
            });
            if (useGETForHashedQueries &&
                supportsPersistedQueries &&
                !operationDefinesMutation(operation)) {
                operation.setContext(function (_a) {
                    var _b = _a.fetchOptions, fetchOptions = _b === void 0 ? {} : _b;
                    originalFetchOptions = fetchOptions;
                    return {
                        fetchOptions: tslib.__assign(tslib.__assign({}, fetchOptions), { method: "GET" }),
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

exports.VERSION = VERSION;
exports.createPersistedQueryLink = createPersistedQueryLink;
//# sourceMappingURL=persisted-queries.cjs.map
