import { ExecutionRequest, ExecutionResult } from '@graphql-tools/utils';
import { DelegationContext } from './types.js';
export declare class Transformer<TContext extends Record<string, any> = Record<string, any>> {
    private transformations;
    private delegationContext;
    constructor(context: DelegationContext<TContext>);
    private addTransform;
    transformRequest(originalRequest: ExecutionRequest): ExecutionRequest;
    transformResult(originalResult: ExecutionResult): any;
}
