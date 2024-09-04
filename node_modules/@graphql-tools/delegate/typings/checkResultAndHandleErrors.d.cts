import { GraphQLError } from 'graphql';
import { ExecutionResult } from '@graphql-tools/utils';
import { DelegationContext } from './types.cjs';
export declare function checkResultAndHandleErrors<TContext extends Record<string, any>>(result: ExecutionResult, delegationContext: DelegationContext<TContext>): any;
export declare function mergeDataAndErrors(data: any, errors: ReadonlyArray<GraphQLError>, path: Array<string | number> | undefined, onLocatedError?: (originalError: GraphQLError) => GraphQLError, index?: number): {
    data: any;
    unpathedErrors: Array<GraphQLError>;
};
