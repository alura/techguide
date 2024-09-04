import { SelectionNode, SelectionSetNode } from 'graphql';
import { ExecutionRequest, ExecutionResult } from '@graphql-tools/utils';
import { Transform, DelegationContext } from '@graphql-tools/delegate';
export type QueryWrapper = (subtree: SelectionSetNode) => SelectionNode | SelectionSetNode;
interface WrapQueryTransformationContext extends Record<string, any> {
}
export default class WrapQuery<TContext = Record<string, any>> implements Transform<WrapQueryTransformationContext, TContext> {
    private readonly wrapper;
    private readonly extractor;
    private readonly path;
    constructor(path: Array<string>, wrapper: QueryWrapper, extractor: (result: any) => any);
    transformRequest(originalRequest: ExecutionRequest, _delegationContext: DelegationContext<TContext>, _transformationContext: WrapQueryTransformationContext): ExecutionRequest;
    transformResult(originalResult: ExecutionResult, _delegationContext: DelegationContext<TContext>, _transformationContext: WrapQueryTransformationContext): ExecutionResult;
}
export {};
