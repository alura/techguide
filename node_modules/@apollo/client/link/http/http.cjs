'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var globals = require('../../utilities/globals');
var tslib = require('tslib');
var utilities = require('../../utilities');
var utils = require('../utils');
var errors = require('../../errors');
var core = require('../core');

function asyncIterator(source) {
    var _a;
    var iterator = source[Symbol.asyncIterator]();
    return _a = {
            next: function () {
                return iterator.next();
            }
        },
        _a[Symbol.asyncIterator] = function () {
            return this;
        },
        _a;
}

function nodeStreamIterator(stream) {
    var cleanup = null;
    var error = null;
    var done = false;
    var data = [];
    var waiting = [];
    function onData(chunk) {
        if (error)
            return;
        if (waiting.length) {
            var shiftedArr = waiting.shift();
            if (Array.isArray(shiftedArr) && shiftedArr[0]) {
                return shiftedArr[0]({ value: chunk, done: false });
            }
        }
        data.push(chunk);
    }
    function onError(err) {
        error = err;
        var all = waiting.slice();
        all.forEach(function (pair) {
            pair[1](err);
        });
        !cleanup || cleanup();
    }
    function onEnd() {
        done = true;
        var all = waiting.slice();
        all.forEach(function (pair) {
            pair[0]({ value: undefined, done: true });
        });
        !cleanup || cleanup();
    }
    cleanup = function () {
        cleanup = null;
        stream.removeListener("data", onData);
        stream.removeListener("error", onError);
        stream.removeListener("end", onEnd);
        stream.removeListener("finish", onEnd);
        stream.removeListener("close", onEnd);
    };
    stream.on("data", onData);
    stream.on("error", onError);
    stream.on("end", onEnd);
    stream.on("finish", onEnd);
    stream.on("close", onEnd);
    function getNext() {
        return new Promise(function (resolve, reject) {
            if (error)
                return reject(error);
            if (data.length)
                return resolve({ value: data.shift(), done: false });
            if (done)
                return resolve({ value: undefined, done: true });
            waiting.push([resolve, reject]);
        });
    }
    var iterator = {
        next: function () {
            return getNext();
        },
    };
    if (utilities.canUseAsyncIteratorSymbol) {
        iterator[Symbol.asyncIterator] = function () {
            return this;
        };
    }
    return iterator;
}

function promiseIterator(promise) {
    var resolved = false;
    var iterator = {
        next: function () {
            if (resolved)
                return Promise.resolve({
                    value: undefined,
                    done: true,
                });
            resolved = true;
            return new Promise(function (resolve, reject) {
                promise
                    .then(function (value) {
                    resolve({ value: value, done: false });
                })
                    .catch(reject);
            });
        },
    };
    if (utilities.canUseAsyncIteratorSymbol) {
        iterator[Symbol.asyncIterator] = function () {
            return this;
        };
    }
    return iterator;
}

function readerIterator(reader) {
    var iterator = {
        next: function () {
            return reader.read();
        },
    };
    if (utilities.canUseAsyncIteratorSymbol) {
        iterator[Symbol.asyncIterator] = function () {
            return this;
        };
    }
    return iterator;
}

function isNodeResponse(value) {
    return !!value.body;
}
function isReadableStream(value) {
    return !!value.getReader;
}
function isAsyncIterableIterator(value) {
    return !!(utilities.canUseAsyncIteratorSymbol &&
        value[Symbol.asyncIterator]);
}
function isStreamableBlob(value) {
    return !!value.stream;
}
function isBlob(value) {
    return !!value.arrayBuffer;
}
function isNodeReadableStream(value) {
    return !!value.pipe;
}
function responseIterator(response) {
    var body = response;
    if (isNodeResponse(response))
        body = response.body;
    if (isAsyncIterableIterator(body))
        return asyncIterator(body);
    if (isReadableStream(body))
        return readerIterator(body.getReader());
    if (isStreamableBlob(body)) {
        return readerIterator(body.stream().getReader());
    }
    if (isBlob(body))
        return promiseIterator(body.arrayBuffer());
    if (isNodeReadableStream(body))
        return nodeStreamIterator(body);
    throw new Error("Unknown body type for responseIterator. Please pass a streamable response.");
}

function isNonNullObject(obj) {
    return obj !== null && typeof obj === "object";
}

function isApolloPayloadResult(value) {
    return isNonNullObject(value) && "payload" in value;
}

var hasOwnProperty = Object.prototype.hasOwnProperty;
function readMultipartBody(response, nextValue) {
    return tslib.__awaiter(this, void 0, void 0, function () {
        var decoder, contentType, delimiter, boundaryVal, boundary, buffer, iterator, running, _a, value, done, chunk, searchFrom, bi, message, i, headers, contentType_1, body, result, next;
        var _b, _c;
        var _d;
        return tslib.__generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    if (TextDecoder === undefined) {
                        throw new Error("TextDecoder must be defined in the environment: please import a polyfill.");
                    }
                    decoder = new TextDecoder("utf-8");
                    contentType = (_d = response.headers) === null || _d === void 0 ? void 0 : _d.get("content-type");
                    delimiter = "boundary=";
                    boundaryVal = (contentType === null || contentType === void 0 ? void 0 : contentType.includes(delimiter)) ?
                        contentType === null || contentType === void 0 ? void 0 : contentType.substring((contentType === null || contentType === void 0 ? void 0 : contentType.indexOf(delimiter)) + delimiter.length).replace(/['"]/g, "").replace(/\;(.*)/gm, "").trim()
                        : "-";
                    boundary = "\r\n--".concat(boundaryVal);
                    buffer = "";
                    iterator = responseIterator(response);
                    running = true;
                    _e.label = 1;
                case 1:
                    if (!running) return [3 , 3];
                    return [4 , iterator.next()];
                case 2:
                    _a = _e.sent(), value = _a.value, done = _a.done;
                    chunk = typeof value === "string" ? value : decoder.decode(value);
                    searchFrom = buffer.length - boundary.length + 1;
                    running = !done;
                    buffer += chunk;
                    bi = buffer.indexOf(boundary, searchFrom);
                    while (bi > -1) {
                        message = void 0;
                        _b = [
                            buffer.slice(0, bi),
                            buffer.slice(bi + boundary.length),
                        ], message = _b[0], buffer = _b[1];
                        i = message.indexOf("\r\n\r\n");
                        headers = parseHeaders(message.slice(0, i));
                        contentType_1 = headers["content-type"];
                        if (contentType_1 &&
                            contentType_1.toLowerCase().indexOf("application/json") === -1) {
                            throw new Error("Unsupported patch content type: application/json is required.");
                        }
                        body = message.slice(i);
                        if (body) {
                            result = parseJsonBody(response, body);
                            if (Object.keys(result).length > 1 ||
                                "data" in result ||
                                "incremental" in result ||
                                "errors" in result ||
                                "payload" in result) {
                                if (isApolloPayloadResult(result)) {
                                    next = {};
                                    if ("payload" in result) {
                                        if (Object.keys(result).length === 1 && result.payload === null) {
                                            return [2 ];
                                        }
                                        next = tslib.__assign({}, result.payload);
                                    }
                                    if ("errors" in result) {
                                        next = tslib.__assign(tslib.__assign({}, next), { extensions: tslib.__assign(tslib.__assign({}, ("extensions" in next ? next.extensions : null)), (_c = {}, _c[errors.PROTOCOL_ERRORS_SYMBOL] = result.errors, _c)) });
                                    }
                                    nextValue(next);
                                }
                                else {
                                    nextValue(result);
                                }
                            }
                            else if (
                            Object.keys(result).length === 1 &&
                                "hasNext" in result &&
                                !result.hasNext) {
                                return [2 ];
                            }
                        }
                        bi = buffer.indexOf(boundary);
                    }
                    return [3 , 1];
                case 3: return [2 ];
            }
        });
    });
}
function parseHeaders(headerText) {
    var headersInit = {};
    headerText.split("\n").forEach(function (line) {
        var i = line.indexOf(":");
        if (i > -1) {
            var name_1 = line.slice(0, i).trim().toLowerCase();
            var value = line.slice(i + 1).trim();
            headersInit[name_1] = value;
        }
    });
    return headersInit;
}
function parseJsonBody(response, bodyText) {
    if (response.status >= 300) {
        var getResult = function () {
            try {
                return JSON.parse(bodyText);
            }
            catch (err) {
                return bodyText;
            }
        };
        utils.throwServerError(response, getResult(), "Response not successful: Received status code ".concat(response.status));
    }
    try {
        return JSON.parse(bodyText);
    }
    catch (err) {
        var parseError = err;
        parseError.name = "ServerParseError";
        parseError.response = response;
        parseError.statusCode = response.status;
        parseError.bodyText = bodyText;
        throw parseError;
    }
}
function handleError(err, observer) {
    if (err.result && err.result.errors && err.result.data) {
        observer.next(err.result);
    }
    observer.error(err);
}
function parseAndCheckHttpResponse(operations) {
    return function (response) {
        return response
            .text()
            .then(function (bodyText) { return parseJsonBody(response, bodyText); })
            .then(function (result) {
            if (!Array.isArray(result) &&
                !hasOwnProperty.call(result, "data") &&
                !hasOwnProperty.call(result, "errors")) {
                utils.throwServerError(response, result, "Server response was missing for query '".concat(Array.isArray(operations) ?
                    operations.map(function (op) { return op.operationName; })
                    : operations.operationName, "'."));
            }
            return result;
        });
    };
}

var serializeFetchParameter = function (p, label) {
    var serialized;
    try {
        serialized = JSON.stringify(p);
    }
    catch (e) {
        var parseError = globals.newInvariantError(39, label, e.message);
        parseError.parseError = e;
        throw parseError;
    }
    return serialized;
};

var defaultHttpOptions = {
    includeQuery: true,
    includeExtensions: false,
    preserveHeaderCase: false,
};
var defaultHeaders = {
    accept: "*/*",
    "content-type": "application/json",
};
var defaultOptions = {
    method: "POST",
};
var fallbackHttpConfig = {
    http: defaultHttpOptions,
    headers: defaultHeaders,
    options: defaultOptions,
};
var defaultPrinter = function (ast, printer) { return printer(ast); };
function selectHttpOptionsAndBody(operation, fallbackConfig) {
    var configs = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        configs[_i - 2] = arguments[_i];
    }
    configs.unshift(fallbackConfig);
    return selectHttpOptionsAndBodyInternal.apply(void 0, tslib.__spreadArray([operation,
        defaultPrinter], configs, false));
}
function selectHttpOptionsAndBodyInternal(operation, printer) {
    var configs = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        configs[_i - 2] = arguments[_i];
    }
    var options = {};
    var http = {};
    configs.forEach(function (config) {
        options = tslib.__assign(tslib.__assign(tslib.__assign({}, options), config.options), { headers: tslib.__assign(tslib.__assign({}, options.headers), config.headers) });
        if (config.credentials) {
            options.credentials = config.credentials;
        }
        http = tslib.__assign(tslib.__assign({}, http), config.http);
    });
    if (options.headers) {
        options.headers = removeDuplicateHeaders(options.headers, http.preserveHeaderCase);
    }
    var operationName = operation.operationName, extensions = operation.extensions, variables = operation.variables, query = operation.query;
    var body = { operationName: operationName, variables: variables };
    if (http.includeExtensions)
        body.extensions = extensions;
    if (http.includeQuery)
        body.query = printer(query, utilities.print);
    return {
        options: options,
        body: body,
    };
}
function removeDuplicateHeaders(headers, preserveHeaderCase) {
    if (!preserveHeaderCase) {
        var normalizedHeaders_1 = Object.create(null);
        Object.keys(Object(headers)).forEach(function (name) {
            normalizedHeaders_1[name.toLowerCase()] = headers[name];
        });
        return normalizedHeaders_1;
    }
    var headerData = Object.create(null);
    Object.keys(Object(headers)).forEach(function (name) {
        headerData[name.toLowerCase()] = {
            originalName: name,
            value: headers[name],
        };
    });
    var normalizedHeaders = Object.create(null);
    Object.keys(headerData).forEach(function (name) {
        normalizedHeaders[headerData[name].originalName] = headerData[name].value;
    });
    return normalizedHeaders;
}

var checkFetcher = function (fetcher) {
    if (!fetcher && typeof fetch === "undefined") {
        throw globals.newInvariantError(37);
    }
};

var createSignalIfSupported = function () {
    if (typeof AbortController === "undefined")
        return { controller: false, signal: false };
    var controller = new AbortController();
    var signal = controller.signal;
    return { controller: controller, signal: signal };
};

var selectURI = function (operation, fallbackURI) {
    var context = operation.getContext();
    var contextURI = context.uri;
    if (contextURI) {
        return contextURI;
    }
    else if (typeof fallbackURI === "function") {
        return fallbackURI(operation);
    }
    else {
        return fallbackURI || "/graphql";
    }
};

function rewriteURIForGET(chosenURI, body) {
    var queryParams = [];
    var addQueryParam = function (key, value) {
        queryParams.push("".concat(key, "=").concat(encodeURIComponent(value)));
    };
    if ("query" in body) {
        addQueryParam("query", body.query);
    }
    if (body.operationName) {
        addQueryParam("operationName", body.operationName);
    }
    if (body.variables) {
        var serializedVariables = void 0;
        try {
            serializedVariables = serializeFetchParameter(body.variables, "Variables map");
        }
        catch (parseError) {
            return { parseError: parseError };
        }
        addQueryParam("variables", serializedVariables);
    }
    if (body.extensions) {
        var serializedExtensions = void 0;
        try {
            serializedExtensions = serializeFetchParameter(body.extensions, "Extensions map");
        }
        catch (parseError) {
            return { parseError: parseError };
        }
        addQueryParam("extensions", serializedExtensions);
    }
    var fragment = "", preFragment = chosenURI;
    var fragmentStart = chosenURI.indexOf("#");
    if (fragmentStart !== -1) {
        fragment = chosenURI.substr(fragmentStart);
        preFragment = chosenURI.substr(0, fragmentStart);
    }
    var queryParamsPrefix = preFragment.indexOf("?") === -1 ? "?" : "&";
    var newURI = preFragment + queryParamsPrefix + queryParams.join("&") + fragment;
    return { newURI: newURI };
}

var backupFetch = utilities.maybe(function () { return fetch; });
var createHttpLink = function (linkOptions) {
    if (linkOptions === void 0) { linkOptions = {}; }
    var _a = linkOptions.uri, uri = _a === void 0 ? "/graphql" : _a,
    preferredFetch = linkOptions.fetch, _b = linkOptions.print, print = _b === void 0 ? defaultPrinter : _b, includeExtensions = linkOptions.includeExtensions, preserveHeaderCase = linkOptions.preserveHeaderCase, useGETForQueries = linkOptions.useGETForQueries, _c = linkOptions.includeUnusedVariables, includeUnusedVariables = _c === void 0 ? false : _c, requestOptions = tslib.__rest(linkOptions, ["uri", "fetch", "print", "includeExtensions", "preserveHeaderCase", "useGETForQueries", "includeUnusedVariables"]);
    if (globalThis.__DEV__ !== false) {
        checkFetcher(preferredFetch || backupFetch);
    }
    var linkConfig = {
        http: { includeExtensions: includeExtensions, preserveHeaderCase: preserveHeaderCase },
        options: requestOptions.fetchOptions,
        credentials: requestOptions.credentials,
        headers: requestOptions.headers,
    };
    return new core.ApolloLink(function (operation) {
        var chosenURI = selectURI(operation, uri);
        var context = operation.getContext();
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
        var contextHeaders = tslib.__assign(tslib.__assign({}, clientAwarenessHeaders), context.headers);
        var contextConfig = {
            http: context.http,
            options: context.fetchOptions,
            credentials: context.credentials,
            headers: contextHeaders,
        };
        if (utilities.hasDirectives(["client"], operation.query)) {
            var transformedQuery = utilities.removeClientSetsFromDocument(operation.query);
            if (!transformedQuery) {
                return utils.fromError(new Error("HttpLink: Trying to send a client-only query to the server. To send to the server, ensure a non-client field is added to the query or set the `transformOptions.removeClientFields` option to `true`."));
            }
            operation.query = transformedQuery;
        }
        var _b = selectHttpOptionsAndBodyInternal(operation, print, fallbackHttpConfig, linkConfig, contextConfig), options = _b.options, body = _b.body;
        if (body.variables && !includeUnusedVariables) {
            body.variables = utils.filterOperationVariables(body.variables, operation.query);
        }
        var controller;
        if (!options.signal && typeof AbortController !== "undefined") {
            controller = new AbortController();
            options.signal = controller.signal;
        }
        var definitionIsMutation = function (d) {
            return d.kind === "OperationDefinition" && d.operation === "mutation";
        };
        var definitionIsSubscription = function (d) {
            return d.kind === "OperationDefinition" && d.operation === "subscription";
        };
        var isSubscription = definitionIsSubscription(utilities.getMainDefinition(operation.query));
        var hasDefer = utilities.hasDirectives(["defer"], operation.query);
        if (useGETForQueries &&
            !operation.query.definitions.some(definitionIsMutation)) {
            options.method = "GET";
        }
        if (hasDefer || isSubscription) {
            options.headers = options.headers || {};
            var acceptHeader = "multipart/mixed;";
            if (isSubscription && hasDefer) {
                globalThis.__DEV__ !== false && globals.invariant.warn(38);
            }
            if (isSubscription) {
                acceptHeader +=
                    "boundary=graphql;subscriptionSpec=1.0,application/json";
            }
            else if (hasDefer) {
                acceptHeader += "deferSpec=20220824,application/json";
            }
            options.headers.accept = acceptHeader;
        }
        if (options.method === "GET") {
            var _c = rewriteURIForGET(chosenURI, body), newURI = _c.newURI, parseError = _c.parseError;
            if (parseError) {
                return utils.fromError(parseError);
            }
            chosenURI = newURI;
        }
        else {
            try {
                options.body = serializeFetchParameter(body, "Payload");
            }
            catch (parseError) {
                return utils.fromError(parseError);
            }
        }
        return new utilities.Observable(function (observer) {
            var currentFetch = preferredFetch || utilities.maybe(function () { return fetch; }) || backupFetch;
            var observerNext = observer.next.bind(observer);
            currentFetch(chosenURI, options)
                .then(function (response) {
                var _a;
                operation.setContext({ response: response });
                var ctype = (_a = response.headers) === null || _a === void 0 ? void 0 : _a.get("content-type");
                if (ctype !== null && /^multipart\/mixed/i.test(ctype)) {
                    return readMultipartBody(response, observerNext);
                }
                else {
                    return parseAndCheckHttpResponse(operation)(response).then(observerNext);
                }
            })
                .then(function () {
                controller = undefined;
                observer.complete();
            })
                .catch(function (err) {
                controller = undefined;
                handleError(err, observer);
            });
            return function () {
                if (controller)
                    controller.abort();
            };
        });
    });
};

var HttpLink =  (function (_super) {
    tslib.__extends(HttpLink, _super);
    function HttpLink(options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, createHttpLink(options).request) || this;
        _this.options = options;
        return _this;
    }
    return HttpLink;
}(core.ApolloLink));

exports.HttpLink = HttpLink;
exports.checkFetcher = checkFetcher;
exports.createHttpLink = createHttpLink;
exports.createSignalIfSupported = createSignalIfSupported;
exports.defaultPrinter = defaultPrinter;
exports.fallbackHttpConfig = fallbackHttpConfig;
exports.parseAndCheckHttpResponse = parseAndCheckHttpResponse;
exports.rewriteURIForGET = rewriteURIForGET;
exports.selectHttpOptionsAndBody = selectHttpOptionsAndBody;
exports.selectHttpOptionsAndBodyInternal = selectHttpOptionsAndBodyInternal;
exports.selectURI = selectURI;
exports.serializeFetchParameter = serializeFetchParameter;
//# sourceMappingURL=http.cjs.map
