"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const utils_1 = require("@graphql-tools/utils");
class TransformInputObjectFields {
    constructor(inputFieldTransformer, inputFieldNodeTransformer, inputObjectNodeTransformer) {
        this.inputFieldTransformer = inputFieldTransformer;
        this.inputFieldNodeTransformer = inputFieldNodeTransformer;
        this.inputObjectNodeTransformer = inputObjectNodeTransformer;
        this.mapping = {};
    }
    _getTransformedSchema() {
        const transformedSchema = this.transformedSchema;
        if (transformedSchema === undefined) {
            throw new Error(`The TransformInputObjectFields transform's  "transformRequest" and "transformResult" methods cannot be used without first calling "transformSchema".`);
        }
        return transformedSchema;
    }
    transformSchema(originalWrappingSchema, _subschemaConfig) {
        this.transformedSchema = (0, utils_1.mapSchema)(originalWrappingSchema, {
            [utils_1.MapperKind.INPUT_OBJECT_FIELD]: (inputFieldConfig, fieldName, typeName) => {
                const transformedInputField = this.inputFieldTransformer(typeName, fieldName, inputFieldConfig);
                if (Array.isArray(transformedInputField)) {
                    const newFieldName = transformedInputField[0];
                    if (newFieldName !== fieldName) {
                        if (!(typeName in this.mapping)) {
                            this.mapping[typeName] = {};
                        }
                        this.mapping[typeName][newFieldName] = fieldName;
                    }
                }
                return transformedInputField;
            },
        });
        return this.transformedSchema;
    }
    transformRequest(originalRequest, delegationContext, _transformationContext) {
        var _a;
        const variableValues = (_a = originalRequest.variables) !== null && _a !== void 0 ? _a : {};
        const fragments = Object.create(null);
        const operations = [];
        for (const def of originalRequest.document.definitions) {
            if (def.kind === graphql_1.Kind.OPERATION_DEFINITION) {
                operations.push(def);
            }
            else if (def.kind === graphql_1.Kind.FRAGMENT_DEFINITION) {
                fragments[def.name.value] = def;
            }
        }
        for (const def of operations) {
            const variableDefs = def.variableDefinitions;
            if (variableDefs != null) {
                for (const variableDef of variableDefs) {
                    const varName = variableDef.variable.name.value;
                    // Cast to NamedTypeNode required until upcomming graphql releases will have TypeNode paramter
                    const varType = (0, graphql_1.typeFromAST)(delegationContext.transformedSchema, variableDef.type);
                    if (!(0, graphql_1.isInputType)(varType)) {
                        continue;
                    }
                    variableValues[varName] = (0, utils_1.transformInputValue)(varType, variableValues[varName], undefined, (type, originalValue) => {
                        var _a;
                        const newValue = Object.create(null);
                        const fields = type.getFields();
                        for (const key in originalValue) {
                            const field = fields[key];
                            if (field != null) {
                                const newFieldName = (_a = this.mapping[type.name]) === null || _a === void 0 ? void 0 : _a[field.name];
                                if (newFieldName != null) {
                                    newValue[newFieldName] = originalValue[field.name];
                                }
                                else {
                                    newValue[field.name] = originalValue[field.name];
                                }
                            }
                        }
                        return newValue;
                    });
                }
            }
        }
        for (const def of originalRequest.document.definitions.filter(def => def.kind === graphql_1.Kind.FRAGMENT_DEFINITION)) {
            fragments[def.name.value] = def;
        }
        const document = this.transformDocument(originalRequest.document, this.mapping, this.inputFieldNodeTransformer, this.inputObjectNodeTransformer, originalRequest, delegationContext);
        if (delegationContext.args != null) {
            const targetRootType = (0, utils_1.getDefinedRootType)(delegationContext.transformedSchema, delegationContext.operation);
            if (targetRootType) {
                const targetField = targetRootType.getFields()[delegationContext.fieldName];
                if (targetField) {
                    const newArgs = Object.create(null);
                    for (const targetArg of targetField.args) {
                        if (targetArg.name in delegationContext.args) {
                            newArgs[targetArg.name] = (0, utils_1.transformInputValue)(targetArg.type, delegationContext.args[targetArg.name], undefined, (type, originalValue) => {
                                var _a;
                                const newValue = Object.create(null);
                                const fields = type.getFields();
                                for (const key in originalValue) {
                                    const field = fields[key];
                                    if (field != null) {
                                        const newFieldName = (_a = this.mapping[type.name]) === null || _a === void 0 ? void 0 : _a[field.name];
                                        if (newFieldName != null) {
                                            newValue[newFieldName] = originalValue[field.name];
                                        }
                                        else {
                                            newValue[field.name] = originalValue[field.name];
                                        }
                                    }
                                }
                                return newValue;
                            });
                        }
                    }
                    delegationContext.args = newArgs;
                }
            }
        }
        return {
            ...originalRequest,
            document,
            variables: variableValues,
        };
    }
    transformDocument(document, mapping, inputFieldNodeTransformer, inputObjectNodeTransformer, request, delegationContext) {
        const typeInfo = new graphql_1.TypeInfo(this._getTransformedSchema());
        const newDocument = (0, graphql_1.visit)(document, (0, graphql_1.visitWithTypeInfo)(typeInfo, {
            [graphql_1.Kind.OBJECT]: {
                leave: (node) => {
                    const parentType = typeInfo.getInputType();
                    if (parentType != null) {
                        const parentTypeName = (0, graphql_1.getNamedType)(parentType).name;
                        const newInputFields = [];
                        for (const inputField of node.fields) {
                            const newName = inputField.name.value;
                            const transformedInputField = inputFieldNodeTransformer != null
                                ? inputFieldNodeTransformer(parentTypeName, newName, inputField, request, delegationContext)
                                : inputField;
                            if (Array.isArray(transformedInputField)) {
                                for (const individualTransformedInputField of transformedInputField) {
                                    const typeMapping = mapping[parentTypeName];
                                    if (typeMapping == null) {
                                        newInputFields.push(individualTransformedInputField);
                                        continue;
                                    }
                                    const oldName = typeMapping[newName];
                                    if (oldName == null) {
                                        newInputFields.push(individualTransformedInputField);
                                        continue;
                                    }
                                    newInputFields.push({
                                        ...individualTransformedInputField,
                                        name: {
                                            ...individualTransformedInputField.name,
                                            value: oldName,
                                        },
                                    });
                                }
                                continue;
                            }
                            const typeMapping = mapping[parentTypeName];
                            if (typeMapping == null) {
                                newInputFields.push(transformedInputField);
                                continue;
                            }
                            const oldName = typeMapping[newName];
                            if (oldName == null) {
                                newInputFields.push(transformedInputField);
                                continue;
                            }
                            newInputFields.push({
                                ...transformedInputField,
                                name: {
                                    ...transformedInputField.name,
                                    value: oldName,
                                },
                            });
                        }
                        const newNode = {
                            ...node,
                            fields: newInputFields,
                        };
                        return inputObjectNodeTransformer != null
                            ? inputObjectNodeTransformer(parentTypeName, newNode, request, delegationContext)
                            : newNode;
                    }
                },
            },
        }));
        return newDocument;
    }
}
exports.default = TransformInputObjectFields;
