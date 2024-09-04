"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const TransformObjectFields_js_1 = tslib_1.__importDefault(require("./TransformObjectFields.js"));
class FilterObjectFields {
    constructor(filter) {
        this.transformer = new TransformObjectFields_js_1.default((typeName, fieldName, fieldConfig) => filter(typeName, fieldName, fieldConfig) ? undefined : null);
    }
    transformSchema(originalWrappingSchema, subschemaConfig) {
        return this.transformer.transformSchema(originalWrappingSchema, subschemaConfig);
    }
}
exports.default = FilterObjectFields;
