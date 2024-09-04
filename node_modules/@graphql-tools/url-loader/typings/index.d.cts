/// <reference types="ws" />
import { IntrospectionOptions } from 'graphql';
import { AsyncExecutor, Executor, SyncExecutor, Source, Loader, BaseLoaderOptions } from '@graphql-tools/utils';
import WebSocket from 'isomorphic-ws';
import { AsyncFetchFn, FetchFn, HTTPExecutorOptions, SyncFetchFn } from '@graphql-tools/executor-http';
export { FetchFn };
export type AsyncImportFn = (moduleName: string) => PromiseLike<any>;
export type SyncImportFn = (moduleName: string) => any;
type HeadersConfig = Record<string, string>;
interface ExecutionExtensions {
    headers?: HeadersConfig;
    endpoint?: string;
}
export declare enum SubscriptionProtocol {
    WS = "WS",
    /**
     * Use legacy web socket protocol `graphql-ws` instead of the more current standard `graphql-transport-ws`
     */
    LEGACY_WS = "LEGACY_WS",
    /**
     * Use SSE for subscription instead of WebSocket
     */
    SSE = "SSE",
    /**
     * Use `graphql-sse` for subscriptions
     */
    GRAPHQL_SSE = "GRAPHQL_SSE"
}
/**
 * Additional options for loading from a URL
 */
export interface LoadFromUrlOptions extends BaseLoaderOptions, Partial<IntrospectionOptions>, HTTPExecutorOptions {
    /**
     * A custom `fetch` implementation to use when querying the original schema.
     * Defaults to `cross-fetch`
     */
    customFetch?: FetchFn | string;
    /**
     * Custom WebSocket implementation used by the loaded schema if subscriptions
     * are enabled
     */
    webSocketImpl?: typeof WebSocket | string;
    /**
     * Handle URL as schema SDL
     */
    handleAsSDL?: boolean;
    /**
     * Regular HTTP endpoint; defaults to the pointer
     */
    endpoint?: string;
    /**
     * Subscriptions endpoint; defaults to the endpoint given as HTTP endpoint
     */
    subscriptionsEndpoint?: string;
    /**
     * Use specific protocol for subscriptions
     */
    subscriptionsProtocol?: SubscriptionProtocol;
    /**
     * Connection Parameters for WebSockets connection
     */
    connectionParams?: any;
    /**
     * Enable Batching
     */
    batch?: boolean;
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
export declare class UrlLoader implements Loader<LoadFromUrlOptions> {
    buildHTTPExecutor(endpoint: string, fetchFn: SyncFetchFn, options?: LoadFromUrlOptions): SyncExecutor<any, ExecutionExtensions>;
    buildHTTPExecutor(endpoint: string, fetchFn: AsyncFetchFn, options?: LoadFromUrlOptions): AsyncExecutor<any, ExecutionExtensions>;
    buildWSExecutor(subscriptionsEndpoint: string, webSocketImpl: typeof WebSocket, connectionParams?: Record<string, any>): Executor;
    buildWSLegacyExecutor(subscriptionsEndpoint: string, WebSocketImpl: typeof WebSocket, options?: LoadFromUrlOptions): Executor;
    getFetch(customFetch: LoadFromUrlOptions['customFetch'], importFn: AsyncImportFn): PromiseLike<AsyncFetchFn> | AsyncFetchFn;
    getFetch(customFetch: LoadFromUrlOptions['customFetch'], importFn: SyncImportFn): SyncFetchFn;
    private getDefaultMethodFromOptions;
    getWebSocketImpl(importFn: AsyncImportFn, options?: LoadFromUrlOptions): PromiseLike<typeof WebSocket>;
    getWebSocketImpl(importFn: SyncImportFn, options?: LoadFromUrlOptions): typeof WebSocket;
    buildSubscriptionExecutor(subscriptionsEndpoint: string, fetch: SyncFetchFn, syncImport: SyncImportFn, options?: LoadFromUrlOptions): SyncExecutor;
    buildSubscriptionExecutor(subscriptionsEndpoint: string, fetch: AsyncFetchFn, asyncImport: AsyncImportFn, options?: LoadFromUrlOptions): AsyncExecutor;
    getExecutor(endpoint: string, asyncImport: AsyncImportFn, options?: Omit<LoadFromUrlOptions, 'endpoint'>): AsyncExecutor;
    getExecutor(endpoint: string, syncImport: SyncImportFn, options?: Omit<LoadFromUrlOptions, 'endpoint'>): SyncExecutor;
    getExecutorAsync(endpoint: string, options?: Omit<LoadFromUrlOptions, 'endpoint'>): AsyncExecutor;
    getExecutorSync(endpoint: string, options?: Omit<LoadFromUrlOptions, 'endpoint'>): SyncExecutor;
    handleSDL(pointer: string, fetch: SyncFetchFn, options: LoadFromUrlOptions): Source;
    handleSDL(pointer: string, fetch: AsyncFetchFn, options: LoadFromUrlOptions): Promise<Source>;
    load(pointer: string, options: LoadFromUrlOptions): Promise<Source[]>;
    loadSync(pointer: string, options: LoadFromUrlOptions): Source[];
}
