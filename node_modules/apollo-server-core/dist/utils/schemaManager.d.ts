import type { GraphQLSchema } from 'graphql';
import type { ApolloConfig, GraphQLExecutor, GraphQLSchemaContext } from 'apollo-server-types';
import type { Logger } from '@apollo/utils.logger';
import type { GatewayInterface, Unsubscriber } from '../types';
import type { SchemaDerivedData } from '../ApolloServer';
declare type SchemaDerivedDataProvider = (apiSchema: GraphQLSchema) => SchemaDerivedData;
export declare class SchemaManager {
    private readonly logger;
    private readonly schemaDerivedDataProvider;
    private readonly onSchemaLoadOrUpdateListeners;
    private isStopped;
    private schemaDerivedData?;
    private schemaContext?;
    private readonly modeSpecificState;
    constructor(options: ({
        gateway: GatewayInterface;
        apolloConfig: ApolloConfig;
    } | {
        apiSchema: GraphQLSchema;
    }) & {
        logger: Logger;
        schemaDerivedDataProvider: SchemaDerivedDataProvider;
    });
    start(): Promise<GraphQLExecutor | null>;
    onSchemaLoadOrUpdate(callback: (schemaContext: GraphQLSchemaContext) => void): Unsubscriber;
    getSchemaDerivedData(): SchemaDerivedData;
    stop(): Promise<void>;
    private processSchemaLoadOrUpdateEvent;
}
export declare class GatewayIsTooOldError extends Error {
    constructor(message: string);
}
export {};
//# sourceMappingURL=schemaManager.d.ts.map