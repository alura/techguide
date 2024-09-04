"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeFields = void 0;
const utils_js_1 = require("./utils.js");
const directives_js_1 = require("./directives.js");
const utils_1 = require("@graphql-tools/utils");
const arguments_js_1 = require("./arguments.js");
function fieldAlreadyExists(fieldsArr, otherField, config) {
    const result = fieldsArr.find(field => field.name.value === otherField.name.value);
    if (result && !(config === null || config === void 0 ? void 0 : config.ignoreFieldConflicts)) {
        const t1 = (0, utils_js_1.extractType)(result.type);
        const t2 = (0, utils_js_1.extractType)(otherField.type);
        if (t1.name.value !== t2.name.value) {
            throw new Error(`Field "${otherField.name.value}" already defined with a different type. Declared as "${t1.name.value}", but you tried to override with "${t2.name.value}"`);
        }
    }
    return !!result;
}
function mergeFields(type, f1, f2, config) {
    const result = [];
    if (f2 != null) {
        result.push(...f2);
    }
    if (f1 != null) {
        for (const field of f1) {
            if (fieldAlreadyExists(result, field, config)) {
                const existing = result.find((f) => f.name.value === field.name.value);
                if (!(config === null || config === void 0 ? void 0 : config.ignoreFieldConflicts)) {
                    if (config === null || config === void 0 ? void 0 : config.throwOnConflict) {
                        preventConflicts(type, existing, field, false);
                    }
                    else {
                        preventConflicts(type, existing, field, true);
                    }
                    if ((0, utils_js_1.isNonNullTypeNode)(field.type) && !(0, utils_js_1.isNonNullTypeNode)(existing.type)) {
                        existing.type = field.type;
                    }
                }
                existing.arguments = (0, arguments_js_1.mergeArguments)(field['arguments'] || [], existing.arguments || [], config);
                existing.directives = (0, directives_js_1.mergeDirectives)(field.directives, existing.directives, config);
                existing.description = field.description || existing.description;
            }
            else {
                result.push(field);
            }
        }
    }
    if (config && config.sort) {
        result.sort(utils_1.compareNodes);
    }
    if (config && config.exclusions) {
        const exclusions = config.exclusions;
        return result.filter(field => !exclusions.includes(`${type.name.value}.${field.name.value}`));
    }
    return result;
}
exports.mergeFields = mergeFields;
function preventConflicts(type, a, b, ignoreNullability = false) {
    const aType = (0, utils_js_1.printTypeNode)(a.type);
    const bType = (0, utils_js_1.printTypeNode)(b.type);
    if (aType !== bType && !safeChangeForFieldType(a.type, b.type, ignoreNullability)) {
        throw new Error(`Field '${type.name.value}.${a.name.value}' changed type from '${aType}' to '${bType}'`);
    }
}
function safeChangeForFieldType(oldType, newType, ignoreNullability = false) {
    // both are named
    if (!(0, utils_js_1.isWrappingTypeNode)(oldType) && !(0, utils_js_1.isWrappingTypeNode)(newType)) {
        return oldType.toString() === newType.toString();
    }
    // new is non-null
    if ((0, utils_js_1.isNonNullTypeNode)(newType)) {
        const ofType = (0, utils_js_1.isNonNullTypeNode)(oldType) ? oldType.type : oldType;
        return safeChangeForFieldType(ofType, newType.type);
    }
    // old is non-null
    if ((0, utils_js_1.isNonNullTypeNode)(oldType)) {
        return safeChangeForFieldType(newType, oldType, ignoreNullability);
    }
    // old is list
    if ((0, utils_js_1.isListTypeNode)(oldType)) {
        return (((0, utils_js_1.isListTypeNode)(newType) && safeChangeForFieldType(oldType.type, newType.type)) ||
            ((0, utils_js_1.isNonNullTypeNode)(newType) && safeChangeForFieldType(oldType, newType['type'])));
    }
    return false;
}
