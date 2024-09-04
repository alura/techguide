"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const TransformInputObjectFields_js_1 = tslib_1.__importDefault(require("./TransformInputObjectFields.js"));
class FilterInputObjectFields {
    constructor(filter, inputObjectNodeTransformer) {
        this.transformer = new TransformInputObjectFields_js_1.default((typeName, fieldName, inputFieldConfig) => filter(typeName, fieldName, inputFieldConfig) ? undefined : null, undefined, inputObjectNodeTransformer);
    }
    transformSchema(originalWrappingSchema, subschemaConfig) {
        return this.transformer.transformSchema(originalWrappingSchema, subschemaConfig);
    }
    transformRequest(originalRequest, delegationContext, transformationContext) {
        return this.transformer.transformRequest(originalRequest, delegationContext, transformationContext);
    }
}
exports.default = FilterInputObjectFields;
