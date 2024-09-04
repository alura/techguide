import { SelectionSetNode, FragmentDefinitionNode } from 'graphql';
import { ExecutionRequest, ExecutionResult } from '@graphql-tools/utils';
import { Transform, DelegationContext } from '@graphql-tools/delegate';
export type QueryTransformer = <TContext>(selectionSet: SelectionSetNode | undefined, fragments: Record<string, FragmentDefinitionNode>, delegationContext: DelegationContext<TContext>, transformationContext: Record<string, any>) => SelectionSetNode;
export type ResultTransformer = <TContext>(result: any, delegationContext: DelegationContext<TContext>, transformationContext: Record<string, any>) => any;
export type ErrorPathTransformer = (path: ReadonlyArray<string | number>) => Array<string | number>;
interface TransformQueryTransformationContext extends Record<string, any> {
}
export default class TransformQuery<TContext = Record<string, any>> implements Transform<TransformQueryTransformationContext, TContext> {
    private readonly path;
    private readonly queryTransformer;
    private readonly resultTransformer;
    private readonly errorPathTransformer;
    private readonly fragments;
    constructor({ path, queryTransformer, resultTransformer, errorPathTransformer, fragments, }: {
        path: Array<string>;
        queryTransformer: QueryTransformer;
        resultTransformer?: ResultTransformer;
        errorPathTransformer?: ErrorPathTransformer;
        fragments?: Record<string, FragmentDefinitionNode>;
    });
    transformRequest(originalRequest: ExecutionRequest, delegationContext: DelegationContext<TContext>, transformationContext: TransformQueryTransformationContext): ExecutionRequest;
    transformResult(originalResult: ExecutionResult, delegationContext: DelegationContext<TContext>, transformationContext: TransformQueryTransformationContext): ExecutionResult;
    private transformData;
    private transformErrors;
}
export {};
