"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const WrapFields_js_1 = tslib_1.__importDefault(require("./WrapFields.js"));
class WrapType {
    constructor(outerTypeName, innerTypeName, fieldName) {
        this.transformer = new WrapFields_js_1.default(outerTypeName, [fieldName], [innerTypeName]);
    }
    transformSchema(originalWrappingSchema, subschemaConfig) {
        return this.transformer.transformSchema(originalWrappingSchema, subschemaConfig);
    }
    transformRequest(originalRequest, delegationContext, transformationContext) {
        return this.transformer.transformRequest(originalRequest, delegationContext, transformationContext);
    }
    transformResult(originalResult, delegationContext, transformationContext) {
        return this.transformer.transformResult(originalResult, delegationContext, transformationContext);
    }
}
exports.default = WrapType;
