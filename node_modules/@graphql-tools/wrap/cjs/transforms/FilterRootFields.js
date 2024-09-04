"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const TransformRootFields_js_1 = tslib_1.__importDefault(require("./TransformRootFields.js"));
class FilterRootFields {
    constructor(filter) {
        this.transformer = new TransformRootFields_js_1.default((operation, fieldName, fieldConfig) => {
            if (filter(operation, fieldName, fieldConfig)) {
                return undefined;
            }
            return null;
        });
    }
    transformSchema(originalWrappingSchema, subschemaConfig) {
        return this.transformer.transformSchema(originalWrappingSchema, subschemaConfig);
    }
}
exports.default = FilterRootFields;
