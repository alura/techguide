import { GraphQLSchema } from 'graphql';
import { ExecutionRequest, ExecutionResult } from '@graphql-tools/utils';
import { Transform, DelegationContext, SubschemaConfig } from '@graphql-tools/delegate';
import { FieldTransformer, FieldNodeTransformer } from '../types.js';
interface TransformInterfaceFieldsTransformationContext extends Record<string, any> {
}
export default class TransformInterfaceFields<TContext = Record<string, any>> implements Transform<TransformInterfaceFieldsTransformationContext, TContext> {
    private readonly interfaceFieldTransformer;
    private readonly fieldNodeTransformer;
    private transformer;
    constructor(interfaceFieldTransformer: FieldTransformer<TContext>, fieldNodeTransformer?: FieldNodeTransformer);
    private _getTransformer;
    transformSchema(originalWrappingSchema: GraphQLSchema, subschemaConfig: SubschemaConfig<any, any, any, TContext>): GraphQLSchema;
    transformRequest(originalRequest: ExecutionRequest, delegationContext: DelegationContext<TContext>, transformationContext: TransformInterfaceFieldsTransformationContext): ExecutionRequest;
    transformResult(originalResult: ExecutionResult, delegationContext: DelegationContext<TContext>, transformationContext: TransformInterfaceFieldsTransformationContext): ExecutionResult;
}
export {};
