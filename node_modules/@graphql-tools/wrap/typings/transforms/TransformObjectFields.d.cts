import { GraphQLSchema } from 'graphql';
import { ExecutionRequest, ExecutionResult } from '@graphql-tools/utils';
import { Transform, DelegationContext, SubschemaConfig } from '@graphql-tools/delegate';
import { FieldTransformer, FieldNodeTransformer } from '../types.cjs';
interface TransformObjectFieldsTransformationContext extends Record<string, any> {
}
export default class TransformObjectFields<TContext = Record<string, any>> implements Transform<TransformObjectFieldsTransformationContext, TContext> {
    private readonly objectFieldTransformer;
    private readonly fieldNodeTransformer;
    private transformer;
    constructor(objectFieldTransformer: FieldTransformer<TContext>, fieldNodeTransformer?: FieldNodeTransformer);
    private _getTransformer;
    transformSchema(originalWrappingSchema: GraphQLSchema, subschemaConfig: SubschemaConfig<any, any, any, TContext>): GraphQLSchema;
    transformRequest(originalRequest: ExecutionRequest, delegationContext: DelegationContext<TContext>, transformationContext: TransformObjectFieldsTransformationContext): ExecutionRequest;
    transformResult(originalResult: ExecutionResult, delegationContext: DelegationContext<TContext>, transformationContext: TransformObjectFieldsTransformationContext): ExecutionResult;
}
export {};
