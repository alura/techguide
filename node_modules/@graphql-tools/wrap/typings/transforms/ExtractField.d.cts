import { ExecutionRequest } from '@graphql-tools/utils';
import { Transform, DelegationContext } from '@graphql-tools/delegate';
interface ExtractFieldTransformationContext extends Record<string, any> {
}
export default class ExtractField<TContext = Record<string, any>> implements Transform<ExtractFieldTransformationContext, TContext> {
    private readonly from;
    private readonly to;
    constructor({ from, to }: {
        from: Array<string>;
        to: Array<string>;
    });
    transformRequest(originalRequest: ExecutionRequest, _delegationContext: DelegationContext<TContext>, _transformationContext: ExtractFieldTransformationContext): ExecutionRequest;
}
export {};
