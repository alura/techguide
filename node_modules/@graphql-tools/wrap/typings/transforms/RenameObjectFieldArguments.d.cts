import { GraphQLSchema } from 'graphql';
import { ExecutionRequest } from '@graphql-tools/utils';
import { Transform, DelegationContext, SubschemaConfig } from '@graphql-tools/delegate';
type RenamerFunction = (typeName: string, fieldName: string, argName: string) => string;
interface RenameObjectFieldArgumentsTransformationContext extends Record<string, any> {
}
export default class RenameObjectFieldArguments<TContext = Record<string, any>> implements Transform<RenameObjectFieldArgumentsTransformationContext, TContext> {
    private readonly renamer;
    private readonly transformer;
    private reverseMap;
    constructor(renamer: RenamerFunction);
    transformSchema(originalWrappingSchema: GraphQLSchema, subschemaConfig: SubschemaConfig<any, any, any, TContext>): GraphQLSchema;
    transformRequest(originalRequest: ExecutionRequest, delegationContext: DelegationContext<TContext>, transformationContext: RenameObjectFieldArgumentsTransformationContext): ExecutionRequest;
}
export {};
