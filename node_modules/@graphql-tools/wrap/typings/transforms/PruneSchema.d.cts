import { GraphQLSchema } from 'graphql';
import { PruneSchemaOptions } from '@graphql-tools/utils';
import { SubschemaConfig, Transform } from '@graphql-tools/delegate';
interface PruneTypesTransformationContext extends Record<string, any> {
}
export default class PruneTypes<TContext = Record<string, any>> implements Transform<PruneTypesTransformationContext, TContext> {
    private readonly options;
    constructor(options?: PruneSchemaOptions);
    transformSchema(originalWrappingSchema: GraphQLSchema, _subschemaConfig: SubschemaConfig<any, any, any, TContext>): GraphQLSchema;
}
export {};
