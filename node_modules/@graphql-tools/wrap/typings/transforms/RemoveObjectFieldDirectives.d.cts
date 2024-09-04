import { GraphQLSchema } from 'graphql';
import { SubschemaConfig, Transform } from '@graphql-tools/delegate';
interface RemoveObjectFieldDirectivesTransformationContext extends Record<string, any> {
}
export default class RemoveObjectFieldDirectives<TContext = Record<string, any>> implements Transform<RemoveObjectFieldDirectivesTransformationContext, TContext> {
    private readonly transformer;
    constructor(directiveName: string | RegExp, args?: Record<string, any>);
    transformSchema(originalWrappingSchema: GraphQLSchema, subschemaConfig: SubschemaConfig<any, any, any, TContext>): GraphQLSchema;
}
export {};
