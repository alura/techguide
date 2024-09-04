import { GraphQLSchema, GraphQLFieldConfig } from 'graphql';
import { ExecutionRequest } from '@graphql-tools/utils';
import { Transform, DelegationContext, SubschemaConfig } from '@graphql-tools/delegate';
interface RenameRootFieldsTransformationContext extends Record<string, any> {
}
export default class RenameRootFields<TContext = Record<string, any>> implements Transform<RenameRootFieldsTransformationContext, TContext> {
    private readonly transformer;
    constructor(renamer: (operation: 'Query' | 'Mutation' | 'Subscription', name: string, fieldConfig: GraphQLFieldConfig<any, any>) => string);
    transformSchema(originalWrappingSchema: GraphQLSchema, subschemaConfig: SubschemaConfig<any, any, any, TContext>): GraphQLSchema;
    transformRequest(originalRequest: ExecutionRequest, delegationContext: DelegationContext<TContext>, transformationContext: RenameRootFieldsTransformationContext): ExecutionRequest;
}
export {};
