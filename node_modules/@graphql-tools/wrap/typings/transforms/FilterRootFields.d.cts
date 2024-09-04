import { GraphQLSchema } from 'graphql';
import { RootFieldFilter } from '@graphql-tools/utils';
import { SubschemaConfig, Transform } from '@graphql-tools/delegate';
interface FilterRootFieldsTransformationContext extends Record<string, any> {
}
export default class FilterRootFields<TContext = Record<string, any>> implements Transform<FilterRootFieldsTransformationContext, TContext> {
    private readonly transformer;
    constructor(filter: RootFieldFilter);
    transformSchema(originalWrappingSchema: GraphQLSchema, subschemaConfig: SubschemaConfig<any, any, any, TContext>): GraphQLSchema;
}
export {};
