import { GraphQLSchema } from 'graphql';
import { ExecutionRequest, FieldNodeMappers, ExecutionResult } from '@graphql-tools/utils';
import { Transform, DelegationContext, SubschemaConfig } from '@graphql-tools/delegate';
import { ObjectValueTransformerMap, ErrorsTransformer } from '../types.cjs';
interface MapFieldsTransformationContext extends Record<string, any> {
}
export default class MapFields<TContext> implements Transform<MapFieldsTransformationContext, TContext> {
    private fieldNodeTransformerMap;
    private objectValueTransformerMap?;
    private errorsTransformer?;
    private transformer;
    constructor(fieldNodeTransformerMap: FieldNodeMappers, objectValueTransformerMap?: ObjectValueTransformerMap, errorsTransformer?: ErrorsTransformer);
    private _getTransformer;
    transformSchema(originalWrappingSchema: GraphQLSchema, subschemaConfig: SubschemaConfig<any, any, any, TContext>): GraphQLSchema;
    transformRequest(originalRequest: ExecutionRequest, delegationContext: DelegationContext<TContext>, transformationContext: MapFieldsTransformationContext): ExecutionRequest;
    transformResult(originalResult: ExecutionResult, delegationContext: DelegationContext<TContext>, transformationContext: MapFieldsTransformationContext): ExecutionResult;
}
export {};
