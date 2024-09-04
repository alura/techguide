"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRequest = exports.getDelegatingOperation = void 0;
const graphql_1 = require("graphql");
const utils_1 = require("@graphql-tools/utils");
function getDelegatingOperation(parentType, schema) {
    if (parentType === schema.getMutationType()) {
        return 'mutation';
    }
    else if (parentType === schema.getSubscriptionType()) {
        return 'subscription';
    }
    return 'query';
}
exports.getDelegatingOperation = getDelegatingOperation;
function createRequest({ sourceSchema, sourceParentType, sourceFieldName, fragments, variableDefinitions, variableValues, targetRootValue, targetOperationName, targetOperation, targetFieldName, selectionSet, fieldNodes, context, info, }) {
    var _a, _b;
    let newSelectionSet;
    const argumentNodeMap = Object.create(null);
    if (selectionSet != null) {
        newSelectionSet = selectionSet;
    }
    else {
        const selections = [];
        for (const fieldNode of fieldNodes || []) {
            if (fieldNode.selectionSet) {
                for (const selection of fieldNode.selectionSet.selections) {
                    selections.push(selection);
                }
            }
        }
        newSelectionSet = selections.length
            ? {
                kind: graphql_1.Kind.SELECTION_SET,
                selections,
            }
            : undefined;
        const args = (_a = fieldNodes === null || fieldNodes === void 0 ? void 0 : fieldNodes[0]) === null || _a === void 0 ? void 0 : _a.arguments;
        if (args) {
            for (const argNode of args) {
                argumentNodeMap[argNode.name.value] = argNode;
            }
        }
    }
    const newVariables = Object.create(null);
    const variableDefinitionMap = Object.create(null);
    if (sourceSchema != null && variableDefinitions != null) {
        for (const def of variableDefinitions) {
            const varName = def.variable.name.value;
            variableDefinitionMap[varName] = def;
            const varType = (0, graphql_1.typeFromAST)(sourceSchema, def.type);
            const serializedValue = (0, utils_1.serializeInputValue)(varType, variableValues === null || variableValues === void 0 ? void 0 : variableValues[varName]);
            if (serializedValue !== undefined) {
                newVariables[varName] = serializedValue;
            }
        }
    }
    if (sourceParentType != null && sourceFieldName != null) {
        updateArgumentsWithDefaults(sourceParentType, sourceFieldName, argumentNodeMap, variableDefinitionMap, newVariables);
    }
    const rootFieldName = targetFieldName !== null && targetFieldName !== void 0 ? targetFieldName : (_b = fieldNodes === null || fieldNodes === void 0 ? void 0 : fieldNodes[0]) === null || _b === void 0 ? void 0 : _b.name.value;
    if (rootFieldName === undefined) {
        throw new Error(`Either "targetFieldName" or a non empty "fieldNodes" array must be provided.`);
    }
    const rootfieldNode = {
        kind: graphql_1.Kind.FIELD,
        arguments: Object.values(argumentNodeMap),
        name: {
            kind: graphql_1.Kind.NAME,
            value: rootFieldName,
        },
        selectionSet: newSelectionSet,
    };
    const operationName = targetOperationName
        ? {
            kind: graphql_1.Kind.NAME,
            value: targetOperationName,
        }
        : undefined;
    const operationDefinition = {
        kind: graphql_1.Kind.OPERATION_DEFINITION,
        name: operationName,
        operation: targetOperation,
        variableDefinitions: Object.values(variableDefinitionMap),
        selectionSet: {
            kind: graphql_1.Kind.SELECTION_SET,
            selections: [rootfieldNode],
        },
    };
    const definitions = [operationDefinition];
    if (fragments != null) {
        for (const fragmentName in fragments) {
            const fragment = fragments[fragmentName];
            definitions.push(fragment);
        }
    }
    const document = {
        kind: graphql_1.Kind.DOCUMENT,
        definitions,
    };
    return {
        document,
        variables: newVariables,
        rootValue: targetRootValue,
        operationName: targetOperationName,
        context,
        info,
        operationType: targetOperation,
    };
}
exports.createRequest = createRequest;
function updateArgumentsWithDefaults(sourceParentType, sourceFieldName, argumentNodeMap, variableDefinitionMap, variableValues) {
    const generateVariableName = (0, utils_1.createVariableNameGenerator)(variableDefinitionMap);
    const sourceField = sourceParentType.getFields()[sourceFieldName];
    if (!sourceField) {
        throw new Error(`Field "${sourceFieldName}" was not found in type "${sourceParentType}".`);
    }
    for (const argument of sourceField.args) {
        const argName = argument.name;
        const sourceArgType = argument.type;
        if (argumentNodeMap[argName] === undefined) {
            const defaultValue = argument.defaultValue;
            if (defaultValue !== undefined) {
                (0, utils_1.updateArgument)(argumentNodeMap, variableDefinitionMap, variableValues, argName, generateVariableName(argName), sourceArgType, (0, utils_1.serializeInputValue)(sourceArgType, defaultValue));
            }
        }
    }
}
