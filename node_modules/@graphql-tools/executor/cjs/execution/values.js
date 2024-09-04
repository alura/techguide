"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVariableValues = void 0;
const graphql_1 = require("graphql");
const utils_1 = require("@graphql-tools/utils");
/**
 * Prepares an object map of variableValues of the correct type based on the
 * provided variable definitions and arbitrary input. If the input cannot be
 * parsed to match the variable definitions, a GraphQLError will be thrown.
 *
 * Note: The returned value is a plain Object with a prototype, since it is
 * exposed to user code. Care should be taken to not pull values from the
 * Object prototype.
 */
function getVariableValues(schema, varDefNodes, inputs, options) {
    const errors = [];
    const maxErrors = options === null || options === void 0 ? void 0 : options.maxErrors;
    try {
        const coerced = coerceVariableValues(schema, varDefNodes, inputs, error => {
            if (maxErrors != null && errors.length >= maxErrors) {
                throw (0, utils_1.createGraphQLError)('Too many errors processing variables, error limit reached. Execution aborted.');
            }
            errors.push(error);
        });
        if (errors.length === 0) {
            return { coerced };
        }
    }
    catch (error) {
        errors.push(error);
    }
    // @ts-expect-error - We know that errors is an array of GraphQLError.
    return { errors };
}
exports.getVariableValues = getVariableValues;
function coerceVariableValues(schema, varDefNodes, inputs, onError) {
    const coercedValues = {};
    for (const varDefNode of varDefNodes) {
        const varName = varDefNode.variable.name.value;
        const varType = (0, graphql_1.typeFromAST)(schema, varDefNode.type);
        if (!(0, graphql_1.isInputType)(varType)) {
            // Must use input types for variables. This should be caught during
            // validation, however is checked again here for safety.
            const varTypeStr = (0, graphql_1.print)(varDefNode.type);
            onError((0, utils_1.createGraphQLError)(`Variable "$${varName}" expected value of type "${varTypeStr}" which cannot be used as an input type.`, { nodes: varDefNode.type }));
            continue;
        }
        if (!(0, utils_1.hasOwnProperty)(inputs, varName)) {
            if (varDefNode.defaultValue) {
                coercedValues[varName] = (0, graphql_1.valueFromAST)(varDefNode.defaultValue, varType);
            }
            else if ((0, graphql_1.isNonNullType)(varType)) {
                const varTypeStr = (0, utils_1.inspect)(varType);
                onError((0, utils_1.createGraphQLError)(`Variable "$${varName}" of required type "${varTypeStr}" was not provided.`, {
                    nodes: varDefNode,
                }));
            }
            continue;
        }
        const value = inputs[varName];
        if (value === null && (0, graphql_1.isNonNullType)(varType)) {
            const varTypeStr = (0, utils_1.inspect)(varType);
            onError((0, utils_1.createGraphQLError)(`Variable "$${varName}" of non-null type "${varTypeStr}" must not be null.`, {
                nodes: varDefNode,
            }));
            continue;
        }
        coercedValues[varName] = (0, graphql_1.coerceInputValue)(value, varType, (path, invalidValue, error) => {
            let prefix = `Variable "$${varName}" got invalid value ` + (0, utils_1.inspect)(invalidValue);
            if (path.length > 0) {
                prefix += ` at "${varName}${(0, utils_1.printPathArray)(path)}"`;
            }
            onError((0, utils_1.createGraphQLError)(prefix + '; ' + error.message, {
                nodes: varDefNode,
                originalError: error.originalError,
            }));
        });
    }
    return coercedValues;
}
