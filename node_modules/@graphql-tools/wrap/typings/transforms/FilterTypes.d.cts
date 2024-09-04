import { GraphQLSchema, GraphQLNamedType } from 'graphql';
import { SubschemaConfig, Transform } from '@graphql-tools/delegate';
interface FilterTypesTransformationContext extends Record<string, any> {
}
export default class FilterTypes<TContext = Record<string, any>> implements Transform<FilterTypesTransformationContext, TContext> {
    private readonly filter;
    constructor(filter: (type: GraphQLNamedType) => boolean);
    transformSchema(originalWrappingSchema: GraphQLSchema, _subschemaConfig: SubschemaConfig<any, any, any, TContext>): GraphQLSchema;
}
export {};
