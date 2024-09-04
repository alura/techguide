import { GraphQLSchema } from 'graphql';
import { FieldFilter } from '@graphql-tools/utils';
import { SubschemaConfig, Transform } from '@graphql-tools/delegate';
interface FilterInterfaceFieldsTransformationContext extends Record<string, any> {
}
export default class FilterInterfaceFields<TContext = Record<string, any>> implements Transform<FilterInterfaceFieldsTransformationContext, TContext> {
    private readonly transformer;
    constructor(filter: FieldFilter);
    transformSchema(originalWrappingSchema: GraphQLSchema, subschemaConfig: SubschemaConfig<any, any, any, TContext>): GraphQLSchema;
}
export {};
