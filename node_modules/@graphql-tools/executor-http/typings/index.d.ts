import { AsyncExecutor, ExecutionRequest, SyncExecutor } from '@graphql-tools/utils';
import { GraphQLResolveInfo } from 'graphql';
import { isLiveQueryOperationDefinitionNode } from './isLiveQueryOperationDefinitionNode.js';
export type SyncFetchFn = (url: string, init?: RequestInit, context?: any, info?: GraphQLResolveInfo) => SyncResponse;
export type SyncResponse = Omit<Response, 'json' | 'text'> & {
    json: () => any;
    text: () => string;
};
export type AsyncFetchFn = (url: string, options?: RequestInit, context?: any, info?: GraphQLResolveInfo) => Promise<Response> | Response;
export type RegularFetchFn = (url: string) => Promise<Response> | Response;
export type FetchFn = AsyncFetchFn | SyncFetchFn | RegularFetchFn;
export type AsyncImportFn = (moduleName: string) => PromiseLike<any>;
export type SyncImportFn = (moduleName: string) => any;
export interface HTTPExecutorOptions {
    endpoint?: string;
    fetch?: FetchFn;
    /**
     * Whether to use the GET HTTP method for queries when querying the original schema
     */
    useGETForQueries?: boolean;
    /**
     * Additional headers to include when querying the original schema
     */
    headers?: HeadersConfig | ((executorRequest?: ExecutionRequest) => HeadersConfig);
    /**
     * HTTP method to use when querying the original schema.
     */
    method?: 'GET' | 'POST';
    /**
     * Timeout in milliseconds
     */
    timeout?: number;
    /**
     * Request Credentials (default: 'same-origin')
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Request/credentials
     */
    credentials?: RequestCredentials;
    /**
     * Retry attempts
     */
    retry?: number;
    /**
     * WHATWG compatible File implementation
     * @see https://developer.mozilla.org/en-US/docs/Web/API/File
     */
    File?: typeof File;
    /**
     * WHATWG compatible FormData implementation
     * @see https://developer.mozilla.org/en-US/docs/Web/API/FormData
     */
    FormData?: typeof FormData;
}
export type HeadersConfig = Record<string, string>;
export declare function buildHTTPExecutor(options?: Omit<HTTPExecutorOptions, 'fetch'> & {
    fetch: SyncFetchFn;
}): SyncExecutor<any, HTTPExecutorOptions>;
export declare function buildHTTPExecutor(options?: Omit<HTTPExecutorOptions, 'fetch'> & {
    fetch: AsyncFetchFn;
}): AsyncExecutor<any, HTTPExecutorOptions>;
export declare function buildHTTPExecutor(options?: Omit<HTTPExecutorOptions, 'fetch'> & {
    fetch: RegularFetchFn;
}): AsyncExecutor<any, HTTPExecutorOptions>;
export declare function buildHTTPExecutor(options?: Omit<HTTPExecutorOptions, 'fetch'>): AsyncExecutor<any, HTTPExecutorOptions>;
export { isLiveQueryOperationDefinitionNode };
