import { GraphQLSchema } from 'graphql';
import { ExecutionRequest, ExecutionResult } from '@graphql-tools/utils';
import { Transform, DelegationContext, SubschemaConfig } from '@graphql-tools/delegate';
interface WrapTypeTransformationContext extends Record<string, any> {
}
export default class WrapType<TContext extends Record<string, any> = Record<string, any>> implements Transform<WrapTypeTransformationContext, TContext> {
    private readonly transformer;
    constructor(outerTypeName: string, innerTypeName: string, fieldName: string);
    transformSchema(originalWrappingSchema: GraphQLSchema, subschemaConfig: SubschemaConfig<any, any, any, TContext>): GraphQLSchema;
    transformRequest(originalRequest: ExecutionRequest, delegationContext: DelegationContext<TContext>, transformationContext: WrapTypeTransformationContext): ExecutionRequest;
    transformResult(originalResult: ExecutionResult, delegationContext: DelegationContext<TContext>, transformationContext: WrapTypeTransformationContext): ExecutionResult;
}
export {};
