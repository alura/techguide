import { GraphQLSchema } from 'graphql';
import { SubschemaConfig, Transform } from '@graphql-tools/delegate';
interface FilterObjectFieldDirectivesTransformationContext extends Record<string, any> {
}
export default class FilterObjectFieldDirectives<TContext = Record<string, any>> implements Transform<FilterObjectFieldDirectivesTransformationContext, TContext> {
    private readonly filter;
    constructor(filter: (dirName: string, dirValue: any) => boolean);
    transformSchema(originalWrappingSchema: GraphQLSchema, subschemaConfig: SubschemaConfig<any, any, any, TContext>): GraphQLSchema;
}
export {};
