"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveExternalValue = void 0;
const graphql_1 = require("graphql");
const utils_1 = require("@graphql-tools/utils");
const mergeFields_js_1 = require("./mergeFields.js");
function resolveExternalValue(result, unpathedErrors, subschema, context, info, returnType = getReturnType(info), skipTypeMerging) {
    const type = (0, graphql_1.getNullableType)(returnType);
    if (result instanceof Error) {
        return result;
    }
    if (result == null) {
        return reportUnpathedErrorsViaNull(unpathedErrors);
    }
    if ('parseValue' in type) {
        return type.parseValue(result);
    }
    else if ((0, graphql_1.isCompositeType)(type)) {
        return resolveExternalObject(type, result, unpathedErrors, subschema, context, info, skipTypeMerging);
    }
    else if ((0, graphql_1.isListType)(type)) {
        if (Array.isArray(result)) {
            return resolveExternalList(type, result, unpathedErrors, subschema, context, info, skipTypeMerging);
        }
        return resolveExternalValue(result, unpathedErrors, subschema, context, info, type.ofType, skipTypeMerging);
    }
}
exports.resolveExternalValue = resolveExternalValue;
function resolveExternalObject(type, object, unpathedErrors, subschema, context, info, skipTypeMerging) {
    var _a;
    // if we have already resolved this object, for example, when the identical object appears twice
    // in a list, see https://github.com/ardatan/graphql-tools/issues/2304
    if (!(0, mergeFields_js_1.isExternalObject)(object)) {
        (0, mergeFields_js_1.annotateExternalObject)(object, unpathedErrors, subschema, Object.create(null));
    }
    if (skipTypeMerging || info == null) {
        return object;
    }
    const stitchingInfo = (_a = info.schema.extensions) === null || _a === void 0 ? void 0 : _a['stitchingInfo'];
    if (stitchingInfo == null) {
        return object;
    }
    const typeName = (0, graphql_1.isAbstractType)(type) ? object.__typename : type.name;
    const mergedTypeInfo = stitchingInfo.mergedTypes[typeName];
    let targetSubschemas;
    // Within the stitching context, delegation to a stitched GraphQLSchema or SubschemaConfig
    // will be redirected to the appropriate Subschema object, from which merge targets can be queried.
    if (mergedTypeInfo != null) {
        targetSubschemas = mergedTypeInfo.targetSubschemas.get(subschema);
    }
    // If there are no merge targets from the subschema, return.
    if (!targetSubschemas || !targetSubschemas.length) {
        return object;
    }
    return (0, mergeFields_js_1.mergeFields)(mergedTypeInfo, object, subschema, context, info).resolve();
}
function resolveExternalList(type, list, unpathedErrors, subschema, context, info, skipTypeMerging) {
    return list.map(listMember => resolveExternalValue(listMember, unpathedErrors, subschema, context, info, type.ofType, skipTypeMerging));
}
const reportedErrors = new WeakMap();
function reportUnpathedErrorsViaNull(unpathedErrors) {
    if (unpathedErrors.length) {
        const unreportedErrors = [];
        for (const error of unpathedErrors) {
            if (!reportedErrors.has(error)) {
                unreportedErrors.push(error);
                reportedErrors.set(error, true);
            }
        }
        if (unreportedErrors.length) {
            if (unreportedErrors.length === 1) {
                return unreportedErrors[0];
            }
            const combinedError = new utils_1.AggregateError(unreportedErrors, unreportedErrors.map(error => error.message).join(', \n'));
            // We cast path as any for GraphQL.js 14 compat
            // locatedError path argument must be defined, but it is just forwarded to a constructor that allows a undefined value
            // https://github.com/graphql/graphql-js/blob/b4bff0ba9c15c9d7245dd68556e754c41f263289/src/error/locatedError.js#L25
            // https://github.com/graphql/graphql-js/blob/b4bff0ba9c15c9d7245dd68556e754c41f263289/src/error/GraphQLError.js#L19
            return (0, graphql_1.locatedError)(combinedError, undefined, unreportedErrors[0].path);
        }
    }
    return null;
}
function getReturnType(info) {
    if (info == null) {
        throw new Error(`Return type cannot be inferred without a source schema.`);
    }
    return info.returnType;
}
