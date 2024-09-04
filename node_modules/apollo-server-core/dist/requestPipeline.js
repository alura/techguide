"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processGraphQLRequest = exports.APQ_CACHE_PREFIX = void 0;
const graphql_1 = require("graphql");
const schemaInstrumentation_1 = require("./utils/schemaInstrumentation");
const apollo_server_errors_1 = require("apollo-server-errors");
const dispatcher_1 = require("./utils/dispatcher");
const utils_keyvaluecache_1 = require("@apollo/utils.keyvaluecache");
const createSHA_1 = __importDefault(require("./utils/createSHA"));
const runHttpQuery_1 = require("./runHttpQuery");
const apollo_server_env_1 = require("apollo-server-env");
exports.APQ_CACHE_PREFIX = 'apq:';
function computeQueryHash(query) {
    return (0, createSHA_1.default)('sha256').update(query).digest('hex');
}
function isBadUserInputGraphQLError(error) {
    var _a;
    return (((_a = error.nodes) === null || _a === void 0 ? void 0 : _a.length) === 1 &&
        error.nodes[0].kind === graphql_1.Kind.VARIABLE_DEFINITION &&
        (error.message.startsWith(`Variable "$${error.nodes[0].variable.name.value}" got invalid value `) ||
            error.message.startsWith(`Variable "$${error.nodes[0].variable.name.value}" of required type `) ||
            error.message.startsWith(`Variable "$${error.nodes[0].variable.name.value}" of non-null type `)));
}
async function processGraphQLRequest(config, requestContext) {
    var _a, _b;
    const logger = requestContext.logger || console;
    const metrics = (requestContext.metrics =
        requestContext.metrics || Object.create(null));
    const dispatcher = await initializeRequestListenerDispatcher();
    await initializeDataSources();
    const request = requestContext.request;
    let { query, extensions } = request;
    let queryHash;
    let persistedQueryCache;
    metrics.persistedQueryHit = false;
    metrics.persistedQueryRegister = false;
    if (extensions === null || extensions === void 0 ? void 0 : extensions.persistedQuery) {
        if (!config.persistedQueries || !config.persistedQueries.cache) {
            return await sendErrorResponse(new apollo_server_errors_1.PersistedQueryNotSupportedError());
        }
        else if (extensions.persistedQuery.version !== 1) {
            return await sendErrorResponse(new graphql_1.GraphQLError('Unsupported persisted query version'));
        }
        persistedQueryCache = config.persistedQueries.cache;
        if (!(persistedQueryCache instanceof utils_keyvaluecache_1.PrefixingKeyValueCache)) {
            persistedQueryCache = new utils_keyvaluecache_1.PrefixingKeyValueCache(persistedQueryCache, exports.APQ_CACHE_PREFIX);
        }
        queryHash = extensions.persistedQuery.sha256Hash;
        if (query === undefined) {
            query = await persistedQueryCache.get(queryHash);
            if (query) {
                metrics.persistedQueryHit = true;
            }
            else {
                return await sendErrorResponse(new apollo_server_errors_1.PersistedQueryNotFoundError());
            }
        }
        else {
            const computedQueryHash = computeQueryHash(query);
            if (queryHash !== computedQueryHash) {
                return await sendErrorResponse(new graphql_1.GraphQLError('provided sha does not match query'));
            }
            metrics.persistedQueryRegister = true;
        }
    }
    else if (query) {
        queryHash = computeQueryHash(query);
    }
    else {
        return await sendErrorResponse(new graphql_1.GraphQLError('GraphQL operations must contain a non-empty `query` or a `persistedQuery` extension.'));
    }
    requestContext.queryHash = queryHash;
    requestContext.source = query;
    await dispatcher.invokeHook('didResolveSource', requestContext);
    if (config.documentStore) {
        try {
            requestContext.document = await config.documentStore.get(queryHash);
        }
        catch (err) {
            logger.warn('An error occurred while attempting to read from the documentStore. ' +
                (err === null || err === void 0 ? void 0 : err.message) || err);
        }
    }
    if (!requestContext.document) {
        const parsingDidEnd = await dispatcher.invokeDidStartHook('parsingDidStart', requestContext);
        try {
            requestContext.document = parse(query, config.parseOptions);
            await parsingDidEnd();
        }
        catch (syntaxError) {
            await parsingDidEnd(syntaxError);
            return await sendErrorResponse(syntaxError, apollo_server_errors_1.SyntaxError);
        }
        if (config.dangerouslyDisableValidation !== true) {
            const validationDidEnd = await dispatcher.invokeDidStartHook('validationDidStart', requestContext);
            const validationErrors = validate(requestContext.document);
            if (validationErrors.length === 0) {
                await validationDidEnd();
            }
            else {
                await validationDidEnd(validationErrors);
                return await sendErrorResponse(validationErrors, apollo_server_errors_1.ValidationError);
            }
        }
        if (config.documentStore) {
            Promise.resolve(config.documentStore.set(queryHash, requestContext.document)).catch((err) => logger.warn('Could not store validated document. ' + (err === null || err === void 0 ? void 0 : err.message) || err));
        }
    }
    const operation = (0, graphql_1.getOperationAST)(requestContext.document, request.operationName);
    requestContext.operation = operation || undefined;
    requestContext.operationName = ((_a = operation === null || operation === void 0 ? void 0 : operation.name) === null || _a === void 0 ? void 0 : _a.value) || null;
    try {
        await dispatcher.invokeHook('didResolveOperation', requestContext);
    }
    catch (err) {
        return await sendErrorResponse(err);
    }
    if (metrics.persistedQueryRegister && persistedQueryCache) {
        Promise.resolve(persistedQueryCache.set(queryHash, query, config.persistedQueries &&
            typeof config.persistedQueries.ttl !== 'undefined'
            ? {
                ttl: config.persistedQueries.ttl,
            }
            : Object.create(null))).catch(logger.warn);
    }
    let response = await dispatcher.invokeHooksUntilNonNull('responseForOperation', requestContext);
    if (response == null) {
        const executionListeners = [];
        (await dispatcher.invokeHook('executionDidStart', requestContext)).forEach((executionListener) => {
            if (executionListener) {
                executionListeners.push(executionListener);
            }
        });
        executionListeners.reverse();
        const executionDispatcher = new dispatcher_1.Dispatcher(executionListeners);
        if (executionDispatcher.hasHook('willResolveField')) {
            const invokeWillResolveField = (...args) => executionDispatcher.invokeSyncDidStartHook('willResolveField', ...args);
            Object.defineProperty(requestContext.context, schemaInstrumentation_1.symbolExecutionDispatcherWillResolveField, { value: invokeWillResolveField });
            if (config.fieldResolver) {
                Object.defineProperty(requestContext.context, schemaInstrumentation_1.symbolUserFieldResolver, {
                    value: config.fieldResolver,
                });
            }
            (0, schemaInstrumentation_1.enablePluginsForSchemaResolvers)(config.schema);
        }
        try {
            const result = await execute(requestContext);
            const resultErrors = (_b = result.errors) === null || _b === void 0 ? void 0 : _b.map((e) => {
                if (isBadUserInputGraphQLError(e)) {
                    return (0, apollo_server_errors_1.fromGraphQLError)(e, {
                        errorClass: apollo_server_errors_1.UserInputError,
                    });
                }
                return e;
            });
            if (resultErrors) {
                await didEncounterErrors(resultErrors);
            }
            response = {
                ...result,
                errors: resultErrors ? formatErrors(resultErrors) : undefined,
            };
            await executionDispatcher.invokeHook('executionDidEnd');
        }
        catch (executionError) {
            await executionDispatcher.invokeHook('executionDidEnd', executionError);
            return await sendErrorResponse(executionError);
        }
    }
    if (config.formatResponse) {
        const formattedResponse = config.formatResponse(response, requestContext);
        if (formattedResponse != null) {
            response = formattedResponse;
        }
    }
    return sendResponse(response);
    function parse(query, parseOptions) {
        return (0, graphql_1.parse)(query, parseOptions);
    }
    function validate(document) {
        let rules = graphql_1.specifiedRules;
        if (config.validationRules) {
            rules = rules.concat(config.validationRules);
        }
        return (0, graphql_1.validate)(config.schema, document, rules);
    }
    async function execute(requestContext) {
        const { request, document } = requestContext;
        const executionArgs = {
            schema: config.schema,
            document,
            rootValue: typeof config.rootValue === 'function'
                ? config.rootValue(document)
                : config.rootValue,
            contextValue: requestContext.context,
            variableValues: request.variables,
            operationName: request.operationName,
            fieldResolver: config.fieldResolver,
        };
        if (config.executor) {
            return await config.executor(requestContext);
        }
        else {
            return await (0, graphql_1.execute)(executionArgs);
        }
    }
    async function sendResponse(response) {
        requestContext.response = {
            ...requestContext.response,
            errors: response.errors,
            data: response.data,
            extensions: response.extensions,
        };
        if (response.http) {
            if (!requestContext.response.http) {
                requestContext.response.http = {
                    headers: new apollo_server_env_1.Headers(),
                };
            }
            if (response.http.status) {
                requestContext.response.http.status = response.http.status;
            }
            for (const [name, value] of response.http.headers) {
                requestContext.response.http.headers.set(name, value);
            }
        }
        await dispatcher.invokeHook('willSendResponse', requestContext);
        return requestContext.response;
    }
    async function didEncounterErrors(errors) {
        requestContext.errors = errors;
        return await dispatcher.invokeHook('didEncounterErrors', requestContext);
    }
    async function sendErrorResponse(errorOrErrors, errorClass) {
        const errors = Array.isArray(errorOrErrors)
            ? errorOrErrors
            : [errorOrErrors];
        await didEncounterErrors(errors);
        const response = {
            errors: formatErrors(errors.map((err) => err instanceof apollo_server_errors_1.ApolloError && !errorClass
                ? err
                : (0, apollo_server_errors_1.fromGraphQLError)(err, errorClass && {
                    errorClass,
                }))),
        };
        if (errors.every((err) => err instanceof apollo_server_errors_1.PersistedQueryNotSupportedError ||
            err instanceof apollo_server_errors_1.PersistedQueryNotFoundError)) {
            response.http = {
                status: 200,
                headers: new apollo_server_env_1.Headers({
                    'Cache-Control': 'private, no-cache, must-revalidate',
                }),
            };
        }
        else if (errors.length === 1 && errors[0] instanceof runHttpQuery_1.HttpQueryError) {
            response.http = {
                status: errors[0].statusCode,
                headers: new apollo_server_env_1.Headers(errors[0].headers),
            };
        }
        return sendResponse(response);
    }
    function formatErrors(errors) {
        return (0, apollo_server_errors_1.formatApolloErrors)(errors, {
            formatter: config.formatError,
            debug: requestContext.debug,
        });
    }
    async function initializeRequestListenerDispatcher() {
        const requestListeners = [];
        if (config.plugins) {
            for (const plugin of config.plugins) {
                if (!plugin.requestDidStart)
                    continue;
                const listener = await plugin.requestDidStart(requestContext);
                if (listener) {
                    requestListeners.push(listener);
                }
            }
        }
        return new dispatcher_1.Dispatcher(requestListeners);
    }
    async function initializeDataSources() {
        if (config.dataSources) {
            const context = requestContext.context;
            const dataSources = config.dataSources();
            const initializers = [];
            for (const dataSource of Object.values(dataSources)) {
                if (dataSource.initialize) {
                    initializers.push(dataSource.initialize({
                        context,
                        cache: requestContext.cache,
                    }));
                }
            }
            await Promise.all(initializers);
            if ('dataSources' in context) {
                throw new Error('Please use the dataSources config option instead of putting dataSources on the context yourself.');
            }
            context.dataSources = dataSources;
        }
    }
}
exports.processGraphQLRequest = processGraphQLRequest;
//# sourceMappingURL=requestPipeline.js.map