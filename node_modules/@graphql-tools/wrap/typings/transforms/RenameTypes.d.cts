import { GraphQLSchema } from 'graphql';
import { ExecutionRequest, ExecutionResult, RenameTypesOptions } from '@graphql-tools/utils';
import { Transform, DelegationContext, SubschemaConfig } from '@graphql-tools/delegate';
interface RenameTypesTransformationContext extends Record<string, any> {
}
export default class RenameTypes<TContext = Record<string, any>> implements Transform<RenameTypesTransformationContext, TContext> {
    private readonly renamer;
    private map;
    private reverseMap;
    private readonly renameBuiltins;
    private readonly renameScalars;
    constructor(renamer: (name: string) => string | undefined, options?: RenameTypesOptions);
    transformSchema(originalWrappingSchema: GraphQLSchema, _subschemaConfig: SubschemaConfig<any, any, any, TContext>): GraphQLSchema;
    transformRequest(originalRequest: ExecutionRequest, _delegationContext: DelegationContext<TContext>, _transformationContext: RenameTypesTransformationContext): ExecutionRequest;
    transformResult(originalResult: ExecutionResult, _delegationContext: DelegationContext<TContext>, _transformationContext?: RenameTypesTransformationContext): ExecutionResult;
}
export {};
