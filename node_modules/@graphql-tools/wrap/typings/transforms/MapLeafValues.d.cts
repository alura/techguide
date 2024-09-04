import { GraphQLSchema } from 'graphql';
import { ExecutionRequest, ExecutionResult } from '@graphql-tools/utils';
import { Transform, DelegationContext, SubschemaConfig } from '@graphql-tools/delegate';
import { LeafValueTransformer } from '../types.cjs';
export interface MapLeafValuesTransformationContext {
    transformedRequest: ExecutionRequest;
}
export default class MapLeafValues<TContext = Record<string, any>> implements Transform<MapLeafValuesTransformationContext, TContext> {
    private readonly inputValueTransformer;
    private readonly outputValueTransformer;
    private readonly resultVisitorMap;
    private typeInfo?;
    constructor(inputValueTransformer: LeafValueTransformer, outputValueTransformer: LeafValueTransformer);
    private originalWrappingSchema?;
    transformSchema(originalWrappingSchema: GraphQLSchema, _subschemaConfig: SubschemaConfig<any, any, any, TContext>): GraphQLSchema;
    transformRequest(originalRequest: ExecutionRequest, delegationContext: DelegationContext<TContext>, transformationContext: MapLeafValuesTransformationContext): ExecutionRequest;
    transformResult(originalResult: ExecutionResult, _delegationContext: DelegationContext<TContext>, transformationContext: MapLeafValuesTransformationContext): ExecutionResult;
    private transformOperations;
    private transformFieldNode;
}
