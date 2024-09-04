import { GraphQLSchema, DocumentNode } from 'graphql';
import type { ApolloServerPlugin, LandingPage } from 'apollo-server-plugin-base';
import type { GraphQLServerOptions } from './graphqlOptions';
import type { Config, DocumentStore } from './types';
import { GraphQLRequest } from './requestPipeline';
import type { SchemaHash } from 'apollo-server-types';
export declare type SchemaDerivedData = {
    schema: GraphQLSchema;
    schemaHash: SchemaHash;
    documentStore: DocumentStore | null;
};
export declare class ApolloServerBase<ContextFunctionParams = any> {
    private logger;
    graphqlPath: string;
    requestOptions: Partial<GraphQLServerOptions<any>>;
    private context?;
    private apolloConfig;
    protected plugins: ApolloServerPlugin[];
    protected csrfPreventionRequestHeaders: string[] | null;
    private parseOptions;
    private config;
    private state;
    private toDispose;
    private toDisposeLast;
    private drainServers;
    private stopOnTerminationSignals;
    private landingPage;
    constructor(config: Config<ContextFunctionParams>);
    start(): Promise<void>;
    protected _start(): Promise<void>;
    private maybeRegisterTerminationSignalHandlers;
    private _ensureStarted;
    protected ensureStarted(): Promise<void>;
    protected assertStarted(methodName: string): void;
    private logStartupError;
    private constructSchema;
    private maybeAddMocksToConstructedSchema;
    private generateSchemaDerivedData;
    stop(): Promise<void>;
    protected serverlessFramework(): boolean;
    private ensurePluginInstantiation;
    protected graphQLServerOptions(integrationContextArgument?: any): Promise<GraphQLServerOptions>;
    executeOperation(request: Omit<GraphQLRequest, 'query'> & {
        query?: string | DocumentNode;
    }, integrationContextArgument?: ContextFunctionParams): Promise<import("apollo-server-types").GraphQLResponse>;
    protected getLandingPage(): LandingPage | null;
}
export declare type ImplicitlyInstallablePlugin = ApolloServerPlugin & {
    __internal_installed_implicitly__: boolean;
};
export declare function isImplicitlyInstallablePlugin(p: ApolloServerPlugin): p is ImplicitlyInstallablePlugin;
//# sourceMappingURL=ApolloServer.d.ts.map