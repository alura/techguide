"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transformer = void 0;
const prepareGatewayDocument_js_1 = require("./prepareGatewayDocument.js");
const finalizeGatewayRequest_js_1 = require("./finalizeGatewayRequest.js");
const checkResultAndHandleErrors_js_1 = require("./checkResultAndHandleErrors.js");
class Transformer {
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
            document: (0, prepareGatewayDocument_js_1.prepareGatewayDocument)(originalRequest.document, this.delegationContext.transformedSchema, this.delegationContext.returnType, (_a = this.delegationContext.info) === null || _a === void 0 ? void 0 : _a.schema),
        };
        for (const transformation of this.transformations) {
            if (transformation.transform.transformRequest) {
                request = transformation.transform.transformRequest(request, this.delegationContext, transformation.context);
            }
        }
        return (0, finalizeGatewayRequest_js_1.finalizeGatewayRequest)(request, this.delegationContext);
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
        return (0, checkResultAndHandleErrors_js_1.checkResultAndHandleErrors)(result, this.delegationContext);
    }
}
exports.Transformer = Transformer;
