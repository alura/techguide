'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var relayRuntime = require('relay-runtime');
var tslib = require('tslib');
var utilities = require('../..');
var utils = require('../../../link/utils');
var errors = require('../../../errors');
var core = require('../../../core');

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

function generateOptionsForMultipartSubscription(headers) {
    var options = tslib.__assign(tslib.__assign({}, fallbackHttpConfig.options), { headers: tslib.__assign(tslib.__assign(tslib.__assign({}, (headers || {})), fallbackHttpConfig.headers), { accept: "multipart/mixed;boundary=graphql;subscriptionSpec=1.0,application/json" }) });
    return options;
}

var backupFetch = utilities.maybe(function () { return fetch; });
function createFetchMultipartSubscription(uri, _a) {
    var _b = _a === void 0 ? {} : _a, preferredFetch = _b.fetch, headers = _b.headers;
    return function fetchMultipartSubscription(operation, variables) {
        var body = {
            operationName: operation.name,
            variables: variables,
            query: operation.text || "",
        };
        var options = generateOptionsForMultipartSubscription(headers || {});
        return relayRuntime.Observable.create(function (sink) {
            try {
                options.body = core.serializeFetchParameter(body, "Payload");
            }
            catch (parseError) {
                sink.error(parseError);
            }
            var currentFetch = preferredFetch || utilities.maybe(function () { return fetch; }) || backupFetch;
            var observerNext = sink.next.bind(sink);
            currentFetch(uri, options)
                .then(function (response) {
                var _a;
                var ctype = (_a = response.headers) === null || _a === void 0 ? void 0 : _a.get("content-type");
                if (ctype !== null && /^multipart\/mixed/i.test(ctype)) {
                    return readMultipartBody(response, observerNext);
                }
                sink.error(new Error("Expected multipart response"));
            })
                .then(function () {
                sink.complete();
            })
                .catch(function (err) {
                handleError(err, sink);
            });
        });
    };
}

exports.createFetchMultipartSubscription = createFetchMultipartSubscription;
//# sourceMappingURL=relay.cjs.map
