"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const TransformInterfaceFields_js_1 = tslib_1.__importDefault(require("./TransformInterfaceFields.js"));
class FilterInterfaceFields {
    constructor(filter) {
        this.transformer = new TransformInterfaceFields_js_1.default((typeName, fieldName, fieldConfig) => filter(typeName, fieldName, fieldConfig) ? undefined : null);
    }
    transformSchema(originalWrappingSchema, subschemaConfig) {
        return this.transformer.transformSchema(originalWrappingSchema, subschemaConfig);
    }
}
exports.default = FilterInterfaceFields;
