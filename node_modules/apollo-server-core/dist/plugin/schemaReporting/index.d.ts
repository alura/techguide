import type { InternalApolloServerPlugin } from '../../internalPlugin';
import type { fetch } from 'apollo-server-env';
export interface ApolloServerPluginSchemaReportingOptions {
    initialDelayMaxMs?: number;
    overrideReportedSchema?: string;
    endpointUrl?: string;
    fetcher?: typeof fetch;
}
export declare function ApolloServerPluginSchemaReporting({ initialDelayMaxMs, overrideReportedSchema, endpointUrl, fetcher, }?: ApolloServerPluginSchemaReportingOptions): InternalApolloServerPlugin;
export declare function computeCoreSchemaHash(schema: string): string;
//# sourceMappingURL=index.d.ts.map