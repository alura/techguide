import { GraphQLSchema } from 'graphql';
import { ExecutionRequest, ExecutionResult } from '@graphql-tools/utils';
import { Transform, DelegationContext, SubschemaConfig } from '@graphql-tools/delegate';
interface RenameRootTypesTransformationContext extends Record<string, any> {
}
export default class RenameRootTypes<TContext = Record<string, any>> implements Transform<RenameRootTypesTransformationContext, TContext> {
    private readonly renamer;
    private map;
    private reverseMap;
    constructor(renamer: (name: string) => string | undefined);
    transformSchema(originalWrappingSchema: GraphQLSchema, _subschemaConfig: SubschemaConfig<any, any, any, TContext>): GraphQLSchema;
    transformRequest(originalRequest: ExecutionRequest, _delegationContext: DelegationContext<TContext>, _transformationContext: RenameRootTypesTransformationContext): ExecutionRequest;
    transformResult(originalResult: ExecutionResult, _delegationContext: DelegationContext<TContext>, _transformationContext?: RenameRootTypesTransformationContext): ExecutionResult;
}
export {};
