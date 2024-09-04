"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeTraceDetails = void 0;
const apollo_reporting_protobuf_1 = require("apollo-reporting-protobuf");
function makeTraceDetails(variables, sendVariableValues, operationString) {
    const details = new apollo_reporting_protobuf_1.Trace.Details();
    const variablesToRecord = (() => {
        if (sendVariableValues && 'transform' in sendVariableValues) {
            const originalKeys = Object.keys(variables);
            try {
                const modifiedVariables = sendVariableValues.transform({
                    variables: variables,
                    operationString: operationString,
                });
                return cleanModifiedVariables(originalKeys, modifiedVariables);
            }
            catch (e) {
                return handleVariableValueTransformError(originalKeys);
            }
        }
        else {
            return variables;
        }
    })();
    Object.keys(variablesToRecord).forEach((name) => {
        if (!sendVariableValues ||
            ('none' in sendVariableValues && sendVariableValues.none) ||
            ('all' in sendVariableValues && !sendVariableValues.all) ||
            ('exceptNames' in sendVariableValues &&
                sendVariableValues.exceptNames.includes(name)) ||
            ('onlyNames' in sendVariableValues &&
                !sendVariableValues.onlyNames.includes(name))) {
            details.variablesJson[name] = '';
        }
        else {
            try {
                details.variablesJson[name] =
                    typeof variablesToRecord[name] === 'undefined'
                        ? ''
                        : JSON.stringify(variablesToRecord[name]);
            }
            catch (e) {
                details.variablesJson[name] = JSON.stringify('[Unable to convert value to JSON]');
            }
        }
    });
    return details;
}
exports.makeTraceDetails = makeTraceDetails;
function handleVariableValueTransformError(variableNames) {
    const modifiedVariables = Object.create(null);
    variableNames.forEach((name) => {
        modifiedVariables[name] = '[PREDICATE_FUNCTION_ERROR]';
    });
    return modifiedVariables;
}
function cleanModifiedVariables(originalKeys, modifiedVariables) {
    const cleanedVariables = Object.create(null);
    originalKeys.forEach((name) => {
        cleanedVariables[name] = modifiedVariables[name];
    });
    return cleanedVariables;
}
//# sourceMappingURL=traceDetails.js.map