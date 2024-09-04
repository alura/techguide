import type { AnyFunctionMap, BaseContext, GraphQLServiceContext, GraphQLRequestContext, GraphQLRequest, GraphQLResponse, WithRequired, GraphQLFieldResolverParams, GraphQLRequestContextDidResolveSource, GraphQLRequestContextParsingDidStart, GraphQLRequestContextValidationDidStart, GraphQLRequestContextDidResolveOperation, GraphQLRequestContextDidEncounterErrors, GraphQLRequestContextResponseForOperation, GraphQLRequestContextExecutionDidStart, GraphQLRequestContextWillSendResponse, GraphQLSchemaContext } from 'apollo-server-types';
export { BaseContext, GraphQLServiceContext, GraphQLRequestContext, GraphQLRequest, GraphQLResponse, WithRequired, GraphQLFieldResolverParams, GraphQLRequestContextDidResolveSource, GraphQLRequestContextParsingDidStart, GraphQLRequestContextValidationDidStart, GraphQLRequestContextDidResolveOperation, GraphQLRequestContextDidEncounterErrors, GraphQLRequestContextResponseForOperation, GraphQLRequestContextExecutionDidStart, GraphQLRequestContextWillSendResponse, GraphQLSchemaContext, };
export interface ApolloServerPlugin<TContext extends BaseContext = BaseContext> {
    serverWillStart?(service: GraphQLServiceContext): Promise<GraphQLServerListener | void>;
    requestDidStart?(requestContext: GraphQLRequestContext<TContext>): Promise<GraphQLRequestListener<TContext> | void>;
}
export interface GraphQLServerListener {
    schemaDidLoadOrUpdate?(schemaContext: GraphQLSchemaContext): void;
    drainServer?(): Promise<void>;
    serverWillStop?(): Promise<void>;
    renderLandingPage?(): Promise<LandingPage>;
}
export interface LandingPage {
    html: string;
}
export declare type GraphQLRequestListenerParsingDidEnd = (err?: Error) => Promise<void>;
export declare type GraphQLRequestListenerValidationDidEnd = (err?: ReadonlyArray<Error>) => Promise<void>;
export declare type GraphQLRequestListenerExecutionDidEnd = (err?: Error) => Promise<void>;
export declare type GraphQLRequestListenerDidResolveField = (error: Error | null, result?: any) => void;
export interface GraphQLRequestListener<TContext extends BaseContext = BaseContext> extends AnyFunctionMap {
    didResolveSource?(requestContext: GraphQLRequestContextDidResolveSource<TContext>): Promise<void>;
    parsingDidStart?(requestContext: GraphQLRequestContextParsingDidStart<TContext>): Promise<GraphQLRequestListenerParsingDidEnd | void>;
    validationDidStart?(requestContext: GraphQLRequestContextValidationDidStart<TContext>): Promise<GraphQLRequestListenerValidationDidEnd | void>;
    didResolveOperation?(requestContext: GraphQLRequestContextDidResolveOperation<TContext>): Promise<void>;
    didEncounterErrors?(requestContext: GraphQLRequestContextDidEncounterErrors<TContext>): Promise<void>;
    responseForOperation?(requestContext: GraphQLRequestContextResponseForOperation<TContext>): Promise<GraphQLResponse | null>;
    executionDidStart?(requestContext: GraphQLRequestContextExecutionDidStart<TContext>): Promise<GraphQLRequestExecutionListener | void>;
    willSendResponse?(requestContext: GraphQLRequestContextWillSendResponse<TContext>): Promise<void>;
}
export interface GraphQLRequestExecutionListener<TContext extends BaseContext = BaseContext> extends AnyFunctionMap {
    executionDidEnd?: GraphQLRequestListenerExecutionDidEnd;
    willResolveField?(fieldResolverParams: GraphQLFieldResolverParams<any, TContext>): GraphQLRequestListenerDidResolveField | void;
}
//# sourceMappingURL=index.d.ts.map