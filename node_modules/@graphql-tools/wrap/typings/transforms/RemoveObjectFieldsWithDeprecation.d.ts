import { GraphQLSchema } from 'graphql';
import { SubschemaConfig, Transform } from '@graphql-tools/delegate';
interface RemoveObjectFieldsWithDeprecationTransformationContext extends Record<string, any> {
}
export default class RemoveObjectFieldsWithDeprecation<TContext = Record<string, any>> implements Transform<RemoveObjectFieldsWithDeprecationTransformationContext, TContext> {
    private readonly transformer;
    constructor(reason: string | RegExp);
    transformSchema(originalWrappingSchema: GraphQLSchema, subschemaConfig: SubschemaConfig<any, any, any, TContext>): GraphQLSchema;
}
export {};
