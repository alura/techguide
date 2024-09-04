import { prepareGatewayDocument } from './prepareGatewayDocument.js';
import { finalizeGatewayRequest } from './finalizeGatewayRequest.js';
import { checkResultAndHandleErrors } from './checkResultAndHandleErrors.js';
export class Transformer {
    constructor(context) {
        this.transformations = [];
        this.delegationContext = context;
        const transforms = context.transforms;
        const delegationTransforms = transforms.slice().reverse();
        for (const transform of delegationTransforms) {
            this.addTransform(transform, {});
        }
    }
    addTransform(transform, context = {}) {
        this.transformations.push({ transform, context });
    }
    transformRequest(originalRequest) {
        var _a;
        let request = {
            ...originalRequest,
            document: prepareGatewayDocument(originalRequest.document, this.delegationContext.transformedSchema, this.delegationContext.returnType, (_a = this.delegationContext.info) === null || _a === void 0 ? void 0 : _a.schema),
        };
        for (const transformation of this.transformations) {
            if (transformation.transform.transformRequest) {
                request = transformation.transform.transformRequest(request, this.delegationContext, transformation.context);
            }
        }
        return finalizeGatewayRequest(request, this.delegationContext);
    }
    transformResult(originalResult) {
        let result = originalResult;
        // from right to left
        for (let i = this.transformations.length - 1; i >= 0; i--) {
            const transformation = this.transformations[i];
            if (transformation.transform.transformResult) {
                result = transformation.transform.transformResult(result, this.delegationContext, transformation.context);
            }
        }
        return checkResultAndHandleErrors(result, this.delegationContext);
    }
}
