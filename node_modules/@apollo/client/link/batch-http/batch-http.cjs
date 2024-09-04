'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var core = require('../core');
var utilities = require('../../utilities');
var utils = require('../utils');
var http = require('../http');
var batch = require('../batch');
var graphql = require('graphql');

function filterOperationVariables(variables, query) {
    var result = tslib.__assign({}, variables);
    var unusedNames = new Set(Object.keys(variables));
    graphql.visit(query, {
        Variable: function (node, _key, parent) {
            if (parent &&
                parent.kind !== "VariableDefinition") {
                unusedNames.delete(node.name.value);
            }
        },
    });
    unusedNames.forEach(function (name) {
        delete result[name];
    });
    return result;
}

var backupFetch = utilities.maybe(function () { return fetch; });
var BatchHttpLink =  (function (_super) {
    tslib.__extends(BatchHttpLink, _super);
    function BatchHttpLink(fetchParams) {
        var _this = _super.call(this) || this;
        var _a = fetchParams || {}, _b = _a.uri, uri = _b === void 0 ? "/graphql" : _b,
        preferredFetch = _a.fetch, _c = _a.print, print = _c === void 0 ? http.defaultPrinter : _c, includeExtensions = _a.includeExtensions, preserveHeaderCase = _a.preserveHeaderCase, batchInterval = _a.batchInterval, batchDebounce = _a.batchDebounce, batchMax = _a.batchMax, batchKey = _a.batchKey, _d = _a.includeUnusedVariables, includeUnusedVariables = _d === void 0 ? false : _d, requestOptions = tslib.__rest(_a, ["uri", "fetch", "print", "includeExtensions", "preserveHeaderCase", "batchInterval", "batchDebounce", "batchMax", "batchKey", "includeUnusedVariables"]);
        if (globalThis.__DEV__ !== false) {
            http.checkFetcher(preferredFetch || backupFetch);
        }
        var linkConfig = {
            http: { includeExtensions: includeExtensions, preserveHeaderCase: preserveHeaderCase },
            options: requestOptions.fetchOptions,
            credentials: requestOptions.credentials,
            headers: requestOptions.headers,
        };
        _this.batchDebounce = batchDebounce;
        _this.batchInterval = batchInterval || 10;
        _this.batchMax = batchMax || 10;
        var batchHandler = function (operations) {
            var chosenURI = http.selectURI(operations[0], uri);
            var context = operations[0].getContext();
            var clientAwarenessHeaders = {};
            if (context.clientAwareness) {
                var _a = context.clientAwareness, name_1 = _a.name, version = _a.version;
                if (name_1) {
                    clientAwarenessHeaders["apollographql-client-name"] = name_1;
                }
                if (version) {
                    clientAwarenessHeaders["apollographql-client-version"] = version;
                }
            }
            var contextConfig = {
                http: context.http,
                options: context.fetchOptions,
                credentials: context.credentials,
                headers: tslib.__assign(tslib.__assign({}, clientAwarenessHeaders), context.headers),
            };
            var queries = operations.map(function (_a) {
                var query = _a.query;
                if (utilities.hasDirectives(["client"], query)) {
                    return utilities.removeClientSetsFromDocument(query);
                }
                return query;
            });
            if (queries.some(function (query) { return !query; })) {
                return utils.fromError(new Error("BatchHttpLink: Trying to send a client-only query to the server. To send to the server, ensure a non-client field is added to the query or enable the `transformOptions.removeClientFields` option."));
            }
            var optsAndBody = operations.map(function (operation, index) {
                var result = http.selectHttpOptionsAndBodyInternal(tslib.__assign(tslib.__assign({}, operation), { query: queries[index] }), print, http.fallbackHttpConfig, linkConfig, contextConfig);
                if (result.body.variables && !includeUnusedVariables) {
                    result.body.variables = filterOperationVariables(result.body.variables, operation.query);
                }
                return result;
            });
            var loadedBody = optsAndBody.map(function (_a) {
                var body = _a.body;
                return body;
            });
            var options = optsAndBody[0].options;
            if (options.method === "GET") {
                return utils.fromError(new Error("apollo-link-batch-http does not support GET requests"));
            }
            try {
                options.body = http.serializeFetchParameter(loadedBody, "Payload");
            }
            catch (parseError) {
                return utils.fromError(parseError);
            }
            var controller;
            if (!options.signal && typeof AbortController !== "undefined") {
                controller = new AbortController();
                options.signal = controller.signal;
            }
            return new utilities.Observable(function (observer) {
                var currentFetch = preferredFetch || utilities.maybe(function () { return fetch; }) || backupFetch;
                currentFetch(chosenURI, options)
                    .then(function (response) {
                    operations.forEach(function (operation) {
                        return operation.setContext({ response: response });
                    });
                    return response;
                })
                    .then(http.parseAndCheckHttpResponse(operations))
                    .then(function (result) {
                    controller = undefined;
                    observer.next(result);
                    observer.complete();
                    return result;
                })
                    .catch(function (err) {
                    controller = undefined;
                    if (err.result && err.result.errors && err.result.data) {
                        observer.next(err.result);
                    }
                    observer.error(err);
                });
                return function () {
                    if (controller)
                        controller.abort();
                };
            });
        };
        batchKey =
            batchKey ||
                (function (operation) {
                    var context = operation.getContext();
                    var contextConfig = {
                        http: context.http,
                        options: context.fetchOptions,
                        credentials: context.credentials,
                        headers: context.headers,
                    };
                    return http.selectURI(operation, uri) + JSON.stringify(contextConfig);
                });
        _this.batcher = new batch.BatchLink({
            batchDebounce: _this.batchDebounce,
            batchInterval: _this.batchInterval,
            batchMax: _this.batchMax,
            batchKey: batchKey,
            batchHandler: batchHandler,
        });
        return _this;
    }
    BatchHttpLink.prototype.request = function (operation) {
        return this.batcher.request(operation);
    };
    return BatchHttpLink;
}(core.ApolloLink));

exports.BatchHttpLink = BatchHttpLink;
//# sourceMappingURL=batch-http.cjs.map
