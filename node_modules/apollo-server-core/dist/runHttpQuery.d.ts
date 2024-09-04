import { Headers, Request } from 'apollo-server-env';
import type { BaseContext, GraphQLExecutionResult, ValueOrPromise, WithRequired } from 'apollo-server-types';
import { default as GraphQLOptions } from './graphqlOptions';
export interface HttpQueryRequest {
    method: string;
    query: Record<string, any> | Array<Record<string, any>>;
    options: GraphQLOptions | ((...args: Array<any>) => ValueOrPromise<GraphQLOptions>);
    request: Pick<Request, 'url' | 'method' | 'headers'>;
}
interface ApolloServerHttpResponse {
    headers?: Record<string, string>;
    status?: number;
}
interface HttpQueryResponse {
    graphqlResponse: string;
    responseInit: ApolloServerHttpResponse;
}
export declare class HttpQueryError extends Error {
    statusCode: number;
    isGraphQLError: boolean;
    headers?: {
        [key: string]: string;
    };
    constructor(statusCode: number, message: string, isGraphQLError?: boolean, headers?: {
        [key: string]: string;
    });
}
export declare function isHttpQueryError(e: unknown): e is HttpQueryError;
export declare function throwHttpGraphQLError<E extends Error>(statusCode: number, errors: Array<E>, options?: Pick<GraphQLOptions, 'debug' | 'formatError'>, extensions?: GraphQLExecutionResult['extensions'], headers?: Headers): never;
export declare function runHttpQuery(handlerArguments: Array<any>, request: HttpQueryRequest, csrfPreventionRequestHeaders?: string[] | null): Promise<HttpQueryResponse>;
export declare function processHTTPRequest<TContext extends BaseContext>(options: WithRequired<GraphQLOptions<TContext>, 'cache' | 'plugins'> & {
    context: TContext;
}, httpRequest: HttpQueryRequest): Promise<HttpQueryResponse>;
export declare function cloneObject<T extends Object>(object: T): T;
export {};
//# sourceMappingURL=runHttpQuery.d.ts.map