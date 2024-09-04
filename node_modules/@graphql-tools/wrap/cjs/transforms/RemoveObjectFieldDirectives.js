"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const utils_1 = require("@graphql-tools/utils");
const FilterObjectFieldDirectives_js_1 = tslib_1.__importDefault(require("./FilterObjectFieldDirectives.js"));
class RemoveObjectFieldDirectives {
    constructor(directiveName, args = {}) {
        this.transformer = new FilterObjectFieldDirectives_js_1.default((dirName, dirValue) => {
            return !((0, utils_1.valueMatchesCriteria)(dirName, directiveName) && (0, utils_1.valueMatchesCriteria)(dirValue, args));
        });
    }
    transformSchema(originalWrappingSchema, subschemaConfig) {
        return this.transformer.transformSchema(originalWrappingSchema, subschemaConfig);
    }
}
exports.default = RemoveObjectFieldDirectives;
