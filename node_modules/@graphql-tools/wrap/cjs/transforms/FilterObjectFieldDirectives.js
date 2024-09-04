"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const utils_1 = require("@graphql-tools/utils");
const TransformObjectFields_js_1 = tslib_1.__importDefault(require("./TransformObjectFields.js"));
class FilterObjectFieldDirectives {
    constructor(filter) {
        this.filter = filter;
    }
    transformSchema(originalWrappingSchema, subschemaConfig) {
        const transformer = new TransformObjectFields_js_1.default((_typeName, _fieldName, fieldConfig) => {
            var _a, _b, _c, _d;
            const keepDirectives = (_c = (_b = (_a = fieldConfig.astNode) === null || _a === void 0 ? void 0 : _a.directives) === null || _b === void 0 ? void 0 : _b.filter(dir => {
                const directiveDef = originalWrappingSchema.getDirective(dir.name.value);
                const directiveValue = directiveDef ? (0, utils_1.getArgumentValues)(directiveDef, dir) : undefined;
                return this.filter(dir.name.value, directiveValue);
            })) !== null && _c !== void 0 ? _c : [];
            if (((_d = fieldConfig.astNode) === null || _d === void 0 ? void 0 : _d.directives) != null &&
                keepDirectives.length !== fieldConfig.astNode.directives.length) {
                fieldConfig = {
                    ...fieldConfig,
                    astNode: {
                        ...fieldConfig.astNode,
                        directives: keepDirectives,
                    },
                };
                return fieldConfig;
            }
        });
        return transformer.transformSchema(originalWrappingSchema, subschemaConfig);
    }
}
exports.default = FilterObjectFieldDirectives;
