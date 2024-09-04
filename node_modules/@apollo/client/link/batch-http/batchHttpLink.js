import { __assign, __extends, __rest } from "tslib";
import { ApolloLink } from "../core/index.js";
import { Observable, hasDirectives, maybe, removeClientSetsFromDocument, } from "../../utilities/index.js";
import { fromError } from "../utils/index.js";
import { serializeFetchParameter, selectURI, parseAndCheckHttpResponse, checkFetcher, selectHttpOptionsAndBodyInternal, defaultPrinter, fallbackHttpConfig, } from "../http/index.js";
import { BatchLink } from "../batch/index.js";
import { filterOperationVariables } from "../utils/filterOperationVariables.js";
var backupFetch = maybe(function () { return fetch; });
/**
 * Transforms Operation for into HTTP results.
 * context can include the headers property, which will be passed to the fetch function
 */
var BatchHttpLink = /** @class */ (function (_super) {
    __extends(BatchHttpLink, _super);
    function BatchHttpLink(fetchParams) {
        var _this = _super.call(this) || this;
        var _a = fetchParams || {}, _b = _a.uri, uri = _b === void 0 ? "/graphql" : _b, 
        // use default global fetch if nothing is passed in
        preferredFetch = _a.fetch, _c = _a.print, print = _c === void 0 ? defaultPrinter : _c, includeExtensions = _a.includeExtensions, preserveHeaderCase = _a.preserveHeaderCase, batchInterval = _a.batchInterval, batchDebounce = _a.batchDebounce, batchMax = _a.batchMax, batchKey = _a.batchKey, _d = _a.includeUnusedVariables, includeUnusedVariables = _d === void 0 ? false : _d, requestOptions = __rest(_a, ["uri", "fetch", "print", "includeExtensions", "preserveHeaderCase", "batchInterval", "batchDebounce", "batchMax", "batchKey", "includeUnusedVariables"]);
        if (globalThis.__DEV__ !== false) {
            // Make sure at least one of preferredFetch, window.fetch, or backupFetch
            // is defined, so requests won't fail at runtime.
            checkFetcher(preferredFetch || backupFetch);
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
            var chosenURI = selectURI(operations[0], uri);
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
                headers: __assign(__assign({}, clientAwarenessHeaders), context.headers),
            };
            var queries = operations.map(function (_a) {
                var query = _a.query;
                if (hasDirectives(["client"], query)) {
                    return removeClientSetsFromDocument(query);
                }
                return query;
            });
            // If we have a query that returned `null` after removing client-only
            // fields, it indicates a query that is using all client-only fields.
            if (queries.some(function (query) { return !query; })) {
                return fromError(new Error("BatchHttpLink: Trying to send a client-only query to the server. To send to the server, ensure a non-client field is added to the query or enable the `transformOptions.removeClientFields` option."));
            }
            //uses fallback, link, and then context to build options
            var optsAndBody = operations.map(function (operation, index) {
                var result = selectHttpOptionsAndBodyInternal(__assign(__assign({}, operation), { query: queries[index] }), print, fallbackHttpConfig, linkConfig, contextConfig);
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
            // There's no spec for using GET with batches.
            if (options.method === "GET") {
                return fromError(new Error("apollo-link-batch-http does not support GET requests"));
            }
            try {
                options.body = serializeFetchParameter(loadedBody, "Payload");
            }
            catch (parseError) {
                return fromError(parseError);
            }
            var controller;
            if (!options.signal && typeof AbortController !== "undefined") {
                controller = new AbortController();
                options.signal = controller.signal;
            }
            return new Observable(function (observer) {
                // Prefer BatchHttpLink.Options.fetch (preferredFetch) if provided, and
                // otherwise fall back to the *current* global window.fetch function
                // (see issue #7832), or (if all else fails) the backupFetch function we
                // saved when this module was first evaluated. This last option protects
                // against the removal of window.fetch, which is unlikely but not
                // impossible.
                var currentFetch = preferredFetch || maybe(function () { return fetch; }) || backupFetch;
                currentFetch(chosenURI, options)
                    .then(function (response) {
                    // Make the raw response available in the context.
                    operations.forEach(function (operation) {
                        return operation.setContext({ response: response });
                    });
                    return response;
                })
                    .then(parseAndCheckHttpResponse(operations))
                    .then(function (result) {
                    controller = undefined;
                    // we have data and can send it to back up the link chain
                    observer.next(result);
                    observer.complete();
                    return result;
                })
                    .catch(function (err) {
                    controller = undefined;
                    // if it is a network error, BUT there is graphql result info
                    // fire the next observer before calling error
                    // this gives apollo-client (and react-apollo) the `graphqlErrors` and `networkErrors`
                    // to pass to UI
                    // this should only happen if we *also* have data as part of the response key per
                    // the spec
                    if (err.result && err.result.errors && err.result.data) {
                        // if we dont' call next, the UI can only show networkError because AC didn't
                        // get andy graphqlErrors
                        // this is graphql execution result info (i.e errors and possibly data)
                        // this is because there is no formal spec how errors should translate to
                        // http status codes. So an auth error (401) could have both data
                        // from a public field, errors from a private field, and a status of 401
                        // {
                        //  user { // this will have errors
                        //    firstName
                        //  }
                        //  products { // this is public so will have data
                        //    cost
                        //  }
                        // }
                        //
                        // the result of above *could* look like this:
                        // {
                        //   data: { products: [{ cost: "$10" }] },
                        //   errors: [{
                        //      message: 'your session has timed out',
                        //      path: []
                        //   }]
                        // }
                        // status code of above would be a 401
                        // in the UI you want to show data where you can, errors as data where you can
                        // and use correct http status codes
                        observer.next(err.result);
                    }
                    observer.error(err);
                });
                return function () {
                    // XXX support canceling this request
                    // https://developers.google.com/web/updates/2017/09/abortable-fetch
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
                    //may throw error if config not serializable
                    return selectURI(operation, uri) + JSON.stringify(contextConfig);
                });
        _this.batcher = new BatchLink({
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
}(ApolloLink));
export { BatchHttpLink };
//# sourceMappingURL=batchHttpLink.js.map