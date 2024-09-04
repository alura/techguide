import { responsePathAsArray, GraphQLError, locatedError, } from 'graphql';
import { collectFields, memoize1, relocatedError } from '@graphql-tools/utils';
import { FIELD_SUBSCHEMA_MAP_SYMBOL, OBJECT_SUBSCHEMA_SYMBOL, UNPATHED_ERRORS_SYMBOL } from './symbols.js';
import { ValueOrPromise } from 'value-or-promise';
export function isExternalObject(data) {
    return data[UNPATHED_ERRORS_SYMBOL] !== undefined;
}
export function annotateExternalObject(object, errors, subschema, subschemaMap) {
    Object.defineProperties(object, {
        [OBJECT_SUBSCHEMA_SYMBOL]: { value: subschema },
        [FIELD_SUBSCHEMA_MAP_SYMBOL]: { value: subschemaMap },
        [UNPATHED_ERRORS_SYMBOL]: { value: errors },
    });
    return object;
}
export function getSubschema(object, responseKey) {
    var _a;
    return (_a = object[FIELD_SUBSCHEMA_MAP_SYMBOL][responseKey]) !== null && _a !== void 0 ? _a : object[OBJECT_SUBSCHEMA_SYMBOL];
}
export function getUnpathedErrors(object) {
    return object[UNPATHED_ERRORS_SYMBOL];
}
const EMPTY_ARRAY = [];
const EMPTY_OBJECT = Object.create(null);
function asyncForEach(array, fn) {
    return array.reduce((prev, curr) => prev.then(() => fn(curr)), new ValueOrPromise(() => { }));
}
export const getActualFieldNodes = memoize1(function (fieldNode) {
    return [fieldNode];
});
export function mergeFields(mergedTypeInfo, object, sourceSubschema, context, info) {
    var _a;
    const delegationMaps = mergedTypeInfo.delegationPlanBuilder(info.schema, sourceSubschema, info.variableValues != null && Object.keys(info.variableValues).length > 0 ? info.variableValues : EMPTY_OBJECT, info.fragments != null && Object.keys(info.fragments).length > 0 ? info.fragments : EMPTY_OBJECT, ((_a = info.fieldNodes) === null || _a === void 0 ? void 0 : _a.length)
        ? info.fieldNodes.length === 1
            ? getActualFieldNodes(info.fieldNodes[0])
            : info.fieldNodes
        : EMPTY_ARRAY);
    return asyncForEach(delegationMaps, delegationMap => executeDelegationStage(mergedTypeInfo, delegationMap, object, context, info)).then(() => object);
}
function executeDelegationStage(mergedTypeInfo, delegationMap, object, context, info) {
    const combinedErrors = object[UNPATHED_ERRORS_SYMBOL];
    const path = responsePathAsArray(info.path);
    const combinedFieldSubschemaMap = object[FIELD_SUBSCHEMA_MAP_SYMBOL];
    function finallyFn(source, subschema, selectionSet) {
        var _a;
        if (source instanceof Error || source == null) {
            const schema = subschema.transformedSchema || info.schema;
            const type = schema.getType(object.__typename);
            const { fields } = collectFields(schema, EMPTY_OBJECT, EMPTY_OBJECT, type, selectionSet);
            const nullResult = {};
            for (const [responseKey, fieldNodes] of fields) {
                const combinedPath = [...path, responseKey];
                if (source instanceof GraphQLError) {
                    nullResult[responseKey] = relocatedError(source, combinedPath);
                }
                else if (source instanceof Error) {
                    nullResult[responseKey] = locatedError(source, fieldNodes, combinedPath);
                }
                else {
                    nullResult[responseKey] = null;
                }
            }
            source = nullResult;
        }
        else {
            if (source[UNPATHED_ERRORS_SYMBOL]) {
                combinedErrors.push(...source[UNPATHED_ERRORS_SYMBOL]);
            }
        }
        const objectSubschema = source[OBJECT_SUBSCHEMA_SYMBOL];
        const fieldSubschemaMap = source[FIELD_SUBSCHEMA_MAP_SYMBOL];
        for (const responseKey in source) {
            const existingPropValue = object[responseKey];
            const sourcePropValue = source[responseKey];
            if (sourcePropValue != null || existingPropValue == null) {
                object[responseKey] = sourcePropValue;
            }
            combinedFieldSubschemaMap[responseKey] = (_a = fieldSubschemaMap === null || fieldSubschemaMap === void 0 ? void 0 : fieldSubschemaMap[responseKey]) !== null && _a !== void 0 ? _a : objectSubschema;
        }
    }
    return ValueOrPromise.all([...delegationMap.entries()].map(([subschema, selectionSet]) => new ValueOrPromise(() => {
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
