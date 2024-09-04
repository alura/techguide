"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const type_1 = require("graphql/type");
const schemaInstrumentation_1 = require("./schemaInstrumentation");
const utils_keyvaluecache_1 = require("@apollo/utils.keyvaluecache");
const dispatcher_1 = require("./dispatcher");
const graphql_1 = require("graphql");
const cachePolicy_1 = require("../cachePolicy");
async function pluginTestHarness({ pluginInstance, schema, logger, graphqlRequest, overallCachePolicy, executor, context = Object.create(null), }) {
    var _a, _b;
    if (!schema) {
        schema = new type_1.GraphQLSchema({
            query: new type_1.GraphQLObjectType({
                name: 'RootQueryType',
                fields: {
                    hello: {
                        type: type_1.GraphQLString,
                        resolve() {
                            return 'hello world';
                        },
                    },
                },
            }),
        });
    }
    let serverListener;
    if (typeof pluginInstance.serverWillStart === 'function') {
        const maybeServerListener = await pluginInstance.serverWillStart({
            logger: logger || console,
            schema,
            schemaHash: 'deprecated',
            serverlessFramework: false,
            apollo: {
                key: 'some-key',
                graphRef: 'graph@current',
            },
        });
        if (maybeServerListener === null || maybeServerListener === void 0 ? void 0 : maybeServerListener.serverWillStop) {
            serverListener = maybeServerListener;
        }
    }
    const requestContext = {
        logger: logger || console,
        schema,
        schemaHash: 'deprecated',
        request: graphqlRequest,
        metrics: Object.create(null),
        source: graphqlRequest.query,
        cache: new utils_keyvaluecache_1.InMemoryLRUCache(),
        context,
        overallCachePolicy: (0, cachePolicy_1.newCachePolicy)(),
        requestIsBatched: false,
    };
    if (requestContext.source === undefined) {
        throw new Error('No source provided for test');
    }
    if (overallCachePolicy) {
        requestContext.overallCachePolicy.replace(overallCachePolicy);
    }
    if (typeof pluginInstance.requestDidStart !== 'function') {
        throw new Error('This test harness expects this to be defined.');
    }
    const listener = await pluginInstance.requestDidStart(requestContext);
    const dispatcher = new dispatcher_1.Dispatcher(listener ? [listener] : []);
    const executionListeners = [];
    await dispatcher.invokeHook('didResolveSource', requestContext);
    if (!requestContext.document) {
        await dispatcher.invokeDidStartHook('parsingDidStart', requestContext);
        try {
            requestContext.document = (0, graphql_1.parse)(requestContext.source, undefined);
        }
        catch (syntaxError) {
            const errorOrErrors = syntaxError;
            requestContext.errors = Array.isArray(errorOrErrors)
                ? errorOrErrors
                : [errorOrErrors];
            await dispatcher.invokeHook('didEncounterErrors', requestContext);
            await dispatcher.invokeHook('willSendResponse', requestContext);
            return requestContext;
        }
        const validationDidEnd = await dispatcher.invokeDidStartHook('validationDidStart', requestContext);
        const validationErrors = (0, graphql_1.validate)(requestContext.schema, requestContext.document);
        if (validationErrors.length !== 0) {
            requestContext.errors = validationErrors;
            validationDidEnd(validationErrors);
            await dispatcher.invokeHook('didEncounterErrors', requestContext);
            await dispatcher.invokeHook('willSendResponse', requestContext);
            return requestContext;
        }
        else {
            validationDidEnd();
        }
    }
    const operation = (0, graphql_1.getOperationAST)(requestContext.document, requestContext.request.operationName);
    requestContext.operation = operation || undefined;
    requestContext.operationName = ((_a = operation === null || operation === void 0 ? void 0 : operation.name) === null || _a === void 0 ? void 0 : _a.value) || null;
    await dispatcher.invokeHook('didResolveOperation', requestContext);
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
        (0, schemaInstrumentation_1.enablePluginsForSchemaResolvers)(schema);
    }
    try {
        requestContext.response = await executor(requestContext);
        await executionDispatcher.invokeHook('executionDidEnd');
    }
    catch (executionErr) {
        await executionDispatcher.invokeHook('executionDidEnd', executionErr);
    }
    await dispatcher.invokeHook('willSendResponse', requestContext);
    await ((_b = serverListener === null || serverListener === void 0 ? void 0 : serverListener.serverWillStop) === null || _b === void 0 ? void 0 : _b.call(serverListener));
    return requestContext;
}
exports.default = pluginTestHarness;
//# sourceMappingURL=pluginTestHarness.js.map