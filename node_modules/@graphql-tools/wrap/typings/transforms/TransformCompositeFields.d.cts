import { GraphQLSchema } from 'graphql';
import { ExecutionRequest, ExecutionResult } from '@graphql-tools/utils';
import { Transform, DelegationContext, SubschemaConfig } from '@graphql-tools/delegate';
import { FieldTransformer, FieldNodeTransformer, DataTransformer, ErrorsTransformer } from '../types.cjs';
interface TransformCompositeFieldsTransformationContext extends Record<string, any> {
}
export default class TransformCompositeFields<TContext = Record<string, any>> implements Transform<TransformCompositeFieldsTransformationContext, TContext> {
    private readonly fieldTransformer;
    private readonly fieldNodeTransformer;
    private readonly dataTransformer;
    private readonly errorsTransformer;
    private transformedSchema;
    private typeInfo;
    private mapping;
    private subscriptionTypeName;
    constructor(fieldTransformer: FieldTransformer<TContext>, fieldNodeTransformer?: FieldNodeTransformer, dataTransformer?: DataTransformer, errorsTransformer?: ErrorsTransformer);
    private _getTypeInfo;
    transformSchema(originalWrappingSchema: GraphQLSchema, _subschemaConfig: SubschemaConfig<any, any, any, TContext>): GraphQLSchema;
    transformRequest(originalRequest: ExecutionRequest, _delegationContext: DelegationContext<TContext>, transformationContext: TransformCompositeFieldsTransformationContext): ExecutionRequest;
    transformResult(result: ExecutionResult, _delegationContext: DelegationContext<TContext>, transformationContext: TransformCompositeFieldsTransformationContext): ExecutionResult;
    private transformDocument;
    private transformSelectionSet;
}
export {};
