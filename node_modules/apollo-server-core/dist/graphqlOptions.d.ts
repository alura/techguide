import type { GraphQLSchema, ValidationContext, GraphQLFieldResolver, DocumentNode, GraphQLError, GraphQLFormattedError, ParseOptions } from 'graphql';
import type { KeyValueCache } from '@apollo/utils.keyvaluecache';
import type { DataSource } from 'apollo-datasource';
import type { ApolloServerPlugin } from 'apollo-server-plugin-base';
import type { GraphQLExecutor, ValueOrPromise, GraphQLResponse, GraphQLRequestContext, SchemaHash } from 'apollo-server-types';
import type { Logger } from '@apollo/utils.logger';
import type { DocumentStore } from './types';
export interface GraphQLServerOptions<TContext = Record<string, any>, TRootValue = any> {
    schema: GraphQLSchema;
    schemaHash: SchemaHash;
    logger?: Logger;
    formatError?: (error: GraphQLError) => GraphQLFormattedError;
    rootValue?: ((parsedQuery: DocumentNode) => TRootValue) | TRootValue;
    context?: TContext | (() => never);
    validationRules?: Array<(context: ValidationContext) => any>;
    executor?: GraphQLExecutor;
    formatResponse?: (response: GraphQLResponse, requestContext: GraphQLRequestContext<TContext>) => GraphQLResponse | null;
    fieldResolver?: GraphQLFieldResolver<any, TContext>;
    debug?: boolean;
    dataSources?: () => DataSources<TContext>;
    cache?: KeyValueCache;
    persistedQueries?: PersistedQueryOptions;
    plugins?: ApolloServerPlugin[];
    documentStore?: DocumentStore | null;
    dangerouslyDisableValidation?: boolean;
    parseOptions?: ParseOptions;
    nodeEnv?: string;
    allowBatchedHttpRequests?: boolean;
}
export declare type DataSources<TContext> = {
    [name: string]: DataSource<TContext>;
};
export interface PersistedQueryOptions {
    cache?: KeyValueCache;
    ttl?: number | null;
}
export default GraphQLServerOptions;
export declare function resolveGraphqlOptions(options: GraphQLServerOptions | ((...args: Array<any>) => ValueOrPromise<GraphQLServerOptions>), ...args: Array<any>): Promise<GraphQLServerOptions>;
//# sourceMappingURL=graphqlOptions.d.ts.map