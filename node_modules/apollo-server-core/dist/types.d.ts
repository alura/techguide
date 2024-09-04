import type { GraphQLSchema, DocumentNode } from 'graphql';
import type { IMocks } from '@graphql-tools/mock';
import type { IExecutableSchemaDefinition } from '@graphql-tools/schema';
import type { ApolloConfig, ValueOrPromise, GraphQLExecutor, ApolloConfigInput } from 'apollo-server-types';
import type { GraphQLServerOptions as GraphQLOptions, PersistedQueryOptions } from './graphqlOptions';
import type { ApolloServerPlugin } from 'apollo-server-plugin-base';
import type { GraphQLSchemaModule } from '@apollographql/apollo-tools';
export type { GraphQLSchemaModule };
import type { KeyValueCache } from '@apollo/utils.keyvaluecache';
export type { KeyValueCache };
export declare type Context<T = object> = T;
export declare type ContextFunction<FunctionParams = any, ProducedContext = object> = (context: FunctionParams) => ValueOrPromise<Context<ProducedContext>>;
export declare type PluginDefinition = ApolloServerPlugin | (() => ApolloServerPlugin);
declare type BaseConfig = Pick<GraphQLOptions<Context>, 'formatError' | 'debug' | 'rootValue' | 'validationRules' | 'executor' | 'formatResponse' | 'fieldResolver' | 'dataSources' | 'logger' | 'allowBatchedHttpRequests'>;
export declare type Unsubscriber = () => void;
export declare type SchemaChangeCallback = (apiSchema: GraphQLSchema) => void;
export declare type GraphQLServiceConfig = {
    schema: GraphQLSchema;
    executor: GraphQLExecutor | null;
};
export interface GatewayInterface {
    load(options: {
        apollo: ApolloConfig;
    }): Promise<GraphQLServiceConfig>;
    onSchemaChange?(callback: SchemaChangeCallback): Unsubscriber;
    onSchemaLoadOrUpdate?(callback: (schemaContext: {
        apiSchema: GraphQLSchema;
        coreSupergraphSdl: string;
    }) => void): Unsubscriber;
    stop(): Promise<void>;
}
export interface GraphQLService extends GatewayInterface {
}
export declare type DocumentStore = KeyValueCache<DocumentNode>;
export interface Config<ContextFunctionParams = any> extends BaseConfig {
    modules?: GraphQLSchemaModule[];
    typeDefs?: IExecutableSchemaDefinition['typeDefs'];
    resolvers?: IExecutableSchemaDefinition['resolvers'];
    parseOptions?: IExecutableSchemaDefinition['parseOptions'];
    schema?: GraphQLSchema;
    context?: Context | ContextFunction<ContextFunctionParams>;
    introspection?: boolean;
    mocks?: boolean | IMocks;
    mockEntireSchema?: boolean;
    plugins?: PluginDefinition[];
    persistedQueries?: PersistedQueryOptions | false;
    gateway?: GatewayInterface;
    stopOnTerminationSignals?: boolean;
    apollo?: ApolloConfigInput;
    nodeEnv?: string;
    dangerouslyDisableValidation?: boolean;
    documentStore?: DocumentStore | null;
    csrfPrevention?: CSRFPreventionOptions | boolean;
    cache?: KeyValueCache | 'bounded';
}
export interface CSRFPreventionOptions {
    requestHeaders?: string[];
}
//# sourceMappingURL=types.d.ts.map