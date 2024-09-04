import { createGraphQLError, getOperationASTFromRequest, } from '@graphql-tools/utils';
import { print } from 'graphql';
import { isLiveQueryOperationDefinitionNode } from './isLiveQueryOperationDefinitionNode.js';
import { prepareGETUrl } from './prepareGETUrl.js';
import { ValueOrPromise } from 'value-or-promise';
import { createFormDataFromVariables } from './createFormDataFromVariables.js';
import { handleEventStreamResponse } from './handleEventStreamResponse.js';
import { handleMultipartMixedResponse } from './handleMultipartMixedResponse.js';
import { fetch as defaultFetch, AbortController } from '@whatwg-node/fetch';
export function buildHTTPExecutor(options) {
    const executor = (request) => {
        var _a, _b, _c, _d, _e, _f, _g;
        const fetchFn = (_c = (_b = (_a = request.extensions) === null || _a === void 0 ? void 0 : _a.fetch) !== null && _b !== void 0 ? _b : options === null || options === void 0 ? void 0 : options.fetch) !== null && _c !== void 0 ? _c : defaultFetch;
        let controller;
        let method = ((_d = request.extensions) === null || _d === void 0 ? void 0 : _d.method) || (options === null || options === void 0 ? void 0 : options.method) || 'POST';
        const operationAst = getOperationASTFromRequest(request);
        const operationType = operationAst.operation;
        if (((options === null || options === void 0 ? void 0 : options.useGETForQueries) || ((_e = request.extensions) === null || _e === void 0 ? void 0 : _e.useGETForQueries)) && operationType === 'query') {
            method = 'GET';
        }
        let accept = 'application/graphql-response+json, application/json, multipart/mixed';
        if (operationType === 'subscription' || isLiveQueryOperationDefinitionNode(operationAst)) {
            method = 'GET';
            accept = 'text/event-stream';
        }
        const endpoint = ((_f = request.extensions) === null || _f === void 0 ? void 0 : _f.endpoint) || (options === null || options === void 0 ? void 0 : options.endpoint) || '/graphql';
        const headers = Object.assign({
            accept,
        }, (typeof (options === null || options === void 0 ? void 0 : options.headers) === 'function' ? options.headers(request) : options === null || options === void 0 ? void 0 : options.headers) || {}, ((_g = request.extensions) === null || _g === void 0 ? void 0 : _g.headers) || {});
        const query = print(request.document);
        const requestBody = {
            query,
            variables: request.variables,
            operationName: request.operationName,
            extensions: request.extensions,
        };
        let timeoutId;
        if (options === null || options === void 0 ? void 0 : options.timeout) {
            controller = new AbortController();
            timeoutId = setTimeout(() => {
                if (!(controller === null || controller === void 0 ? void 0 : controller.signal.aborted)) {
                    controller === null || controller === void 0 ? void 0 : controller.abort('timeout');
                }
            }, options.timeout);
        }
        const responseDetailsForError = {};
        return new ValueOrPromise(() => {
            switch (method) {
                case 'GET': {
                    const finalUrl = prepareGETUrl({
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
                    return new ValueOrPromise(() => createFormDataFromVariables(requestBody, {
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
                return handleEventStreamResponse(fetchResult, controller);
            }
            else if (contentType === null || contentType === void 0 ? void 0 : contentType.includes('multipart/mixed')) {
                return handleMultipartMixedResponse(fetchResult, controller);
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
                                createGraphQLError(`Unexpected response: ${JSON.stringify(result)}`, {
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
                        createGraphQLError(e, {
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
                        createGraphQLError(`fetch failed to ${endpoint}`, {
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
                        createGraphQLError(e.message, {
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
                        createGraphQLError('Unknown error', {
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
                        errors: [createGraphQLError('No response returned from fetch')],
                    };
                }
                return new ValueOrPromise(() => executor(request))
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
export { isLiveQueryOperationDefinitionNode };
