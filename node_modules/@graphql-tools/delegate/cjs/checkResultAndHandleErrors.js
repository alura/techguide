"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeDataAndErrors = exports.checkResultAndHandleErrors = void 0;
const graphql_1 = require("graphql");
const utils_1 = require("@graphql-tools/utils");
const resolveExternalValue_js_1 = require("./resolveExternalValue.js");
function checkResultAndHandleErrors(result, delegationContext) {
    const { context, info, fieldName: responseKey = getResponseKey(info), subschema, returnType = getReturnType(info), skipTypeMerging, onLocatedError, } = delegationContext;
    const { data, unpathedErrors } = mergeDataAndErrors(result.data == null ? undefined : result.data[responseKey], result.errors == null ? [] : result.errors, info != null && info.path ? (0, graphql_1.responsePathAsArray)(info.path) : undefined, onLocatedError);
    return (0, resolveExternalValue_js_1.resolveExternalValue)(data, unpathedErrors, subschema, context, info, returnType, skipTypeMerging);
}
exports.checkResultAndHandleErrors = checkResultAndHandleErrors;
function mergeDataAndErrors(data, errors, path, onLocatedError, index = 1) {
    var _a;
    if (data == null) {
        if (!errors.length) {
            return { data: null, unpathedErrors: [] };
        }
        if (errors.length === 1) {
            const error = onLocatedError ? onLocatedError(errors[0]) : errors[0];
            const newPath = path === undefined ? error.path : !error.path ? path : path.concat(error.path.slice(1));
            return { data: (0, utils_1.relocatedError)(errors[0], newPath), unpathedErrors: [] };
        }
        // We cast path as any for GraphQL.js 14 compat
        // locatedError path argument must be defined, but it is just forwarded to a constructor that allows a undefined value
        // https://github.com/graphql/graphql-js/blob/b4bff0ba9c15c9d7245dd68556e754c41f263289/src/error/locatedError.js#L25
        // https://github.com/graphql/graphql-js/blob/b4bff0ba9c15c9d7245dd68556e754c41f263289/src/error/GraphQLError.js#L19
        const combinedError = new utils_1.AggregateError(errors, errors.map(error => error.message).join(', \n'));
        const newError = (0, graphql_1.locatedError)(combinedError, undefined, path);
        return { data: newError, unpathedErrors: [] };
    }
    if (!errors.length) {
        return { data, unpathedErrors: [] };
    }
    const unpathedErrors = [];
    const errorMap = new Map();
    for (const error of errors) {
        const pathSegment = (_a = error.path) === null || _a === void 0 ? void 0 : _a[index];
        if (pathSegment != null) {
            let pathSegmentErrors = errorMap.get(pathSegment);
            if (pathSegmentErrors === undefined) {
                pathSegmentErrors = [error];
                errorMap.set(pathSegment, pathSegmentErrors);
            }
            else {
                pathSegmentErrors.push(error);
            }
        }
        else {
            unpathedErrors.push(error);
        }
    }
    for (const [pathSegment, pathSegmentErrors] of errorMap) {
        if (data[pathSegment] !== undefined) {
            const { data: newData, unpathedErrors: newErrors } = mergeDataAndErrors(data[pathSegment], pathSegmentErrors, path, onLocatedError, index + 1);
            data[pathSegment] = newData;
            unpathedErrors.push(...newErrors);
        }
        else {
            unpathedErrors.push(...pathSegmentErrors);
        }
    }
    return { data, unpathedErrors };
}
exports.mergeDataAndErrors = mergeDataAndErrors;
function getResponseKey(info) {
    if (info == null) {
        throw new Error(`Data cannot be extracted from result without an explicit key or source schema.`);
    }
    return (0, utils_1.getResponseKeyFromInfo)(info);
}
function getReturnType(info) {
    if (info == null) {
        throw new Error(`Return type cannot be inferred without a source schema.`);
    }
    return info.returnType;
}
