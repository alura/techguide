"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const utils_1 = require("@graphql-tools/utils");
const FilterObjectFields_js_1 = tslib_1.__importDefault(require("./FilterObjectFields.js"));
class RemoveObjectFieldsWithDirective {
    constructor(directiveName, args = {}) {
        this.directiveName = directiveName;
        this.args = args;
    }
    transformSchema(originalWrappingSchema, subschemaConfig) {
        const transformer = new FilterObjectFields_js_1.default((_typeName, _fieldName, fieldConfig) => {
            const directives = (0, utils_1.getDirectives)(originalWrappingSchema, fieldConfig);
            return !directives.some(directive => (0, utils_1.valueMatchesCriteria)(directive.name, this.directiveName) && (0, utils_1.valueMatchesCriteria)(directive.args, this.args));
        });
        return transformer.transformSchema(originalWrappingSchema, subschemaConfig);
    }
}
exports.default = RemoveObjectFieldsWithDirective;
