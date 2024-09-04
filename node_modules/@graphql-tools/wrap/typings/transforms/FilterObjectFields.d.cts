import { GraphQLSchema } from 'graphql';
import { ObjectFieldFilter } from '@graphql-tools/utils';
import { SubschemaConfig, Transform } from '@graphql-tools/delegate';
interface FilterObjectFieldsTransformationContext extends Record<string, any> {
}
export default class FilterObjectFields<TContext = Record<string, any>> implements Transform<FilterObjectFieldsTransformationContext, TContext> {
    private readonly transformer;
    constructor(filter: ObjectFieldFilter);
    transformSchema(originalWrappingSchema: GraphQLSchema, subschemaConfig: SubschemaConfig<any, any, any, TContext>): GraphQLSchema;
}
export {};
