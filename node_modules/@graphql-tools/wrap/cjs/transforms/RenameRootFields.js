"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const TransformRootFields_js_1 = tslib_1.__importDefault(require("./TransformRootFields.js"));
class RenameRootFields {
    constructor(renamer) {
        this.transformer = new TransformRootFields_js_1.default((operation, fieldName, fieldConfig) => [renamer(operation, fieldName, fieldConfig), fieldConfig]);
    }
    transformSchema(originalWrappingSchema, subschemaConfig) {
        return this.transformer.transformSchema(originalWrappingSchema, subschemaConfig);
    }
    transformRequest(originalRequest, delegationContext, transformationContext) {
        return this.transformer.transformRequest(originalRequest, delegationContext, transformationContext);
    }
}
exports.default = RenameRootFields;
