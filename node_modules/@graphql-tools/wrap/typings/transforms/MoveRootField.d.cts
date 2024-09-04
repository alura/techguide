import { GraphQLSchema, OperationTypeNode } from 'graphql';
import { ExecutionRequest, ExecutionResult } from '@graphql-tools/utils';
import { DelegationContext, Transform } from '@graphql-tools/delegate';
export declare class MoveRootField implements Transform {
    private from;
    private to;
    constructor(from: Record<OperationTypeNode, Record<string, OperationTypeNode>>);
    transformSchema(schema: GraphQLSchema, _subschemaConfig: Record<string, any>): GraphQLSchema;
    transformRequest(originalRequest: ExecutionRequest, delegationContext: DelegationContext): ExecutionRequest;
    transformResult(result: ExecutionResult, delegationContext: DelegationContext): ExecutionResult<any, any>;
}
