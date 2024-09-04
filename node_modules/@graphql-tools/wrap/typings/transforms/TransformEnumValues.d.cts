import { GraphQLSchema } from 'graphql';
import { ExecutionRequest, ExecutionResult } from '@graphql-tools/utils';
import { Transform, DelegationContext, SubschemaConfig } from '@graphql-tools/delegate';
import { EnumValueTransformer, LeafValueTransformer } from '../types.cjs';
import { MapLeafValuesTransformationContext } from './MapLeafValues.cjs';
interface TransformEnumValuesTransformationContext extends MapLeafValuesTransformationContext {
}
export default class TransformEnumValues<TContext = Record<string, any>> implements Transform<TransformEnumValuesTransformationContext, TContext> {
    private readonly enumValueTransformer;
    private readonly transformer;
    private transformedSchema;
    private mapping;
    private reverseMapping;
    private noTransformation;
    constructor(enumValueTransformer: EnumValueTransformer, inputValueTransformer?: LeafValueTransformer, outputValueTransformer?: LeafValueTransformer);
    transformSchema(originalWrappingSchema: GraphQLSchema, subschemaConfig: SubschemaConfig<any, any, any, TContext>): GraphQLSchema;
    transformRequest(originalRequest: ExecutionRequest, delegationContext: DelegationContext<TContext>, transformationContext: TransformEnumValuesTransformationContext): ExecutionRequest;
    transformResult(originalResult: ExecutionResult, delegationContext: DelegationContext<TContext>, transformationContext: TransformEnumValuesTransformationContext): ExecutionResult<any, any>;
    private transformEnumValue;
}
export {};
