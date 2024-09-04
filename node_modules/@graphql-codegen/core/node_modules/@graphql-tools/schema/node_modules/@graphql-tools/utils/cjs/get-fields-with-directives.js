"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFieldsWithDirectives = void 0;
const graphql_1 = require("graphql");
function parseDirectiveValue(value) {
    switch (value.kind) {
        case graphql_1.Kind.INT:
            return parseInt(value.value);
        case graphql_1.Kind.FLOAT:
            return parseFloat(value.value);
        case graphql_1.Kind.BOOLEAN:
            return Boolean(value.value);
        case graphql_1.Kind.STRING:
        case graphql_1.Kind.ENUM:
            return value.value;
        case graphql_1.Kind.LIST:
            return value.values.map(v => parseDirectiveValue(v));
        case graphql_1.Kind.OBJECT:
            return value.fields.reduce((prev, v) => ({ ...prev, [v.name.value]: parseDirectiveValue(v.value) }), {});
        case graphql_1.Kind.NULL:
            return null;
        default:
            return null;
    }
}
function getFieldsWithDirectives(documentNode, options = {}) {
    const result = {};
    let selected = ['ObjectTypeDefinition', 'ObjectTypeExtension'];
    if (options.includeInputTypes) {
        selected = [...selected, 'InputObjectTypeDefinition', 'InputObjectTypeExtension'];
    }
    const allTypes = documentNode.definitions.filter(obj => selected.includes(obj.kind));
    for (const type of allTypes) {
        const typeName = type.name.value;
        if (type.fields == null) {
            continue;
        }
        for (const field of type.fields) {
            if (field.directives && field.directives.length > 0) {
                const fieldName = field.name.value;
                const key = `${typeName}.${fieldName}`;
                const directives = field.directives.map(d => ({
                    name: d.name.value,
                    args: (d.arguments || []).reduce((prev, arg) => ({ ...prev, [arg.name.value]: parseDirectiveValue(arg.value) }), {}),
                }));
                result[key] = directives;
            }
        }
    }
    return result;
}
exports.getFieldsWithDirectives = getFieldsWithDirectives;
