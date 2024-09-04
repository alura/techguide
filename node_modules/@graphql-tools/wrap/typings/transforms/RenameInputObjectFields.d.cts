import { GraphQLSchema, GraphQLInputFieldConfig } from 'graphql';
import { ExecutionRequest } from '@graphql-tools/utils';
import { Transform, DelegationContext, SubschemaConfig } from '@graphql-tools/delegate';
type RenamerFunction = (typeName: string, fieldName: string, inputFieldConfig: GraphQLInputFieldConfig) => string | undefined;
interface RenameInputObjectFieldsTransformationContext extends Record<string, any> {
}
export default class RenameInputObjectFields<TContext = Record<string, any>> implements Transform<RenameInputObjectFieldsTransformationContext, TContext> {
    private readonly renamer;
    private readonly transformer;
    private reverseMap;
    constructor(renamer: RenamerFunction);
    transformSchema(originalWrappingSchema: GraphQLSchema, subschemaConfig: SubschemaConfig<any, any, any, TContext>): GraphQLSchema;
    transformRequest(originalRequest: ExecutionRequest, delegationContext: DelegationContext<TContext>, transformationContext: RenameInputObjectFieldsTransformationContext): ExecutionRequest;
}
export {};
