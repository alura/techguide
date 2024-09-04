import { buildASTSchema, buildSchema } from 'graphql';
import { parseGraphQLSDL, getOperationASTFromRequest, } from '@graphql-tools/utils';
import { schemaFromExecutor, wrapSchema } from '@graphql-tools/wrap';
import WebSocket from 'isomorphic-ws';
import { ValueOrPromise } from 'value-or-promise';
import { defaultAsyncFetch } from './defaultAsyncFetch.js';
import { defaultSyncFetch } from './defaultSyncFetch.js';
import { buildGraphQLWSExecutor } from '@graphql-tools/executor-graphql-ws';
import { buildHTTPExecutor, isLiveQueryOperationDefinitionNode, } from '@graphql-tools/executor-http';
import { buildWSLegacyExecutor } from '@graphql-tools/executor-legacy-ws';
const asyncImport = (moduleName) => import(`${moduleName}`);
const syncImport = (moduleName) => require(`${moduleName}`);
export var SubscriptionProtocol;
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
})(SubscriptionProtocol || (SubscriptionProtocol = {}));
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
export class UrlLoader {
    buildHTTPExecutor(initialEndpoint, fetchFn, options) {
        const HTTP_URL = switchProtocols(initialEndpoint, {
            wss: 'https',
            ws: 'http',
        });
        return buildHTTPExecutor({
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
        return buildGraphQLWSExecutor({
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
        return buildWSLegacyExecutor(WS_URL, WebSocketImpl, options);
    }
    getFetch(customFetch, importFn) {
        if (customFetch) {
            if (typeof customFetch === 'string') {
                const [moduleName, fetchFnName] = customFetch.split('#');
                return new ValueOrPromise(() => importFn(moduleName))
                    .then(module => (fetchFnName ? module[fetchFnName] : module))
                    .resolve();
            }
            else if (typeof customFetch === 'function') {
                return customFetch;
            }
        }
        if (importFn === asyncImport) {
            return defaultAsyncFetch;
        }
        else {
            return defaultSyncFetch;
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
            return new ValueOrPromise(() => importFn(moduleName))
                .then(importedModule => (webSocketImplName ? importedModule[webSocketImplName] : importedModule))
                .resolve();
        }
        else {
            const websocketImpl = (options === null || options === void 0 ? void 0 : options.webSocketImpl) || WebSocket;
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
            const webSocketImpl$ = new ValueOrPromise(() => this.getWebSocketImpl(importFn, options));
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
        const fetch$ = new ValueOrPromise(() => this.getFetch(options === null || options === void 0 ? void 0 : options.customFetch, importFn));
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
                request.operationType = request.operationType || ((_a = getOperationASTFromRequest(request)) === null || _a === void 0 ? void 0 : _a.operation);
                if (request.operationType === 'subscription' &&
                    isLiveQueryOperationDefinitionNode(getOperationASTFromRequest(request))) {
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
        return new ValueOrPromise(() => fetch(pointer, {
            method: defaultMethod,
            headers: typeof (options === null || options === void 0 ? void 0 : options.headers) === 'function' ? options.headers() : options === null || options === void 0 ? void 0 : options.headers,
        }))
            .then(response => response.text())
            .then(schemaString => parseGraphQLSDL(pointer, schemaString, options))
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
                        ? buildASTSchema(source.document, options)
                        : source.rawSDL
                            ? buildSchema(source.rawSDL, options)
                            : undefined);
        }
        else {
            executor = this.getExecutorAsync(pointer, options);
            source.schema = await schemaFromExecutor(executor, {}, options);
        }
        if (!source.schema) {
            throw new Error(`Invalid introspected schema`);
        }
        if (options === null || options === void 0 ? void 0 : options.endpoint) {
            executor = this.getExecutorAsync(options.endpoint, options);
        }
        if (executor) {
            source.schema = wrapSchema({
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
                        ? buildASTSchema(source.document, options)
                        : source.rawSDL
                            ? buildSchema(source.rawSDL, options)
                            : undefined);
        }
        else {
            executor = this.getExecutorSync(pointer, options);
            source.schema = schemaFromExecutor(executor, {}, options);
        }
        if (!source.schema) {
            throw new Error(`Invalid introspected schema`);
        }
        if (options === null || options === void 0 ? void 0 : options.endpoint) {
            executor = this.getExecutorSync(options.endpoint, options);
        }
        if (executor) {
            source.schema = wrapSchema({
                schema: source.schema,
                executor,
            });
        }
        return [source];
    }
}
function switchProtocols(pointer, protocolMap) {
    return Object.entries(protocolMap).reduce((prev, [source, target]) => prev.replace(`${source}://`, `${target}://`).replace(`${source}:\\`, `${target}:\\`), pointer);
}
