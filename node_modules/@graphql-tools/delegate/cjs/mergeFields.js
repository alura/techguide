"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeFields = exports.getActualFieldNodes = exports.getUnpathedErrors = exports.getSubschema = exports.annotateExternalObject = exports.isExternalObject = void 0;
const graphql_1 = require("graphql");
const utils_1 = require("@graphql-tools/utils");
const symbols_js_1 = require("./symbols.js");
const value_or_promise_1 = require("value-or-promise");
function isExternalObject(data) {
    return data[symbols_js_1.UNPATHED_ERRORS_SYMBOL] !== undefined;
}
exports.isExternalObject = isExternalObject;
function annotateExternalObject(object, errors, subschema, subschemaMap) {
    Object.defineProperties(object, {
        [symbols_js_1.OBJECT_SUBSCHEMA_SYMBOL]: { value: subschema },
        [symbols_js_1.FIELD_SUBSCHEMA_MAP_SYMBOL]: { value: subschemaMap },
        [symbols_js_1.UNPATHED_ERRORS_SYMBOL]: { value: errors },
    });
    return object;
}
exports.annotateExternalObject = annotateExternalObject;
function getSubschema(object, responseKey) {
    var _a;
    return (_a = object[symbols_js_1.FIELD_SUBSCHEMA_MAP_SYMBOL][responseKey]) !== null && _a !== void 0 ? _a : object[symbols_js_1.OBJECT_SUBSCHEMA_SYMBOL];
}
exports.getSubschema = getSubschema;
function getUnpathedErrors(object) {
    return object[symbols_js_1.UNPATHED_ERRORS_SYMBOL];
}
exports.getUnpathedErrors = getUnpathedErrors;
const EMPTY_ARRAY = [];
const EMPTY_OBJECT = Object.create(null);
function asyncForEach(array, fn) {
    return array.reduce((prev, curr) => prev.then(() => fn(curr)), new value_or_promise_1.ValueOrPromise(() => { }));
}
exports.getActualFieldNodes = (0, utils_1.memoize1)(function (fieldNode) {
    return [fieldNode];
});
function mergeFields(mergedTypeInfo, object, sourceSubschema, context, info) {
    var _a;
    const delegationMaps = mergedTypeInfo.delegationPlanBuilder(info.schema, sourceSubschema, info.variableValues != null && Object.keys(info.variableValues).length > 0 ? info.variableValues : EMPTY_OBJECT, info.fragments != null && Object.keys(info.fragments).length > 0 ? info.fragments : EMPTY_OBJECT, ((_a = info.fieldNodes) === null || _a === void 0 ? void 0 : _a.length)
        ? info.fieldNodes.length === 1
            ? (0, exports.getActualFieldNodes)(info.fieldNodes[0])
            : info.fieldNodes
        : EMPTY_ARRAY);
    return asyncForEach(delegationMaps, delegationMap => executeDelegationStage(mergedTypeInfo, delegationMap, object, context, info)).then(() => object);
}
exports.mergeFields = mergeFields;
function executeDelegationStage(mergedTypeInfo, delegationMap, object, context, info) {
    const combinedErrors = object[symbols_js_1.UNPATHED_ERRORS_SYMBOL];
    const path = (0, graphql_1.responsePathAsArray)(info.path);
    const combinedFieldSubschemaMap = object[symbols_js_1.FIELD_SUBSCHEMA_MAP_SYMBOL];
    function finallyFn(source, subschema, selectionSet) {
        var _a;
        if (source instanceof Error || source == null) {
            const schema = subschema.transformedSchema || info.schema;
            const type = schema.getType(object.__typename);
            const { fields } = (0, utils_1.collectFields)(schema, EMPTY_OBJECT, EMPTY_OBJECT, type, selectionSet);
            const nullResult = {};
            for (const [responseKey, fieldNodes] of fields) {
                const combinedPath = [...path, responseKey];
                if (source instanceof graphql_1.GraphQLError) {
                    nullResult[responseKey] = (0, utils_1.relocatedError)(source, combinedPath);
                }
                else if (source instanceof Error) {
                    nullResult[responseKey] = (0, graphql_1.locatedError)(source, fieldNodes, combinedPath);
                }
                else {
                    nullResult[responseKey] = null;
                }
            }
            source = nullResult;
        }
        else {
            if (source[symbols_js_1.UNPATHED_ERRORS_SYMBOL]) {
                combinedErrors.push(...source[symbols_js_1.UNPATHED_ERRORS_SYMBOL]);
            }
        }
        const objectSubschema = source[symbols_js_1.OBJECT_SUBSCHEMA_SYMBOL];
        const fieldSubschemaMap = source[symbols_js_1.FIELD_SUBSCHEMA_MAP_SYMBOL];
        for (const responseKey in source) {
            const existingPropValue = object[responseKey];
            const sourcePropValue = source[responseKey];
            if (sourcePropValue != null || existingPropValue == null) {
                object[responseKey] = sourcePropValue;
            }
            combinedFieldSubschemaMap[responseKey] = (_a = fieldSubschemaMap === null || fieldSubschemaMap === void 0 ? void 0 : fieldSubschemaMap[responseKey]) !== null && _a !== void 0 ? _a : objectSubschema;
        }
    }
    return value_or_promise_1.ValueOrPromise.all([...delegationMap.entries()].map(([subschema, selectionSet]) => new value_or_promise_1.ValueOrPromise(() => {
        const schema = subschema.transformedSchema || info.schema;
        const type = schema.getType(object.__typename);
        const resolver = mergedTypeInfo.resolvers.get(subschema);
        if (resolver) {
            return resolver(object, context, info, subschema, selectionSet, undefined, type);
        }
    })
        .then(source => finallyFn(source, subschema, selectionSet))
        .catch(error => finallyFn(error, subschema, selectionSet)))).then(() => { });
}
