"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const utils_1 = require("@graphql-tools/utils");
class MapLeafValues {
    constructor(inputValueTransformer, outputValueTransformer) {
        this.inputValueTransformer = inputValueTransformer;
        this.outputValueTransformer = outputValueTransformer;
        this.resultVisitorMap = Object.create(null);
    }
    transformSchema(originalWrappingSchema, _subschemaConfig) {
        this.originalWrappingSchema = originalWrappingSchema;
        const typeMap = originalWrappingSchema.getTypeMap();
        for (const typeName in typeMap) {
            const type = typeMap[typeName];
            if (!typeName.startsWith('__')) {
                if ((0, graphql_1.isLeafType)(type)) {
                    this.resultVisitorMap[typeName] = (value) => this.outputValueTransformer(typeName, value);
                }
            }
        }
        this.typeInfo = new graphql_1.TypeInfo(originalWrappingSchema);
        return originalWrappingSchema;
    }
    transformRequest(originalRequest, delegationContext, transformationContext) {
        var _a;
        const document = originalRequest.document;
        const variableValues = (_a = originalRequest.variables) !== null && _a !== void 0 ? _a : {};
        const operations = document.definitions.filter(def => def.kind === graphql_1.Kind.OPERATION_DEFINITION);
        const fragments = document.definitions.filter(def => def.kind === graphql_1.Kind.FRAGMENT_DEFINITION);
        const newOperations = this.transformOperations(operations, variableValues, delegationContext.args);
        const transformedRequest = {
            ...originalRequest,
            document: {
                ...document,
                definitions: [...newOperations, ...fragments],
            },
            variables: variableValues,
        };
        transformationContext.transformedRequest = transformedRequest;
        return transformedRequest;
    }
    transformResult(originalResult, _delegationContext, transformationContext) {
        if (!this.originalWrappingSchema) {
            throw new Error(`The MapLeafValues transform's  "transformRequest" and "transformResult" methods cannot be used without first calling "transformSchema".`);
        }
        return (0, utils_1.visitResult)(originalResult, transformationContext.transformedRequest, this.originalWrappingSchema, this.resultVisitorMap);
    }
    transformOperations(operations, variableValues, args) {
        if (this.typeInfo == null) {
            throw new Error(`The MapLeafValues transform's "transformRequest" and "transformResult" methods cannot be used without first calling "transformSchema".`);
        }
        return operations.map((operation) => {
            return (0, graphql_1.visit)(operation, (0, graphql_1.visitWithTypeInfo)(this.typeInfo, {
                [graphql_1.Kind.FIELD]: node => this.transformFieldNode(node, variableValues, args),
            }));
        });
    }
    transformFieldNode(field, variableValues, args) {
        if (this.typeInfo == null) {
            throw new Error(`The MapLeafValues transform's "transformRequest" and "transformResult" methods cannot be used without first calling "transformSchema".`);
        }
        const targetField = this.typeInfo.getFieldDef();
        if (!targetField) {
            return;
        }
        if (!targetField.name.startsWith('__')) {
            const argumentNodes = field.arguments;
            if (argumentNodes != null) {
                const argumentNodeMap = argumentNodes.reduce((prev, argument) => ({
                    ...prev,
                    [argument.name.value]: argument,
                }), Object.create(null));
                for (const argument of targetField.args) {
                    const argName = argument.name;
                    const argType = argument.type;
                    if ((args === null || args === void 0 ? void 0 : args[argName]) != null) {
                        args[argName] = (0, utils_1.transformInputValue)(argType, args[argName], (t, v) => {
                            const newValue = this.inputValueTransformer(t.name, v);
                            return newValue === undefined ? v : newValue;
                        });
                    }
                    const argumentNode = argumentNodeMap[argName];
                    let value;
                    const argValue = argumentNode === null || argumentNode === void 0 ? void 0 : argumentNode.value;
                    if (argValue != null) {
                        value = (0, graphql_1.valueFromAST)(argValue, argType, variableValues);
                        if (value == null) {
                            value = (0, graphql_1.valueFromASTUntyped)(argValue, variableValues);
                        }
                    }
                    const transformedValue = (0, utils_1.transformInputValue)(argType, value, (t, v) => {
                        const newValue = this.inputValueTransformer(t.name, v);
                        return newValue === undefined ? v : newValue;
                    });
                    if ((argValue === null || argValue === void 0 ? void 0 : argValue.kind) === graphql_1.Kind.VARIABLE) {
                        variableValues[argValue.name.value] = transformedValue;
                    }
                    else {
                        const newValueNode = (0, graphql_1.astFromValue)(transformedValue, argType);
                        if (newValueNode != null) {
                            argumentNodeMap[argName] = {
                                ...argumentNode,
                                value: newValueNode,
                            };
                        }
                    }
                }
                return {
                    ...field,
                    arguments: Object.values(argumentNodeMap),
                };
            }
        }
    }
}
exports.default = MapLeafValues;
