import { GraphQLSchema } from 'graphql';
import { ExecutionRequest, ExecutionResult } from '@graphql-tools/utils';
import { Transform, DelegationContext, SubschemaConfig } from '@graphql-tools/delegate';
import { RootFieldTransformer, FieldNodeTransformer } from '../types.cjs';
interface TransformRootFieldsTransformationContext extends Record<string, any> {
}
export default class TransformRootFields<TContext = Record<string, any>> implements Transform<TransformRootFieldsTransformationContext, TContext> {
    private readonly rootFieldTransformer;
    private readonly fieldNodeTransformer;
    private transformer;
    constructor(rootFieldTransformer: RootFieldTransformer<TContext>, fieldNodeTransformer?: FieldNodeTransformer);
    private _getTransformer;
    transformSchema(originalWrappingSchema: GraphQLSchema, subschemaConfig: SubschemaConfig<any, any, any, TContext>): GraphQLSchema;
    transformRequest(originalRequest: ExecutionRequest, delegationContext: DelegationContext<TContext>, transformationContext: TransformRootFieldsTransformationContext): ExecutionRequest;
    transformResult(originalResult: ExecutionResult, delegationContext: DelegationContext<TContext>, transformationContext: TransformRootFieldsTransformationContext): ExecutionResult;
}
export {};
