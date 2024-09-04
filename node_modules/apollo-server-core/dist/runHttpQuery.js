"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloneObject = exports.processHTTPRequest = exports.runHttpQuery = exports.throwHttpGraphQLError = exports.isHttpQueryError = exports.HttpQueryError = void 0;
const apollo_server_env_1 = require("apollo-server-env");
const apollo_server_errors_1 = require("apollo-server-errors");
const whatwg_mimetype_1 = __importDefault(require("whatwg-mimetype"));
const cachePolicy_1 = require("./cachePolicy");
const graphqlOptions_1 = require("./graphqlOptions");
const requestPipeline_1 = require("./requestPipeline");
class HttpQueryError extends Error {
    constructor(statusCode, message, isGraphQLError = false, headers) {
        super(message);
        this.name = 'HttpQueryError';
        this.statusCode = statusCode;
        this.isGraphQLError = isGraphQLError;
        this.headers = headers;
    }
}
exports.HttpQueryError = HttpQueryError;
function isHttpQueryError(e) {
    return (e === null || e === void 0 ? void 0 : e.name) === 'HttpQueryError';
}
exports.isHttpQueryError = isHttpQueryError;
function throwHttpGraphQLError(statusCode, errors, options, extensions, headers) {
    const allHeaders = {
        'Content-Type': 'application/json',
    };
    if (headers) {
        for (const [name, value] of headers) {
            allHeaders[name] = value;
        }
    }
    const result = {
        errors: options
            ? (0, apollo_server_errors_1.formatApolloErrors)(errors, {
                debug: options.debug,
                formatter: options.formatError,
            })
            : errors,
    };
    if (extensions) {
        result.extensions = extensions;
    }
    throw new HttpQueryError(statusCode, prettyJSONStringify(result), true, allHeaders);
}
exports.throwHttpGraphQLError = throwHttpGraphQLError;
const NODE_ENV = (_a = process.env.NODE_ENV) !== null && _a !== void 0 ? _a : '';
const NON_PREFLIGHTED_CONTENT_TYPES = [
    'application/x-www-form-urlencoded',
    'multipart/form-data',
    'text/plain',
];
function preventCsrf(headers, csrfPreventionRequestHeaders) {
    const contentType = headers.get('content-type');
    if (contentType !== null) {
        const contentTypeParsed = whatwg_mimetype_1.default.parse(contentType);
        if (contentTypeParsed === null) {
            return;
        }
        if (!NON_PREFLIGHTED_CONTENT_TYPES.includes(contentTypeParsed.essence)) {
            return;
        }
    }
    if (csrfPreventionRequestHeaders.some((header) => {
        const value = headers.get(header);
        return value !== null && value.length > 0;
    })) {
        return;
    }
    throw new HttpQueryError(400, `This operation has been blocked as a potential Cross-Site Request Forgery ` +
        `(CSRF). Please either specify a 'content-type' header (with a type that ` +
        `is not one of ${NON_PREFLIGHTED_CONTENT_TYPES.join(', ')}) or provide ` +
        `a non-empty value for one of the following headers: ${csrfPreventionRequestHeaders.join(', ')}\n`);
}
async function runHttpQuery(handlerArguments, request, csrfPreventionRequestHeaders) {
    function debugFromNodeEnv(nodeEnv = NODE_ENV) {
        return nodeEnv !== 'production' && nodeEnv !== 'test';
    }
    if (csrfPreventionRequestHeaders) {
        preventCsrf(request.request.headers, csrfPreventionRequestHeaders);
    }
    let options;
    try {
        options = await (0, graphqlOptions_1.resolveGraphqlOptions)(request.options, ...handlerArguments);
    }
    catch (e) {
        return throwHttpGraphQLError(500, [e], {
            debug: debugFromNodeEnv(),
        });
    }
    if (options.debug === undefined) {
        options.debug = debugFromNodeEnv(options.nodeEnv);
    }
    if (typeof options.context === 'function') {
        try {
            options.context();
        }
        catch (e) {
            e.message = `Context creation failed: ${e.message}`;
            if (e.extensions &&
                e.extensions.code &&
                e.extensions.code !== 'INTERNAL_SERVER_ERROR') {
                return throwHttpGraphQLError(400, [e], options);
            }
            else {
                return throwHttpGraphQLError(500, [e], options);
            }
        }
    }
    const config = {
        schema: options.schema,
        schemaHash: options.schemaHash,
        logger: options.logger,
        rootValue: options.rootValue,
        context: options.context || {},
        validationRules: options.validationRules,
        executor: options.executor,
        fieldResolver: options.fieldResolver,
        cache: options.cache,
        dataSources: options.dataSources,
        dangerouslyDisableValidation: options.dangerouslyDisableValidation,
        documentStore: options.documentStore,
        persistedQueries: options.persistedQueries,
        formatError: options.formatError,
        formatResponse: options.formatResponse,
        debug: options.debug,
        plugins: options.plugins || [],
        allowBatchedHttpRequests: options.allowBatchedHttpRequests,
    };
    return processHTTPRequest(config, request);
}
exports.runHttpQuery = runHttpQuery;
async function processHTTPRequest(options, httpRequest) {
    var _a, _b;
    let requestPayload;
    switch (httpRequest.method) {
        case 'POST':
            if (!httpRequest.query ||
                typeof httpRequest.query === 'string' ||
                Buffer.isBuffer(httpRequest.query) ||
                Object.keys(httpRequest.query).length === 0) {
                throw new HttpQueryError(400, 'POST body missing, invalid Content-Type, or JSON object has no keys.');
            }
            requestPayload = httpRequest.query;
            break;
        case 'GET':
            if (!httpRequest.query || Object.keys(httpRequest.query).length === 0) {
                throw new HttpQueryError(400, 'GET query missing.');
            }
            requestPayload = httpRequest.query;
            break;
        default:
            throw new HttpQueryError(405, 'Apollo Server supports only GET/POST requests.', false, {
                Allow: 'GET, POST',
            });
    }
    options = {
        ...options,
        plugins: [checkOperationPlugin, ...options.plugins],
    };
    function buildRequestContext(request, requestIsBatched) {
        const context = cloneObject(options.context);
        return {
            logger: options.logger || console,
            schema: options.schema,
            schemaHash: options.schemaHash,
            request,
            response: {
                http: {
                    headers: new apollo_server_env_1.Headers(),
                },
            },
            context,
            cache: options.cache,
            debug: options.debug,
            metrics: {},
            overallCachePolicy: (0, cachePolicy_1.newCachePolicy)(),
            requestIsBatched,
        };
    }
    const responseInit = {
        headers: {
            'Content-Type': 'application/json',
        },
    };
    let body;
    try {
        if (Array.isArray(requestPayload)) {
            if (options.allowBatchedHttpRequests === false) {
                return throwHttpGraphQLError(400, [new Error('Operation batching disabled.')], options);
            }
            const requests = requestPayload.map((requestParams) => parseGraphQLRequest(httpRequest.request, requestParams));
            const responses = await Promise.all(requests.map(async (request) => {
                try {
                    const requestContext = buildRequestContext(request, true);
                    const response = await (0, requestPipeline_1.processGraphQLRequest)(options, requestContext);
                    if (response.http) {
                        for (const [name, value] of response.http.headers) {
                            responseInit.headers[name] = value;
                        }
                        if (response.http.status) {
                            responseInit.status = response.http.status;
                        }
                    }
                    return response;
                }
                catch (error) {
                    return {
                        errors: (0, apollo_server_errors_1.formatApolloErrors)([error], options),
                    };
                }
            }));
            body = prettyJSONStringify(responses.map(serializeGraphQLResponse));
        }
        else {
            const request = parseGraphQLRequest(httpRequest.request, requestPayload);
            const requestContext = buildRequestContext(request, false);
            const response = await (0, requestPipeline_1.processGraphQLRequest)(options, requestContext);
            if (response.errors && typeof response.data === 'undefined') {
                return throwHttpGraphQLError(((_a = response.http) === null || _a === void 0 ? void 0 : _a.status) || 400, response.errors, undefined, response.extensions, (_b = response.http) === null || _b === void 0 ? void 0 : _b.headers);
            }
            if (response.http) {
                for (const [name, value] of response.http.headers) {
                    responseInit.headers[name] = value;
                }
                if (response.http.status) {
                    responseInit.status = response.http.status;
                }
            }
            body = prettyJSONStringify(serializeGraphQLResponse(response));
        }
    }
    catch (error) {
        if (error instanceof HttpQueryError) {
            throw error;
        }
        return throwHttpGraphQLError(500, [error], options);
    }
    responseInit.headers['Content-Length'] = Buffer.byteLength(body, 'utf8').toString();
    return {
        graphqlResponse: body,
        responseInit,
    };
}
exports.processHTTPRequest = processHTTPRequest;
function parseGraphQLRequest(httpRequest, requestParams) {
    let queryString = requestParams.query;
    let extensions = requestParams.extensions;
    if (typeof extensions === 'string' && extensions !== '') {
        try {
            extensions = JSON.parse(extensions);
        }
        catch (error) {
            throw new HttpQueryError(400, 'Extensions are invalid JSON.');
        }
    }
    if (queryString && typeof queryString !== 'string') {
        if (queryString.kind === 'Document') {
            throw new HttpQueryError(400, "GraphQL queries must be strings. It looks like you're sending the " +
                'internal graphql-js representation of a parsed query in your ' +
                'request instead of a request in the GraphQL query language. You ' +
                'can convert an AST to a string using the `print` function from ' +
                '`graphql`, or use a client like `apollo-client` which converts ' +
                'the internal representation to a string for you.');
        }
        else {
            throw new HttpQueryError(400, 'GraphQL queries must be strings.');
        }
    }
    const operationName = requestParams.operationName;
    let variables = requestParams.variables;
    if (typeof variables === 'string' && variables !== '') {
        try {
            variables = JSON.parse(variables);
        }
        catch (error) {
            throw new HttpQueryError(400, 'Variables are invalid JSON.');
        }
    }
    return {
        query: queryString,
        operationName,
        variables,
        extensions,
        http: httpRequest,
    };
}
const checkOperationPlugin = {
    async requestDidStart() {
        return {
            async didResolveOperation({ request, operation }) {
                if (!request.http)
                    return;
                if (request.http.method === 'GET' && operation.operation !== 'query') {
                    throw new HttpQueryError(405, `GET supports only query operation`, false, {
                        Allow: 'POST',
                    });
                }
            },
        };
    },
};
function serializeGraphQLResponse(response) {
    return {
        errors: response.errors,
        data: response.data,
        extensions: response.extensions,
    };
}
function prettyJSONStringify(value) {
    return JSON.stringify(value) + '\n';
}
function cloneObject(object) {
    return Object.assign(Object.create(Object.getPrototypeOf(object)), object);
}
exports.cloneObject = cloneObject;
//# sourceMappingURL=runHttpQuery.js.map