"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLiveQueryOperationDefinitionNode = exports.buildHTTPExecutor = void 0;
const utils_1 = require("@graphql-tools/utils");
const graphql_1 = require("graphql");
const isLiveQueryOperationDefinitionNode_js_1 = require("./isLiveQueryOperationDefinitionNode.js");
Object.defineProperty(exports, "isLiveQueryOperationDefinitionNode", { enumerable: true, get: function () { return isLiveQueryOperationDefinitionNode_js_1.isLiveQueryOperationDefinitionNode; } });
const prepareGETUrl_js_1 = require("./prepareGETUrl.js");
const value_or_promise_1 = require("value-or-promise");
const createFormDataFromVariables_js_1 = require("./createFormDataFromVariables.js");
const handleEventStreamResponse_js_1 = require("./handleEventStreamResponse.js");
const handleMultipartMixedResponse_js_1 = require("./handleMultipartMixedResponse.js");
const fetch_1 = require("@whatwg-node/fetch");
function buildHTTPExecutor(options) {
    const executor = (request) => {
        var _a, _b, _c, _d, _e, _f, _g;
        const fetchFn = (_c = (_b = (_a = request.extensions) === null || _a === void 0 ? void 0 : _a.fetch) !== null && _b !== void 0 ? _b : options === null || options === void 0 ? void 0 : options.fetch) !== null && _c !== void 0 ? _c : fetch_1.fetch;
        let controller;
        let method = ((_d = request.extensions) === null || _d === void 0 ? void 0 : _d.method) || (options === null || options === void 0 ? void 0 : options.method) || 'POST';
        const operationAst = (0, utils_1.getOperationASTFromRequest)(request);
        const operationType = operationAst.operation;
        if (((options === null || options === void 0 ? void 0 : options.useGETForQueries) || ((_e = request.extensions) === null || _e === void 0 ? void 0 : _e.useGETForQueries)) && operationType === 'query') {
            method = 'GET';
        }
        let accept = 'application/graphql-response+json, application/json, multipart/mixed';
        if (operationType === 'subscription' || (0, isLiveQueryOperationDefinitionNode_js_1.isLiveQueryOperationDefinitionNode)(operationAst)) {
            method = 'GET';
            accept = 'text/event-stream';
        }
        const endpoint = ((_f = request.extensions) === null || _f === void 0 ? void 0 : _f.endpoint) || (options === null || options === void 0 ? void 0 : options.endpoint) || '/graphql';
        const headers = Object.assign({
            accept,
        }, (typeof (options === null || options === void 0 ? void 0 : options.headers) === 'function' ? options.headers(request) : options === null || options === void 0 ? void 0 : options.headers) || {}, ((_g = request.extensions) === null || _g === void 0 ? void 0 : _g.headers) || {});
        const query = (0, graphql_1.print)(request.document);
        const requestBody = {
            query,
            variables: request.variables,
            operationName: request.operationName,
            extensions: request.extensions,
        };
        let timeoutId;
        if (options === null || options === void 0 ? void 0 : options.timeout) {
            controller = new fetch_1.AbortController();
            timeoutId = setTimeout(() => {
                if (!(controller === null || controller === void 0 ? void 0 : controller.signal.aborted)) {
                    controller === null || controller === void 0 ? void 0 : controller.abort('timeout');
                }
            }, options.timeout);
        }
        const responseDetailsForError = {};
        return new value_or_promise_1.ValueOrPromise(() => {
            switch (method) {
                case 'GET': {
                    const finalUrl = (0, prepareGETUrl_js_1.prepareGETUrl)({
                        baseUrl: endpoint,
                        ...requestBody,
                    });
                    return fetchFn(finalUrl, {
                        method: 'GET',
                        ...((options === null || options === void 0 ? void 0 : options.credentials) != null ? { credentials: options.credentials } : {}),
                        headers,
                        signal: controller === null || controller === void 0 ? void 0 : controller.signal,
                    }, request.context, request.info);
                }
                case 'POST':
                    return new value_or_promise_1.ValueOrPromise(() => (0, createFormDataFromVariables_js_1.createFormDataFromVariables)(requestBody, {
                        File: options === null || options === void 0 ? void 0 : options.File,
                        FormData: options === null || options === void 0 ? void 0 : options.FormData,
                    }))
                        .then(body => fetchFn(endpoint, {
                        method: 'POST',
                        ...((options === null || options === void 0 ? void 0 : options.credentials) != null ? { credentials: options.credentials } : {}),
                        body,
                        headers: {
                            ...headers,
                            ...(typeof body === 'string' ? { 'content-type': 'application/json' } : {}),
                        },
                        signal: controller === null || controller === void 0 ? void 0 : controller.signal,
                    }, request.context, request.info))
                        .resolve();
            }
        })
            .then((fetchResult) => {
            responseDetailsForError.status = fetchResult.status;
            responseDetailsForError.statusText = fetchResult.statusText;
            if (timeoutId != null) {
                clearTimeout(timeoutId);
            }
            // Retry should respect HTTP Errors
            if ((options === null || options === void 0 ? void 0 : options.retry) != null && !fetchResult.status.toString().startsWith('2')) {
                throw new Error(fetchResult.statusText || `HTTP Error: ${fetchResult.status}`);
            }
            const contentType = fetchResult.headers.get('content-type');
            if (contentType === null || contentType === void 0 ? void 0 : contentType.includes('text/event-stream')) {
                return (0, handleEventStreamResponse_js_1.handleEventStreamResponse)(fetchResult, controller);
            }
            else if (contentType === null || contentType === void 0 ? void 0 : contentType.includes('multipart/mixed')) {
                return (0, handleMultipartMixedResponse_js_1.handleMultipartMixedResponse)(fetchResult, controller);
            }
            return fetchResult.text();
        })
            .then(result => {
            if (typeof result === 'string') {
                if (result) {
                    try {
                        return JSON.parse(result);
                    }
                    catch (e) {
                        return {
                            errors: [
                                (0, utils_1.createGraphQLError)(`Unexpected response: ${JSON.stringify(result)}`, {
                                    extensions: {
                                        requestBody: {
                                            query,
                                            operationName: request.operationName,
                                        },
                                        responseDetails: responseDetailsForError,
                                    },
                                    originalError: e,
                                }),
                            ],
                        };
                    }
                }
            }
            else {
                return result;
            }
        })
            .catch((e) => {
            if (typeof e === 'string') {
                return {
                    errors: [
                        (0, utils_1.createGraphQLError)(e, {
                            extensions: {
                                requestBody: {
                                    query,
                                    operationName: request.operationName,
                                },
                                responseDetails: responseDetailsForError,
                            },
                        }),
                    ],
                };
            }
            else if (e.name === 'GraphQLError') {
                return {
                    errors: [e],
                };
            }
            else if (e.name === 'TypeError' && e.message === 'fetch failed') {
                return {
                    errors: [
                        (0, utils_1.createGraphQLError)(`fetch failed to ${endpoint}`, {
                            extensions: {
                                requestBody: {
                                    query,
                                    operationName: request.operationName,
                                },
                                responseDetails: responseDetailsForError,
                            },
                            originalError: e,
                        }),
                    ],
                };
            }
            else if (e.message) {
                return {
                    errors: [
                        (0, utils_1.createGraphQLError)(e.message, {
                            extensions: {
                                requestBody: {
                                    query,
                                    operationName: request.operationName,
                                },
                                responseDetails: responseDetailsForError,
                            },
                            originalError: e,
                        }),
                    ],
                };
            }
            else {
                return {
                    errors: [
                        (0, utils_1.createGraphQLError)('Unknown error', {
                            extensions: {
                                requestBody: {
                                    query,
                                    operationName: request.operationName,
                                },
                                responseDetails: responseDetailsForError,
                            },
                            originalError: e,
                        }),
                    ],
                };
            }
        })
            .resolve();
    };
    if ((options === null || options === void 0 ? void 0 : options.retry) != null) {
        return function retryExecutor(request) {
            let result;
            let attempt = 0;
            function retryAttempt() {
                attempt++;
                if (attempt > options.retry) {
                    if (result != null) {
                        return result;
                    }
                    return {
                        errors: [(0, utils_1.createGraphQLError)('No response returned from fetch')],
                    };
                }
                return new value_or_promise_1.ValueOrPromise(() => executor(request))
                    .then(res => {
                    var _a;
                    result = res;
                    if ((_a = result === null || result === void 0 ? void 0 : result.errors) === null || _a === void 0 ? void 0 : _a.length) {
                        return retryAttempt();
                    }
                    return result;
                })
                    .resolve();
            }
            return retryAttempt();
        };
    }
    return executor;
}
exports.buildHTTPExecutor = buildHTTPExecutor;
