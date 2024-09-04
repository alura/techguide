"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const TransformObjectFields_js_1 = tslib_1.__importDefault(require("./TransformObjectFields.js"));
class RenameObjectFields {
    constructor(renamer) {
        this.transformer = new TransformObjectFields_js_1.default((typeName, fieldName, fieldConfig) => [
            renamer(typeName, fieldName, fieldConfig),
            fieldConfig,
        ]);
    }
    transformSchema(originalWrappingSchema, subschemaConfig) {
        return this.transformer.transformSchema(originalWrappingSchema, subschemaConfig);
    }
    transformRequest(originalRequest, delegationContext, transformationContext) {
        return this.transformer.transformRequest(originalRequest, delegationContext, transformationContext);
    }
}
exports.default = RenameObjectFields;
