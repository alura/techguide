import { GraphQLSchema } from 'graphql';
import { SubschemaConfig, Transform } from '@graphql-tools/delegate';
interface RemoveObjectFieldDeprecationsTransformationContext extends Record<string, any> {
}
export default class RemoveObjectFieldDeprecations<TContext = Record<string, any>> implements Transform<RemoveObjectFieldDeprecationsTransformationContext, TContext> {
    private readonly removeDirectives;
    private readonly removeDeprecations;
    constructor(reason: string | RegExp);
    transformSchema(originalWrappingSchema: GraphQLSchema, subschemaConfig: SubschemaConfig<any, any, any, TContext>): GraphQLSchema;
}
export {};
