import { GraphQLSchema } from 'graphql';
import { ExecutionRequest } from '@graphql-tools/utils';
import { Transform, DelegationContext, SubschemaConfig } from '@graphql-tools/delegate';
import { InputFieldTransformer, InputFieldNodeTransformer, InputObjectNodeTransformer } from '../types.cjs';
interface TransformInputObjectFieldsTransformationContext extends Record<string, any> {
}
export default class TransformInputObjectFields<TContext = Record<string, any>> implements Transform<TransformInputObjectFieldsTransformationContext, TContext> {
    private readonly inputFieldTransformer;
    private readonly inputFieldNodeTransformer;
    private readonly inputObjectNodeTransformer;
    private transformedSchema;
    private mapping;
    constructor(inputFieldTransformer: InputFieldTransformer, inputFieldNodeTransformer?: InputFieldNodeTransformer, inputObjectNodeTransformer?: InputObjectNodeTransformer);
    private _getTransformedSchema;
    transformSchema(originalWrappingSchema: GraphQLSchema, _subschemaConfig: SubschemaConfig<any, any, any, TContext>): GraphQLSchema;
    transformRequest(originalRequest: ExecutionRequest, delegationContext: DelegationContext<TContext>, _transformationContext: TransformInputObjectFieldsTransformationContext): ExecutionRequest;
    private transformDocument;
}
export {};
