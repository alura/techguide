import { Kind, } from 'graphql';
function parseDirectiveValue(value) {
    switch (value.kind) {
        case Kind.INT:
            return parseInt(value.value);
        case Kind.FLOAT:
            return parseFloat(value.value);
        case Kind.BOOLEAN:
            return Boolean(value.value);
        case Kind.STRING:
        case Kind.ENUM:
            return value.value;
        case Kind.LIST:
            return value.values.map(v => parseDirectiveValue(v));
        case Kind.OBJECT:
            return value.fields.reduce((prev, v) => ({ ...prev, [v.name.value]: parseDirectiveValue(v.value) }), {});
        case Kind.NULL:
            return null;
        default:
            return null;
    }
}
export function getFieldsWithDirectives(documentNode, options = {}) {
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
