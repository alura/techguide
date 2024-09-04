import { GraphQLSchema } from 'graphql';
import { ExecutionRequest, InputFieldFilter } from '@graphql-tools/utils';
import { Transform, DelegationContext, SubschemaConfig } from '@graphql-tools/delegate';
import { InputObjectNodeTransformer } from '../types.cjs';
interface FilterInputObjectFieldsTransformationContext extends Record<string, any> {
}
export default class FilterInputObjectFields<TContext = Record<string, any>> implements Transform<FilterInputObjectFieldsTransformationContext, TContext> {
    private readonly transformer;
    constructor(filter: InputFieldFilter, inputObjectNodeTransformer?: InputObjectNodeTransformer);
    transformSchema(originalWrappingSchema: GraphQLSchema, subschemaConfig: SubschemaConfig<any, any, any, TContext>): GraphQLSchema;
    transformRequest(originalRequest: ExecutionRequest, delegationContext: DelegationContext<TContext>, transformationContext: FilterInputObjectFieldsTransformationContext): ExecutionRequest;
}
export {};
