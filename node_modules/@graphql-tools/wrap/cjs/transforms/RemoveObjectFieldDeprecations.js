"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const utils_1 = require("@graphql-tools/utils");
const FilterObjectFieldDirectives_js_1 = tslib_1.__importDefault(require("./FilterObjectFieldDirectives.js"));
const TransformObjectFields_js_1 = tslib_1.__importDefault(require("./TransformObjectFields.js"));
class RemoveObjectFieldDeprecations {
    constructor(reason) {
        const args = { reason };
        this.removeDirectives = new FilterObjectFieldDirectives_js_1.default((dirName, dirValue) => {
            return !(dirName === 'deprecated' && (0, utils_1.valueMatchesCriteria)(dirValue, args));
        });
        this.removeDeprecations = new TransformObjectFields_js_1.default((_typeName, _fieldName, fieldConfig) => {
            if (fieldConfig.deprecationReason && (0, utils_1.valueMatchesCriteria)(fieldConfig.deprecationReason, reason)) {
                fieldConfig = { ...fieldConfig };
                delete fieldConfig.deprecationReason;
            }
            return fieldConfig;
        });
    }
    transformSchema(originalWrappingSchema, subschemaConfig) {
        return this.removeDeprecations.transformSchema(this.removeDirectives.transformSchema(originalWrappingSchema, subschemaConfig), subschemaConfig);
    }
}
exports.default = RemoveObjectFieldDeprecations;
