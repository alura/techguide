"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isImplicitlyInstallablePlugin = exports.ApolloServerBase = void 0;
const mock_1 = require("@graphql-tools/mock");
const schema_1 = require("@graphql-tools/schema");
const loglevel_1 = __importDefault(require("loglevel"));
const graphql_1 = require("graphql");
const resolvable_1 = __importDefault(require("@josephg/resolvable"));
const utils_keyvaluecache_1 = require("@apollo/utils.keyvaluecache");
const schemaHash_1 = require("./utils/schemaHash");
const requestPipeline_1 = require("./requestPipeline");
const apollo_server_env_1 = require("apollo-server-env");
const apollo_tools_1 = require("@apollographql/apollo-tools");
const runHttpQuery_1 = require("./runHttpQuery");
const isNodeLike_1 = __importDefault(require("./utils/isNodeLike"));
const determineApolloConfig_1 = require("./determineApolloConfig");
const plugin_1 = require("./plugin");
const internalPlugin_1 = require("./internalPlugin");
const cachePolicy_1 = require("./cachePolicy");
const schemaManager_1 = require("./utils/schemaManager");
const uuid = __importStar(require("uuid"));
const UnboundedCache_1 = require("./utils/UnboundedCache");
const NoIntrospection = (context) => ({
    Field(node) {
        if (node.name.value === '__schema' || node.name.value === '__type') {
            context.reportError(new graphql_1.GraphQLError('GraphQL introspection is not allowed by Apollo Server, but the query contained __schema or __type. To enable introspection, pass introspection: true to ApolloServer in production', [node]));
        }
    },
});
class UnreachableCaseError extends Error {
    constructor(val) {
        super(`Unreachable case: ${val}`);
    }
}
const recommendedCsrfPreventionRequestHeaders = [
    'x-apollo-operation-name',
    'apollo-require-preflight',
];
class ApolloServerBase {
    constructor(config) {
        var _a, _b;
        this.graphqlPath = '/graphql';
        this.requestOptions = Object.create(null);
        this.plugins = [];
        this.toDispose = new Set();
        this.toDisposeLast = new Set();
        this.drainServers = null;
        this.landingPage = null;
        if (!config)
            throw new Error('ApolloServer requires options.');
        this.config = {
            ...config,
            nodeEnv: (_a = config.nodeEnv) !== null && _a !== void 0 ? _a : process.env.NODE_ENV,
        };
        const { context, resolvers, schema, modules, typeDefs, parseOptions = {}, introspection, plugins, gateway, apollo, stopOnTerminationSignals, mocks, mockEntireSchema, documentStore, csrfPrevention, ...requestOptions } = this.config;
        if (config.logger) {
            this.logger = config.logger;
        }
        else {
            const loglevelLogger = loglevel_1.default.getLogger('apollo-server');
            if (this.config.debug === true) {
                loglevelLogger.setLevel(loglevel_1.default.levels.DEBUG);
            }
            else {
                loglevelLogger.setLevel(loglevel_1.default.levels.INFO);
            }
            this.logger = loglevelLogger;
        }
        this.apolloConfig = (0, determineApolloConfig_1.determineApolloConfig)(apollo, this.logger);
        if (gateway && (modules || schema || typeDefs || resolvers)) {
            throw new Error('Cannot define both `gateway` and any of: `modules`, `schema`, `typeDefs`, or `resolvers`');
        }
        this.parseOptions = parseOptions;
        this.context = context;
        this.csrfPreventionRequestHeaders =
            csrfPrevention === true
                ? recommendedCsrfPreventionRequestHeaders
                : csrfPrevention === false
                    ? null
                    : csrfPrevention === undefined
                        ? null
                        : (_b = csrfPrevention.requestHeaders) !== null && _b !== void 0 ? _b : recommendedCsrfPreventionRequestHeaders;
        const isDev = this.config.nodeEnv !== 'production';
        this.stopOnTerminationSignals =
            typeof stopOnTerminationSignals === 'boolean'
                ? stopOnTerminationSignals
                : isNodeLike_1.default &&
                    this.config.nodeEnv !== 'test' &&
                    !this.serverlessFramework();
        if ((typeof introspection === 'boolean' && !introspection) ||
            (introspection === undefined && !isDev)) {
            const noIntro = [NoIntrospection];
            requestOptions.validationRules = requestOptions.validationRules
                ? requestOptions.validationRules.concat(noIntro)
                : noIntro;
        }
        if (requestOptions.cache === 'bounded') {
            requestOptions.cache = new utils_keyvaluecache_1.InMemoryLRUCache();
        }
        if (!requestOptions.cache) {
            requestOptions.cache = new UnboundedCache_1.UnboundedCache();
            if (!isDev &&
                (requestOptions.persistedQueries === undefined ||
                    (requestOptions.persistedQueries &&
                        !requestOptions.persistedQueries.cache))) {
                this.logger.warn('Persisted queries are enabled and are using an unbounded cache. Your server' +
                    ' is vulnerable to denial of service attacks via memory exhaustion. ' +
                    'Set `cache: "bounded"` or `persistedQueries: false` in your ApolloServer ' +
                    'constructor, or see https://go.apollo.dev/s/cache-backends for other alternatives.');
            }
        }
        if (requestOptions.persistedQueries !== false) {
            const { cache: apqCache = requestOptions.cache, ...apqOtherOptions } = requestOptions.persistedQueries || Object.create(null);
            requestOptions.persistedQueries = {
                cache: new utils_keyvaluecache_1.PrefixingKeyValueCache(apqCache, requestPipeline_1.APQ_CACHE_PREFIX),
                ...apqOtherOptions,
            };
        }
        else {
            delete requestOptions.persistedQueries;
        }
        this.requestOptions = requestOptions;
        this.ensurePluginInstantiation(plugins, isDev);
        if (gateway) {
            this.state = {
                phase: 'initialized',
                schemaManager: new schemaManager_1.SchemaManager({
                    gateway,
                    apolloConfig: this.apolloConfig,
                    schemaDerivedDataProvider: (schema) => this.generateSchemaDerivedData(schema),
                    logger: this.logger,
                }),
            };
        }
        else {
            this.state = {
                phase: 'initialized',
                schemaManager: new schemaManager_1.SchemaManager({
                    apiSchema: this.maybeAddMocksToConstructedSchema(this.constructSchema()),
                    schemaDerivedDataProvider: (schema) => this.generateSchemaDerivedData(schema),
                    logger: this.logger,
                }),
            };
        }
        if (this.serverlessFramework()) {
            this._start().catch((e) => this.logStartupError(e));
        }
    }
    async start() {
        if (this.serverlessFramework()) {
            throw new Error('When using an ApolloServer subclass from a serverless framework ' +
                "package, you don't need to call start(); just call createHandler().");
        }
        return await this._start();
    }
    async _start() {
        var _a;
        if (this.state.phase !== 'initialized') {
            throw new Error(`called start() with surprising state ${this.state.phase}`);
        }
        const schemaManager = this.state.schemaManager;
        const barrier = (0, resolvable_1.default)();
        this.state = {
            phase: 'starting',
            barrier,
            schemaManager,
        };
        try {
            const executor = await schemaManager.start();
            this.toDispose.add(async () => {
                await schemaManager.stop();
            });
            if (executor) {
                this.requestOptions.executor = executor;
            }
            const schemaDerivedData = schemaManager.getSchemaDerivedData();
            const service = {
                logger: this.logger,
                schema: schemaDerivedData.schema,
                schemaHash: schemaDerivedData.schemaHash,
                apollo: this.apolloConfig,
                serverlessFramework: this.serverlessFramework(),
            };
            if ((_a = this.requestOptions.persistedQueries) === null || _a === void 0 ? void 0 : _a.cache) {
                service.persistedQueries = {
                    cache: this.requestOptions.persistedQueries.cache,
                };
            }
            const taggedServerListeners = (await Promise.all(this.plugins.map(async (plugin) => ({
                serverListener: plugin.serverWillStart && (await plugin.serverWillStart(service)),
                installedImplicitly: isImplicitlyInstallablePlugin(plugin) &&
                    plugin.__internal_installed_implicitly__,
            })))).filter((maybeTaggedServerListener) => typeof maybeTaggedServerListener.serverListener === 'object');
            taggedServerListeners.forEach(({ serverListener: { schemaDidLoadOrUpdate } }) => {
                if (schemaDidLoadOrUpdate) {
                    try {
                        schemaManager.onSchemaLoadOrUpdate(schemaDidLoadOrUpdate);
                    }
                    catch (e) {
                        if (e instanceof schemaManager_1.GatewayIsTooOldError) {
                            throw new Error([
                                `One of your plugins uses the 'schemaDidLoadOrUpdate' hook,`,
                                `but your gateway version is too old to support this hook.`,
                                `Please update your version of @apollo/gateway to at least 0.35.0.`,
                            ].join(' '));
                        }
                        throw e;
                    }
                }
            });
            const serverWillStops = taggedServerListeners.flatMap((l) => l.serverListener.serverWillStop
                ? [l.serverListener.serverWillStop]
                : []);
            if (serverWillStops.length) {
                this.toDispose.add(async () => {
                    await Promise.all(serverWillStops.map((serverWillStop) => serverWillStop()));
                });
            }
            const drainServerCallbacks = taggedServerListeners.flatMap((l) => l.serverListener.drainServer ? [l.serverListener.drainServer] : []);
            if (drainServerCallbacks.length) {
                this.drainServers = async () => {
                    await Promise.all(drainServerCallbacks.map((drainServer) => drainServer()));
                };
            }
            let taggedServerListenersWithRenderLandingPage = taggedServerListeners.filter((l) => l.serverListener.renderLandingPage);
            if (taggedServerListenersWithRenderLandingPage.length > 1) {
                taggedServerListenersWithRenderLandingPage =
                    taggedServerListenersWithRenderLandingPage.filter((l) => !l.installedImplicitly);
            }
            if (taggedServerListenersWithRenderLandingPage.length > 1) {
                throw Error('Only one plugin can implement renderLandingPage.');
            }
            else if (taggedServerListenersWithRenderLandingPage.length) {
                this.landingPage = await taggedServerListenersWithRenderLandingPage[0]
                    .serverListener.renderLandingPage();
            }
            else {
                this.landingPage = null;
            }
            this.state = {
                phase: 'started',
                schemaManager,
            };
            this.maybeRegisterTerminationSignalHandlers(['SIGINT', 'SIGTERM']);
        }
        catch (error) {
            this.state = { phase: 'failed to start', error: error };
            throw error;
        }
        finally {
            barrier.resolve();
        }
    }
    maybeRegisterTerminationSignalHandlers(signals) {
        if (!this.stopOnTerminationSignals) {
            return;
        }
        let receivedSignal = false;
        const signalHandler = async (signal) => {
            if (receivedSignal) {
                return;
            }
            receivedSignal = true;
            try {
                await this.stop();
            }
            catch (e) {
                this.logger.error(`stop() threw during ${signal} shutdown`);
                this.logger.error(e);
                process.exit(1);
            }
            process.kill(process.pid, signal);
        };
        signals.forEach((signal) => {
            process.on(signal, signalHandler);
            this.toDisposeLast.add(async () => {
                process.removeListener(signal, signalHandler);
            });
        });
    }
    async _ensureStarted() {
        while (true) {
            switch (this.state.phase) {
                case 'initialized':
                    throw new Error('You need to call `server.start()` before using your Apollo Server.');
                case 'starting':
                    await this.state.barrier;
                    break;
                case 'failed to start':
                    this.logStartupError(this.state.error);
                    throw new Error('This data graph is missing a valid configuration. More details may be available in the server logs.');
                case 'started':
                case 'draining':
                    return this.state.schemaManager.getSchemaDerivedData();
                case 'stopping':
                    throw new Error('Cannot execute GraphQL operations while the server is stopping.');
                case 'stopped':
                    throw new Error('Cannot execute GraphQL operations after the server has stopped.');
                default:
                    throw new UnreachableCaseError(this.state);
            }
        }
    }
    async ensureStarted() {
        await this._ensureStarted();
    }
    assertStarted(methodName) {
        if (this.state.phase !== 'started' && this.state.phase !== 'draining') {
            throw new Error('You must `await server.start()` before calling `server.' +
                methodName +
                '()`');
        }
    }
    logStartupError(err) {
        this.logger.error('An error occurred during Apollo Server startup. All GraphQL requests ' +
            'will now fail. The startup error was: ' +
            ((err === null || err === void 0 ? void 0 : err.message) || err));
    }
    constructSchema() {
        const { schema, modules, typeDefs, resolvers, parseOptions } = this.config;
        if (schema) {
            return schema;
        }
        if (modules) {
            const { schema, errors } = (0, apollo_tools_1.buildServiceDefinition)(modules);
            if (errors && errors.length > 0) {
                throw new Error(errors.map((error) => error.message).join('\n\n'));
            }
            return schema;
        }
        if (!typeDefs) {
            throw Error('Apollo Server requires either an existing schema, modules or typeDefs');
        }
        const augmentedTypeDefs = Array.isArray(typeDefs) ? typeDefs : [typeDefs];
        return (0, schema_1.makeExecutableSchema)({
            typeDefs: augmentedTypeDefs,
            resolvers,
            parseOptions,
        });
    }
    maybeAddMocksToConstructedSchema(schema) {
        const { mocks, mockEntireSchema } = this.config;
        if (mocks === false) {
            return schema;
        }
        if (!mocks && typeof mockEntireSchema === 'undefined') {
            return schema;
        }
        return (0, mock_1.addMocksToSchema)({
            schema,
            mocks: mocks === true || typeof mocks === 'undefined' ? {} : mocks,
            preserveResolvers: typeof mockEntireSchema === 'undefined' ? false : !mockEntireSchema,
        });
    }
    generateSchemaDerivedData(schema) {
        const schemaHash = (0, schemaHash_1.generateSchemaHash)(schema);
        return {
            schema,
            schemaHash,
            documentStore: this.config.documentStore === undefined
                ? new utils_keyvaluecache_1.InMemoryLRUCache()
                : this.config.documentStore === null
                    ? null
                    : new utils_keyvaluecache_1.PrefixingKeyValueCache(this.config.documentStore, `${uuid.v4()}:`),
        };
    }
    async stop() {
        var _a;
        switch (this.state.phase) {
            case 'initialized':
            case 'starting':
            case 'failed to start':
                throw Error('apolloServer.stop() should only be called after `await apolloServer.start()` has succeeded');
            case 'stopped':
                if (this.state.stopError) {
                    throw this.state.stopError;
                }
                return;
            case 'stopping':
            case 'draining': {
                await this.state.barrier;
                const state = this.state;
                if (state.phase !== 'stopped') {
                    throw Error(`Surprising post-stopping state ${state.phase}`);
                }
                if (state.stopError) {
                    throw state.stopError;
                }
                return;
            }
            case 'started':
                break;
            default:
                throw new UnreachableCaseError(this.state);
        }
        const barrier = (0, resolvable_1.default)();
        this.state = {
            phase: 'draining',
            schemaManager: this.state.schemaManager,
            barrier,
        };
        try {
            await ((_a = this.drainServers) === null || _a === void 0 ? void 0 : _a.call(this));
            this.state = { phase: 'stopping', barrier };
            await Promise.all([...this.toDispose].map((dispose) => dispose()));
            await Promise.all([...this.toDisposeLast].map((dispose) => dispose()));
        }
        catch (stopError) {
            this.state = { phase: 'stopped', stopError: stopError };
            barrier.resolve();
            throw stopError;
        }
        this.state = { phase: 'stopped', stopError: null };
    }
    serverlessFramework() {
        return false;
    }
    ensurePluginInstantiation(userPlugins = [], isDev) {
        this.plugins = userPlugins.map((plugin) => {
            if (typeof plugin === 'function') {
                return plugin();
            }
            return plugin;
        });
        const alreadyHavePluginWithInternalId = (id) => this.plugins.some((p) => (0, internalPlugin_1.pluginIsInternal)(p) && p.__internal_plugin_id__() === id);
        {
            if (!alreadyHavePluginWithInternalId('CacheControl')) {
                this.plugins.push((0, plugin_1.ApolloServerPluginCacheControl)());
            }
        }
        {
            const alreadyHavePlugin = alreadyHavePluginWithInternalId('UsageReporting');
            if (!alreadyHavePlugin && this.apolloConfig.key) {
                if (this.apolloConfig.graphRef) {
                    this.plugins.unshift((0, plugin_1.ApolloServerPluginUsageReporting)());
                }
                else {
                    this.logger.warn('You have specified an Apollo key but have not specified a graph ref; usage ' +
                        'reporting is disabled. To enable usage reporting, set the `APOLLO_GRAPH_REF` ' +
                        'environment variable to `your-graph-id@your-graph-variant`. To disable this ' +
                        'warning, install `ApolloServerPluginUsageReportingDisabled`.');
                }
            }
        }
        {
            const alreadyHavePlugin = alreadyHavePluginWithInternalId('SchemaReporting');
            const enabledViaEnvVar = process.env.APOLLO_SCHEMA_REPORTING === 'true';
            if (!alreadyHavePlugin && enabledViaEnvVar) {
                if (this.apolloConfig.key) {
                    const options = {};
                    this.plugins.push((0, plugin_1.ApolloServerPluginSchemaReporting)(options));
                }
                else {
                    throw new Error("You've enabled schema reporting by setting the APOLLO_SCHEMA_REPORTING " +
                        'environment variable to true, but you also need to provide your ' +
                        'Apollo API key, via the APOLLO_KEY environment ' +
                        'variable or via `new ApolloServer({apollo: {key})');
                }
            }
        }
        {
            const alreadyHavePlugin = alreadyHavePluginWithInternalId('InlineTrace');
            if (!alreadyHavePlugin) {
                this.plugins.push((0, plugin_1.ApolloServerPluginInlineTrace)({ __onlyIfSchemaIsFederated: true }));
            }
        }
        const alreadyHavePlugin = alreadyHavePluginWithInternalId('LandingPageDisabled');
        if (!alreadyHavePlugin) {
            const plugin = isDev
                ? (0, plugin_1.ApolloServerPluginLandingPageLocalDefault)()
                : (0, plugin_1.ApolloServerPluginLandingPageProductionDefault)();
            if (!isImplicitlyInstallablePlugin(plugin)) {
                throw Error('default landing page plugin should be implicitly installable?');
            }
            plugin.__internal_installed_implicitly__ = true;
            this.plugins.push(plugin);
        }
    }
    async graphQLServerOptions(integrationContextArgument) {
        const { schema, schemaHash, documentStore } = await this._ensureStarted();
        let context = this.context ? this.context : {};
        try {
            context =
                typeof this.context === 'function'
                    ? await this.context(integrationContextArgument || {})
                    : context;
        }
        catch (error) {
            context = () => {
                throw error;
            };
        }
        return {
            schema,
            schemaHash,
            logger: this.logger,
            plugins: this.plugins,
            documentStore,
            dangerouslyDisableValidation: this.config.dangerouslyDisableValidation,
            context,
            parseOptions: this.parseOptions,
            ...this.requestOptions,
        };
    }
    async executeOperation(request, integrationContextArgument) {
        if (this.state.phase === 'initialized') {
            await this._start();
        }
        const options = await this.graphQLServerOptions(integrationContextArgument);
        if (typeof options.context === 'function') {
            options.context = options.context();
        }
        else if (typeof options.context === 'object') {
            options.context = (0, runHttpQuery_1.cloneObject)(options.context);
        }
        const requestCtx = {
            logger: this.logger,
            schema: options.schema,
            schemaHash: options.schemaHash,
            request: {
                ...request,
                query: request.query && typeof request.query !== 'string'
                    ? (0, graphql_1.print)(request.query)
                    : request.query,
            },
            context: options.context || Object.create(null),
            cache: options.cache,
            metrics: {},
            response: {
                http: {
                    headers: new apollo_server_env_1.Headers(),
                },
            },
            debug: options.debug,
            overallCachePolicy: (0, cachePolicy_1.newCachePolicy)(),
            requestIsBatched: false,
        };
        return (0, requestPipeline_1.processGraphQLRequest)(options, requestCtx);
    }
    getLandingPage() {
        this.assertStarted('getLandingPage');
        return this.landingPage;
    }
}
exports.ApolloServerBase = ApolloServerBase;
function isImplicitlyInstallablePlugin(p) {
    return '__internal_installed_implicitly__' in p;
}
exports.isImplicitlyInstallablePlugin = isImplicitlyInstallablePlugin;
//# sourceMappingURL=ApolloServer.js.map