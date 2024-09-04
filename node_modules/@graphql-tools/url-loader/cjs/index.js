"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UrlLoader = exports.SubscriptionProtocol = void 0;
const tslib_1 = require("tslib");
const graphql_1 = require("graphql");
const utils_1 = require("@graphql-tools/utils");
const wrap_1 = require("@graphql-tools/wrap");
const isomorphic_ws_1 = tslib_1.__importDefault(require("isomorphic-ws"));
const value_or_promise_1 = require("value-or-promise");
const defaultAsyncFetch_js_1 = require("./defaultAsyncFetch.js");
const defaultSyncFetch_js_1 = require("./defaultSyncFetch.js");
const executor_graphql_ws_1 = require("@graphql-tools/executor-graphql-ws");
const executor_http_1 = require("@graphql-tools/executor-http");
const executor_legacy_ws_1 = require("@graphql-tools/executor-legacy-ws");
const asyncImport = (moduleName) => Promise.resolve(`${`${moduleName}`}`).then(s => tslib_1.__importStar(require(s)));
const syncImport = (moduleName) => require(`${moduleName}`);
var SubscriptionProtocol;
(function (SubscriptionProtocol) {
    SubscriptionProtocol["WS"] = "WS";
    /**
     * Use legacy web socket protocol `graphql-ws` instead of the more current standard `graphql-transport-ws`
     */
    SubscriptionProtocol["LEGACY_WS"] = "LEGACY_WS";
    /**
     * Use SSE for subscription instead of WebSocket
     */
    SubscriptionProtocol["SSE"] = "SSE";
    /**
     * Use `graphql-sse` for subscriptions
     */
    SubscriptionProtocol["GRAPHQL_SSE"] = "GRAPHQL_SSE";
})(SubscriptionProtocol = exports.SubscriptionProtocol || (exports.SubscriptionProtocol = {}));
const acceptableProtocols = ['http:', 'https:', 'ws:', 'wss:'];
function isCompatibleUri(uri) {
    try {
        const url = new URL(uri);
        return acceptableProtocols.includes(url.protocol);
    }
    catch (_a) {
        return false;
    }
}
/**
 * This loader loads a schema from a URL. The loaded schema is a fully-executable,
 * remote schema since it's created using [@graphql-tools/wrap](/docs/remote-schemas).
 *
 * ```
 * const schema = await loadSchema('http://localhost:3000/graphql', {
 *   loaders: [
 *     new UrlLoader(),
 *   ]
 * });
 * ```
 */
class UrlLoader {
    buildHTTPExecutor(initialEndpoint, fetchFn, options) {
        const HTTP_URL = switchProtocols(initialEndpoint, {
            wss: 'https',
            ws: 'http',
        });
        return (0, executor_http_1.buildHTTPExecutor)({
            endpoint: HTTP_URL,
            fetch: fetchFn,
            ...options,
        });
    }
    buildWSExecutor(subscriptionsEndpoint, webSocketImpl, connectionParams) {
        const WS_URL = switchProtocols(subscriptionsEndpoint, {
            https: 'wss',
            http: 'ws',
        });
        return (0, executor_graphql_ws_1.buildGraphQLWSExecutor)({
            url: WS_URL,
            webSocketImpl,
            connectionParams,
        });
    }
    buildWSLegacyExecutor(subscriptionsEndpoint, WebSocketImpl, options) {
        const WS_URL = switchProtocols(subscriptionsEndpoint, {
            https: 'wss',
            http: 'ws',
        });
        return (0, executor_legacy_ws_1.buildWSLegacyExecutor)(WS_URL, WebSocketImpl, options);
    }
    getFetch(customFetch, importFn) {
        if (customFetch) {
            if (typeof customFetch === 'string') {
                const [moduleName, fetchFnName] = customFetch.split('#');
                return new value_or_promise_1.ValueOrPromise(() => importFn(moduleName))
                    .then(module => (fetchFnName ? module[fetchFnName] : module))
                    .resolve();
            }
            else if (typeof customFetch === 'function') {
                return customFetch;
            }
        }
        if (importFn === asyncImport) {
            return defaultAsyncFetch_js_1.defaultAsyncFetch;
        }
        else {
            return defaultSyncFetch_js_1.defaultSyncFetch;
        }
    }
    getDefaultMethodFromOptions(method, defaultMethod) {
        if (method) {
            defaultMethod = method;
        }
        return defaultMethod;
    }
    getWebSocketImpl(importFn, options) {
        if (typeof (options === null || options === void 0 ? void 0 : options.webSocketImpl) === 'string') {
            const [moduleName, webSocketImplName] = options.webSocketImpl.split('#');
            return new value_or_promise_1.ValueOrPromise(() => importFn(moduleName))
                .then(importedModule => (webSocketImplName ? importedModule[webSocketImplName] : importedModule))
                .resolve();
        }
        else {
            const websocketImpl = (options === null || options === void 0 ? void 0 : options.webSocketImpl) || isomorphic_ws_1.default;
            return websocketImpl;
        }
    }
    buildSubscriptionExecutor(subscriptionsEndpoint, fetch, importFn, options) {
        if ((options === null || options === void 0 ? void 0 : options.subscriptionsProtocol) === SubscriptionProtocol.SSE) {
            return this.buildHTTPExecutor(subscriptionsEndpoint, fetch, options);
        }
        else if ((options === null || options === void 0 ? void 0 : options.subscriptionsProtocol) === SubscriptionProtocol.GRAPHQL_SSE) {
            if (!(options === null || options === void 0 ? void 0 : options.subscriptionsEndpoint)) {
                // when no custom subscriptions endpoint is specified,
                // graphql-sse is recommended to be used on `/graphql/stream`
                subscriptionsEndpoint += '/stream';
            }
            return this.buildHTTPExecutor(subscriptionsEndpoint, fetch, options);
        }
        else {
            const webSocketImpl$ = new value_or_promise_1.ValueOrPromise(() => this.getWebSocketImpl(importFn, options));
            const executor$ = webSocketImpl$.then(webSocketImpl => {
                if ((options === null || options === void 0 ? void 0 : options.subscriptionsProtocol) === SubscriptionProtocol.LEGACY_WS) {
                    return this.buildWSLegacyExecutor(subscriptionsEndpoint, webSocketImpl, options);
                }
                else {
                    return this.buildWSExecutor(subscriptionsEndpoint, webSocketImpl, options === null || options === void 0 ? void 0 : options.connectionParams);
                }
            });
            return request => executor$.then(executor => executor(request)).resolve();
        }
    }
    getExecutor(endpoint, importFn, options) {
        const fetch$ = new value_or_promise_1.ValueOrPromise(() => this.getFetch(options === null || options === void 0 ? void 0 : options.customFetch, importFn));
        const httpExecutor$ = fetch$.then(fetch => {
            return this.buildHTTPExecutor(endpoint, fetch, options);
        });
        if ((options === null || options === void 0 ? void 0 : options.subscriptionsEndpoint) != null || (options === null || options === void 0 ? void 0 : options.subscriptionsProtocol) !== SubscriptionProtocol.SSE) {
            const subscriptionExecutor$ = fetch$.then(fetch => {
                const subscriptionsEndpoint = (options === null || options === void 0 ? void 0 : options.subscriptionsEndpoint) || endpoint;
                return this.buildSubscriptionExecutor(subscriptionsEndpoint, fetch, importFn, options);
            });
            // eslint-disable-next-line no-inner-declarations
            function getExecutorByRequest(request) {
                var _a;
                request.operationType = request.operationType || ((_a = (0, utils_1.getOperationASTFromRequest)(request)) === null || _a === void 0 ? void 0 : _a.operation);
                if (request.operationType === 'subscription' &&
                    (0, executor_http_1.isLiveQueryOperationDefinitionNode)((0, utils_1.getOperationASTFromRequest)(request))) {
                    request.operationType = 'subscription';
                }
                if (request.operationType === 'subscription') {
                    return subscriptionExecutor$;
                }
                else {
                    return httpExecutor$;
                }
            }
            return request => getExecutorByRequest(request)
                .then(executor => executor(request))
                .resolve();
        }
        else {
            return request => httpExecutor$.then(executor => executor(request)).resolve();
        }
    }
    getExecutorAsync(endpoint, options) {
        return this.getExecutor(endpoint, asyncImport, options);
    }
    getExecutorSync(endpoint, options) {
        return this.getExecutor(endpoint, syncImport, options);
    }
    handleSDL(pointer, fetch, options) {
        const defaultMethod = this.getDefaultMethodFromOptions(options === null || options === void 0 ? void 0 : options.method, 'GET');
        return new value_or_promise_1.ValueOrPromise(() => fetch(pointer, {
            method: defaultMethod,
            headers: typeof (options === null || options === void 0 ? void 0 : options.headers) === 'function' ? options.headers() : options === null || options === void 0 ? void 0 : options.headers,
        }))
            .then(response => response.text())
            .then(schemaString => (0, utils_1.parseGraphQLSDL)(pointer, schemaString, options))
            .resolve();
    }
    async load(pointer, options) {
        if (!isCompatibleUri(pointer)) {
            return [];
        }
        let source = {
            location: pointer,
        };
        let executor;
        if ((options === null || options === void 0 ? void 0 : options.handleAsSDL) || pointer.endsWith('.graphql') || pointer.endsWith('.graphqls')) {
            const fetch = await this.getFetch(options === null || options === void 0 ? void 0 : options.customFetch, asyncImport);
            source = await this.handleSDL(pointer, fetch, options);
            if (!source.schema && !source.document && !source.rawSDL) {
                throw new Error(`Invalid SDL response`);
            }
            source.schema =
                source.schema ||
                    (source.document
                        ? (0, graphql_1.buildASTSchema)(source.document, options)
                        : source.rawSDL
                            ? (0, graphql_1.buildSchema)(source.rawSDL, options)
                            : undefined);
        }
        else {
            executor = this.getExecutorAsync(pointer, options);
            source.schema = await (0, wrap_1.schemaFromExecutor)(executor, {}, options);
        }
        if (!source.schema) {
            throw new Error(`Invalid introspected schema`);
        }
        if (options === null || options === void 0 ? void 0 : options.endpoint) {
            executor = this.getExecutorAsync(options.endpoint, options);
        }
        if (executor) {
            source.schema = (0, wrap_1.wrapSchema)({
                schema: source.schema,
                executor,
                batch: options === null || options === void 0 ? void 0 : options.batch,
            });
        }
        return [source];
    }
    loadSync(pointer, options) {
        if (!isCompatibleUri(pointer)) {
            return [];
        }
        let source = {
            location: pointer,
        };
        let executor;
        if ((options === null || options === void 0 ? void 0 : options.handleAsSDL) || pointer.endsWith('.graphql') || pointer.endsWith('.graphqls')) {
            const fetch = this.getFetch(options === null || options === void 0 ? void 0 : options.customFetch, syncImport);
            source = this.handleSDL(pointer, fetch, options);
            if (!source.schema && !source.document && !source.rawSDL) {
                throw new Error(`Invalid SDL response`);
            }
            source.schema =
                source.schema ||
                    (source.document
                        ? (0, graphql_1.buildASTSchema)(source.document, options)
                        : source.rawSDL
                            ? (0, graphql_1.buildSchema)(source.rawSDL, options)
                            : undefined);
        }
        else {
            executor = this.getExecutorSync(pointer, options);
            source.schema = (0, wrap_1.schemaFromExecutor)(executor, {}, options);
        }
        if (!source.schema) {
            throw new Error(`Invalid introspected schema`);
        }
        if (options === null || options === void 0 ? void 0 : options.endpoint) {
            executor = this.getExecutorSync(options.endpoint, options);
        }
        if (executor) {
            source.schema = (0, wrap_1.wrapSchema)({
                schema: source.schema,
                executor,
            });
        }
        return [source];
    }
}
exports.UrlLoader = UrlLoader;
function switchProtocols(pointer, protocolMap) {
    return Object.entries(protocolMap).reduce((prev, [source, target]) => prev.replace(`${source}://`, `${target}://`).replace(`${source}:\\`, `${target}:\\`), pointer);
}
