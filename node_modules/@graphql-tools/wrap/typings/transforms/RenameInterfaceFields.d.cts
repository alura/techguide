import { GraphQLSchema, GraphQLFieldConfig } from 'graphql';
import { ExecutionRequest } from '@graphql-tools/utils';
import { Transform, DelegationContext, SubschemaConfig } from '@graphql-tools/delegate';
interface RenameInterfaceFieldsTransformationContext extends Record<string, any> {
}
export default class RenameInterfaceFields<TContext = Record<string, any>> implements Transform<RenameInterfaceFieldsTransformationContext, TContext> {
    private readonly transformer;
    constructor(renamer: (typeName: string, fieldName: string, fieldConfig: GraphQLFieldConfig<any, any>) => string);
    transformSchema(originalWrappingSchema: GraphQLSchema, subschemaConfig: SubschemaConfig<any, any, any, TContext>): GraphQLSchema;
    transformRequest(originalRequest: ExecutionRequest, delegationContext: DelegationContext<TContext>, transformationContext: RenameInterfaceFieldsTransformationContext): ExecutionRequest;
}
export {};
