import type { GraphQLError, DocumentNode } from 'graphql';
import type { GraphQLRequestContextDidResolveOperation, GraphQLRequestContext, GraphQLRequestContextWillSendResponse } from 'apollo-server-types';
import type { Logger } from '@apollo/utils.logger';
import type { fetch, RequestAgent } from 'apollo-server-env';
import type { Trace } from 'apollo-reporting-protobuf';
export interface ApolloServerPluginUsageReportingOptions<TContext> {
    sendVariableValues?: VariableValueOptions;
    sendHeaders?: SendValuesBaseOptions;
    rewriteError?: (err: GraphQLError) => GraphQLError | null;
    fieldLevelInstrumentation?: number | ((request: GraphQLRequestContextDidResolveOperation<TContext>) => Promise<number | boolean>);
    includeRequest?: (request: GraphQLRequestContextDidResolveOperation<TContext> | GraphQLRequestContextWillSendResponse<TContext>) => Promise<boolean>;
    generateClientInfo?: GenerateClientInfo<TContext>;
    overrideReportedSchema?: string;
    sendUnexecutableOperationDocuments?: boolean;
    experimental_sendOperationAsTrace?: (trace: Trace, statsReportKey: string) => boolean;
    sendReportsImmediately?: boolean;
    requestAgent?: RequestAgent | false;
    fetcher?: typeof fetch;
    reportIntervalMs?: number;
    maxUncompressedReportSize?: number;
    maxAttempts?: number;
    minimumRetryDelayMs?: number;
    requestTimeoutMs?: number;
    logger?: Logger;
    reportErrorFunction?: (err: Error) => void;
    endpointUrl?: string;
    debugPrintReports?: boolean;
    calculateSignature?: (ast: DocumentNode, operationName: string) => string;
    internal_includeTracesContributingToStats?: boolean;
}
export declare type SendValuesBaseOptions = {
    onlyNames: Array<String>;
} | {
    exceptNames: Array<String>;
} | {
    all: true;
} | {
    none: true;
};
declare type VariableValueTransformOptions = {
    variables: Record<string, any>;
    operationString?: string;
};
export declare type VariableValueOptions = {
    transform: (options: VariableValueTransformOptions) => Record<string, any>;
} | SendValuesBaseOptions;
export interface ClientInfo {
    clientName?: string;
    clientVersion?: string;
}
export declare type GenerateClientInfo<TContext> = (requestContext: GraphQLRequestContext<TContext>) => ClientInfo;
export {};
//# sourceMappingURL=options.d.ts.map