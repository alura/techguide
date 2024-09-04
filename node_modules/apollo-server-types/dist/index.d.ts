import type { Request, Response } from 'apollo-server-env';
import type { GraphQLSchema, ValidationContext, ASTVisitor, GraphQLFormattedError, OperationDefinitionNode, DocumentNode, GraphQLError, GraphQLResolveInfo, GraphQLCompositeType } from 'graphql';
import type { KeyValueCache } from '@apollo/utils.keyvaluecache';
import type { Trace } from 'apollo-reporting-protobuf';
import type { Logger } from '@apollo/utils.logger';
export type { Logger } from '@apollo/utils.logger';
export declare type BaseContext = Record<string, any>;
export declare type ValueOrPromise<T> = T | Promise<T>;
export declare type WithRequired<T, K extends keyof T> = T & Required<Pick<T, K>>;
export declare type AnyFunction = (...args: any[]) => any;
export declare type AnyFunctionMap = {
    [key: string]: AnyFunction | undefined;
};
declare type Mutable<T> = {
    -readonly [P in keyof T]: T[P];
};
declare type Fauxpaque<K, T> = K & {
    __fauxpaque: T;
};
export declare type SchemaHash = Fauxpaque<string, 'SchemaHash'>;
export interface ApolloConfigInput {
    key?: string;
    graphRef?: string;
    graphId?: string;
    graphVariant?: string;
}
export interface ApolloConfig {
    key?: string;
    keyHash?: string;
    graphRef?: string;
}
export interface GraphQLServiceContext {
    logger: Logger;
    schema: GraphQLSchema;
    schemaHash: SchemaHash;
    apollo: ApolloConfig;
    persistedQueries?: {
        cache: KeyValueCache;
    };
    serverlessFramework: boolean;
}
export interface GraphQLSchemaContext {
    apiSchema: GraphQLSchema;
    coreSupergraphSdl?: string;
}
export interface GraphQLRequest {
    query?: string;
    operationName?: string;
    variables?: VariableValues;
    extensions?: Record<string, any>;
    http?: Pick<Request, 'url' | 'method' | 'headers'>;
}
export declare type VariableValues = {
    [name: string]: any;
};
export interface GraphQLResponse {
    data?: Record<string, any> | null;
    errors?: ReadonlyArray<GraphQLFormattedError>;
    extensions?: Record<string, any>;
    http?: Pick<Response, 'headers'> & Partial<Pick<Mutable<Response>, 'status'>>;
}
export interface GraphQLRequestMetrics {
    captureTraces?: boolean;
    persistedQueryHit?: boolean;
    persistedQueryRegister?: boolean;
    responseCacheHit?: boolean;
    forbiddenOperation?: boolean;
    registeredOperation?: boolean;
    startHrTime?: [number, number];
    queryPlanTrace?: Trace.QueryPlanNode;
}
export interface GraphQLRequestContext<TContext = Record<string, any>> {
    readonly request: GraphQLRequest;
    readonly response?: GraphQLResponse;
    logger: Logger;
    readonly schema: GraphQLSchema;
    readonly schemaHash: SchemaHash;
    readonly context: TContext;
    readonly cache: KeyValueCache;
    readonly queryHash?: string;
    readonly document?: DocumentNode;
    readonly source?: string;
    readonly operationName?: string | null;
    readonly operation?: OperationDefinitionNode;
    readonly errors?: ReadonlyArray<GraphQLError>;
    readonly metrics: GraphQLRequestMetrics;
    debug?: boolean;
    readonly overallCachePolicy: CachePolicy;
    readonly requestIsBatched?: boolean;
}
export declare type ValidationRule = (context: ValidationContext) => ASTVisitor;
export declare type GraphQLExecutor<TContext = Record<string, any>> = (requestContext: GraphQLRequestContextExecutionDidStart<TContext>) => Promise<GraphQLExecutionResult>;
export declare type GraphQLExecutionResult = {
    data?: Record<string, any> | null;
    errors?: ReadonlyArray<GraphQLError>;
    extensions?: Record<string, any>;
};
export declare type GraphQLFieldResolverParams<TSource, TContext, TArgs = {
    [argName: string]: any;
}> = {
    source: TSource;
    args: TArgs;
    context: TContext;
    info: GraphQLResolveInfo;
};
export declare type GraphQLRequestContextDidResolveSource<TContext> = WithRequired<GraphQLRequestContext<TContext>, 'metrics' | 'source' | 'queryHash'>;
export declare type GraphQLRequestContextParsingDidStart<TContext> = GraphQLRequestContextDidResolveSource<TContext>;
export declare type GraphQLRequestContextValidationDidStart<TContext> = GraphQLRequestContextParsingDidStart<TContext> & WithRequired<GraphQLRequestContext<TContext>, 'document'>;
export declare type GraphQLRequestContextDidResolveOperation<TContext> = GraphQLRequestContextValidationDidStart<TContext> & WithRequired<GraphQLRequestContext<TContext>, 'operation' | 'operationName'>;
export declare type GraphQLRequestContextDidEncounterErrors<TContext> = WithRequired<GraphQLRequestContext<TContext>, 'metrics' | 'errors'>;
export declare type GraphQLRequestContextResponseForOperation<TContext> = WithRequired<GraphQLRequestContext<TContext>, 'metrics' | 'source' | 'document' | 'operation' | 'operationName'>;
export declare type GraphQLRequestContextExecutionDidStart<TContext> = GraphQLRequestContextParsingDidStart<TContext> & WithRequired<GraphQLRequestContext<TContext>, 'document' | 'operation' | 'operationName'>;
export declare type GraphQLRequestContextWillSendResponse<TContext> = GraphQLRequestContextDidResolveSource<TContext> & WithRequired<GraphQLRequestContext<TContext>, 'metrics' | 'response'>;
export interface CacheHint {
    maxAge?: number;
    scope?: CacheScope;
}
export interface CacheAnnotation extends CacheHint {
    inheritMaxAge?: true;
}
export declare enum CacheScope {
    Public = "PUBLIC",
    Private = "PRIVATE"
}
export interface CachePolicy extends CacheHint {
    replace(hint: CacheHint): void;
    restrict(hint: CacheHint): void;
    policyIfCacheable(): Required<CacheHint> | null;
}
export interface ResolveInfoCacheControl {
    cacheHint: CachePolicy;
    setCacheHint(hint: CacheHint): void;
    cacheHintFromType(t: GraphQLCompositeType): CacheHint | undefined;
}
declare module 'graphql/type/definition' {
    interface GraphQLResolveInfo {
        cacheControl: ResolveInfoCacheControl;
    }
}
//# sourceMappingURL=index.d.ts.map