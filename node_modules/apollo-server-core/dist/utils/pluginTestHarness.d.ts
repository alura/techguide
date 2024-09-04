import type { CacheHint, WithRequired, GraphQLRequest, GraphQLRequestContextExecutionDidStart, GraphQLResponse, GraphQLRequestContextWillSendResponse, BaseContext } from 'apollo-server-types';
import type { Logger } from '@apollo/utils.logger';
import { GraphQLSchema } from 'graphql/type';
import type { ApolloServerPlugin } from 'apollo-server-plugin-base';
declare type IPluginTestHarnessGraphqlRequest = WithRequired<GraphQLRequest, 'query'>;
declare type IPluginTestHarnessExecutionDidStart<TContext> = GraphQLRequestContextExecutionDidStart<TContext> & {
    request: IPluginTestHarnessGraphqlRequest;
};
export default function pluginTestHarness<TContext extends BaseContext>({ pluginInstance, schema, logger, graphqlRequest, overallCachePolicy, executor, context, }: {
    pluginInstance: ApolloServerPlugin<TContext>;
    schema?: GraphQLSchema;
    logger?: Logger;
    graphqlRequest: IPluginTestHarnessGraphqlRequest;
    overallCachePolicy?: Required<CacheHint>;
    executor: (requestContext: IPluginTestHarnessExecutionDidStart<TContext>) => Promise<GraphQLResponse>;
    context?: TContext;
}): Promise<GraphQLRequestContextWillSendResponse<TContext>>;
export {};
//# sourceMappingURL=pluginTestHarness.d.ts.map