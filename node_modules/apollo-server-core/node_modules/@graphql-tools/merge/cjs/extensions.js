"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractExtensionsFromSchema = exports.applyExtensions = exports.mergeExtensions = exports.travelSchemaPossibleExtensions = void 0;
const graphql_1 = require("graphql");
const utils_1 = require("@graphql-tools/utils");
function travelSchemaPossibleExtensions(schema, hooks) {
    hooks.onSchema(schema);
    const typesMap = schema.getTypeMap();
    for (const [, type] of Object.entries(typesMap)) {
        const isPredefinedScalar = (0, graphql_1.isScalarType)(type) && (0, graphql_1.isSpecifiedScalarType)(type);
        const isIntrospection = (0, graphql_1.isIntrospectionType)(type);
        if (isPredefinedScalar || isIntrospection) {
            continue;
        }
        if ((0, graphql_1.isObjectType)(type)) {
            hooks.onObjectType(type);
            const fields = type.getFields();
            for (const [, field] of Object.entries(fields)) {
                hooks.onObjectField(type, field);
                const args = field.args || [];
                for (const arg of args) {
                    hooks.onObjectFieldArg(type, field, arg);
                }
            }
        }
        else if ((0, graphql_1.isInterfaceType)(type)) {
            hooks.onInterface(type);
            const fields = type.getFields();
            for (const [, field] of Object.entries(fields)) {
                hooks.onInterfaceField(type, field);
                const args = field.args || [];
                for (const arg of args) {
                    hooks.onInterfaceFieldArg(type, field, arg);
                }
            }
        }
        else if ((0, graphql_1.isInputObjectType)(type)) {
            hooks.onInputType(type);
            const fields = type.getFields();
            for (const [, field] of Object.entries(fields)) {
                hooks.onInputFieldType(type, field);
            }
        }
        else if ((0, graphql_1.isUnionType)(type)) {
            hooks.onUnion(type);
        }
        else if ((0, graphql_1.isScalarType)(type)) {
            hooks.onScalar(type);
        }
        else if ((0, graphql_1.isEnumType)(type)) {
            hooks.onEnum(type);
            for (const value of type.getValues()) {
                hooks.onEnumValue(type, value);
            }
        }
    }
}
exports.travelSchemaPossibleExtensions = travelSchemaPossibleExtensions;
function mergeExtensions(extensions) {
    return (0, utils_1.mergeDeep)(extensions);
}
exports.mergeExtensions = mergeExtensions;
function applyExtensionObject(obj, extensions) {
    if (!obj) {
        return;
    }
    obj.extensions = (0, utils_1.mergeDeep)([obj.extensions || {}, extensions || {}]);
}
function applyExtensions(schema, extensions) {
    applyExtensionObject(schema, extensions.schemaExtensions);
    for (const [typeName, data] of Object.entries(extensions.types || {})) {
        const type = schema.getType(typeName);
        if (type) {
            applyExtensionObject(type, data.extensions);
            if (data.type === 'object' || data.type === 'interface') {
                for (const [fieldName, fieldData] of Object.entries(data.fields)) {
                    const field = type.getFields()[fieldName];
                    if (field) {
                        applyExtensionObject(field, fieldData.extensions);
                        for (const [arg, argData] of Object.entries(fieldData.arguments)) {
                            applyExtensionObject(field.args.find(a => a.name === arg), argData);
                        }
                    }
                }
            }
            else if (data.type === 'input') {
                for (const [fieldName, fieldData] of Object.entries(data.fields)) {
                    const field = type.getFields()[fieldName];
                    applyExtensionObject(field, fieldData.extensions);
                }
            }
            else if (data.type === 'enum') {
                for (const [valueName, valueData] of Object.entries(data.values)) {
                    const value = type.getValue(valueName);
                    applyExtensionObject(value, valueData);
                }
            }
        }
    }
    return schema;
}
exports.applyExtensions = applyExtensions;
function extractExtensionsFromSchema(schema) {
    const result = {
        schemaExtensions: {},
        types: {},
    };
    travelSchemaPossibleExtensions(schema, {
        onSchema: schema => (result.schemaExtensions = schema.extensions || {}),
        onObjectType: type => (result.types[type.name] = { fields: {}, type: 'object', extensions: type.extensions || {} }),
        onObjectField: (type, field) => (result.types[type.name].fields[field.name] = {
            arguments: {},
            extensions: field.extensions || {},
        }),
        onObjectFieldArg: (type, field, arg) => (result.types[type.name].fields[field.name].arguments[arg.name] = arg.extensions || {}),
        onInterface: type => (result.types[type.name] = { fields: {}, type: 'interface', extensions: type.extensions || {} }),
        onInterfaceField: (type, field) => (result.types[type.name].fields[field.name] = {
            arguments: {},
            extensions: field.extensions || {},
        }),
        onInterfaceFieldArg: (type, field, arg) => (result.types[type.name].fields[field.name].arguments[arg.name] =
            arg.extensions || {}),
        onEnum: type => (result.types[type.name] = { values: {}, type: 'enum', extensions: type.extensions || {} }),
        onEnumValue: (type, value) => (result.types[type.name].values[value.name] = value.extensions || {}),
        onScalar: type => (result.types[type.name] = { type: 'scalar', extensions: type.extensions || {} }),
        onUnion: type => (result.types[type.name] = { type: 'union', extensions: type.extensions || {} }),
        onInputType: type => (result.types[type.name] = { fields: {}, type: 'input', extensions: type.extensions || {} }),
        onInputFieldType: (type, field) => (result.types[type.name].fields[field.name] = { extensions: field.extensions || {} }),
    });
    return result;
}
exports.extractExtensionsFromSchema = extractExtensionsFromSchema;
