"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const utils_1 = require("@graphql-tools/utils");
const FilterObjectFields_js_1 = tslib_1.__importDefault(require("./FilterObjectFields.js"));
class RemoveObjectFieldsWithDeprecation {
    constructor(reason) {
        this.transformer = new FilterObjectFields_js_1.default((_typeName, _fieldName, fieldConfig) => {
            if (fieldConfig.deprecationReason) {
                return !(0, utils_1.valueMatchesCriteria)(fieldConfig.deprecationReason, reason);
            }
            return true;
        });
    }
    transformSchema(originalWrappingSchema, subschemaConfig) {
        return this.transformer.transformSchema(originalWrappingSchema, subschemaConfig);
    }
}
exports.default = RemoveObjectFieldsWithDeprecation;
