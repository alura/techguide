import { GraphQLSchema, GraphQLFieldResolver, DocumentNode, GraphQLError, GraphQLFormattedError, ParseOptions } from 'graphql';
import type { DataSource } from 'apollo-datasource';
import type { PersistedQueryOptions } from './graphqlOptions';
import type { GraphQLRequest, GraphQLResponse, GraphQLRequestContext, GraphQLExecutor, ValidationRule, BaseContext } from 'apollo-server-types';
import type { ApolloServerPlugin } from 'apollo-server-plugin-base';
export { GraphQLRequest, GraphQLResponse, GraphQLRequestContext };
import type { DocumentStore } from './types';
export declare const APQ_CACHE_PREFIX = "apq:";
export interface GraphQLRequestPipelineConfig<TContext> {
    schema: GraphQLSchema;
    rootValue?: ((document: DocumentNode) => any) | any;
    validationRules?: ValidationRule[];
    executor?: GraphQLExecutor;
    fieldResolver?: GraphQLFieldResolver<any, TContext>;
    dataSources?: () => DataSources<TContext>;
    persistedQueries?: PersistedQueryOptions;
    formatError?: (error: GraphQLError) => GraphQLFormattedError;
    formatResponse?: (response: GraphQLResponse, requestContext: GraphQLRequestContext<TContext>) => GraphQLResponse | null;
    plugins?: ApolloServerPlugin[];
    dangerouslyDisableValidation?: boolean;
    documentStore?: DocumentStore | null;
    parseOptions?: ParseOptions;
}
export declare type DataSources<TContext> = {
    [name: string]: DataSource<TContext>;
};
declare type Mutable<T> = {
    -readonly [P in keyof T]: T[P];
};
export declare function processGraphQLRequest<TContext extends BaseContext>(config: GraphQLRequestPipelineConfig<TContext>, requestContext: Mutable<GraphQLRequestContext<TContext>>): Promise<GraphQLResponse>;
//# sourceMappingURL=requestPipeline.d.ts.map