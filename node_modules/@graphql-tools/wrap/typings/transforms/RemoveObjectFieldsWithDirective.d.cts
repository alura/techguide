import { GraphQLSchema } from 'graphql';
import { SubschemaConfig, Transform } from '@graphql-tools/delegate';
interface RemoveObjectFieldsWithDirectiveTransformationContext extends Record<string, any> {
}
export default class RemoveObjectFieldsWithDirective<TContext = Record<string, any>> implements Transform<RemoveObjectFieldsWithDirectiveTransformationContext, TContext> {
    private readonly directiveName;
    private readonly args;
    constructor(directiveName: string | RegExp, args?: Record<string, any>);
    transformSchema(originalWrappingSchema: GraphQLSchema, subschemaConfig: SubschemaConfig<any, any, any, TContext>): GraphQLSchema;
}
export {};
