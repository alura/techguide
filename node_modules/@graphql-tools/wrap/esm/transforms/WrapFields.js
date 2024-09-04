import { Kind, GraphQLNonNull, } from 'graphql';
import { appendObjectFields, selectObjectFields, modifyObjectFields, relocatedError, } from '@graphql-tools/utils';
import { defaultMergedResolver } from '@graphql-tools/delegate';
import MapFields from './MapFields.js';
import { defaultCreateProxyingResolver } from '../generateProxyingResolvers.js';
export default class WrapFields {
    constructor(outerTypeName, wrappingFieldNames, wrappingTypeNames, fieldNames, prefix = 'gqtld') {
        this.outerTypeName = outerTypeName;
        this.wrappingFieldNames = wrappingFieldNames;
        this.wrappingTypeNames = wrappingTypeNames;
        this.numWraps = wrappingFieldNames.length;
        this.fieldNames = fieldNames;
        const remainingWrappingFieldNames = this.wrappingFieldNames.slice();
        const outerMostWrappingFieldName = remainingWrappingFieldNames.shift();
        if (outerMostWrappingFieldName == null) {
            throw new Error(`Cannot wrap fields, no wrapping field name provided.`);
        }
        this.transformer = new MapFields({
            [outerTypeName]: {
                [outerMostWrappingFieldName]: (fieldNode, fragments, transformationContext) => hoistFieldNodes({
                    fieldNode,
                    path: remainingWrappingFieldNames,
                    fieldNames,
                    fragments,
                    transformationContext: transformationContext,
                    prefix,
                }),
            },
        }, {
            [outerTypeName]: (value, context) => dehoistValue(value, context),
        }, (errors, context) => dehoistErrors(errors, context));
    }
    transformSchema(originalWrappingSchema, subschemaConfig) {
        var _a, _b, _c, _d;
        const fieldNames = this.fieldNames;
        const targetFieldConfigMap = selectObjectFields(originalWrappingSchema, this.outerTypeName, !fieldNames ? () => true : fieldName => fieldNames.includes(fieldName));
        const newTargetFieldConfigMap = Object.create(null);
        for (const fieldName in targetFieldConfigMap) {
            const field = targetFieldConfigMap[fieldName];
            const newField = {
                ...field,
                resolve: defaultMergedResolver,
            };
            newTargetFieldConfigMap[fieldName] = newField;
        }
        let wrapIndex = this.numWraps - 1;
        let wrappingTypeName = this.wrappingTypeNames[wrapIndex];
        let wrappingFieldName = this.wrappingFieldNames[wrapIndex];
        let newSchema = appendObjectFields(originalWrappingSchema, wrappingTypeName, newTargetFieldConfigMap);
        for (wrapIndex--; wrapIndex > -1; wrapIndex--) {
            const nextWrappingTypeName = this.wrappingTypeNames[wrapIndex];
            newSchema = appendObjectFields(newSchema, nextWrappingTypeName, {
                [wrappingFieldName]: {
                    type: new GraphQLNonNull(newSchema.getType(wrappingTypeName)),
                    resolve: defaultMergedResolver,
                },
            });
            wrappingTypeName = nextWrappingTypeName;
            wrappingFieldName = this.wrappingFieldNames[wrapIndex];
        }
        const wrappingRootField = this.outerTypeName === ((_a = originalWrappingSchema.getQueryType()) === null || _a === void 0 ? void 0 : _a.name) ||
            this.outerTypeName === ((_b = originalWrappingSchema.getMutationType()) === null || _b === void 0 ? void 0 : _b.name);
        let resolve;
        if (wrappingRootField) {
            const targetSchema = subschemaConfig.schema;
            const operation = this.outerTypeName === ((_c = targetSchema.getQueryType()) === null || _c === void 0 ? void 0 : _c.name) ? 'query' : 'mutation';
            const createProxyingResolver = (_d = subschemaConfig.createProxyingResolver) !== null && _d !== void 0 ? _d : defaultCreateProxyingResolver;
            resolve = createProxyingResolver({
                subschemaConfig,
                operation: operation,
                fieldName: wrappingFieldName,
            });
        }
        else {
            resolve = defaultMergedResolver;
        }
        [newSchema] = modifyObjectFields(newSchema, this.outerTypeName, fieldName => !!newTargetFieldConfigMap[fieldName], {
            [wrappingFieldName]: {
                type: new GraphQLNonNull(newSchema.getType(wrappingTypeName)),
                resolve,
            },
        });
        return this.transformer.transformSchema(newSchema, subschemaConfig);
    }
    transformRequest(originalRequest, delegationContext, transformationContext) {
        transformationContext.nextIndex = 0;
        transformationContext.paths = Object.create(null);
        return this.transformer.transformRequest(originalRequest, delegationContext, transformationContext);
    }
    transformResult(originalResult, delegationContext, transformationContext) {
        return this.transformer.transformResult(originalResult, delegationContext, transformationContext);
    }
}
function collectFields(selectionSet, fragments, fields = [], visitedFragmentNames = {}) {
    if (selectionSet != null) {
        for (const selection of selectionSet.selections) {
            switch (selection.kind) {
                case Kind.FIELD:
                    fields.push(selection);
                    break;
                case Kind.INLINE_FRAGMENT:
                    collectFields(selection.selectionSet, fragments, fields, visitedFragmentNames);
                    break;
                case Kind.FRAGMENT_SPREAD: {
                    const fragmentName = selection.name.value;
                    if (!visitedFragmentNames[fragmentName]) {
                        visitedFragmentNames[fragmentName] = true;
                        collectFields(fragments[fragmentName].selectionSet, fragments, fields, visitedFragmentNames);
                    }
                    break;
                }
                default:
                    // unreachable
                    break;
            }
        }
    }
    return fields;
}
function aliasFieldNode(fieldNode, str) {
    return {
        ...fieldNode,
        alias: {
            kind: Kind.NAME,
            value: str,
        },
    };
}
function hoistFieldNodes({ fieldNode, fieldNames, path, fragments, transformationContext, prefix, index = 0, wrappingPath = [], }) {
    const alias = fieldNode.alias != null ? fieldNode.alias.value : fieldNode.name.value;
    let newFieldNodes = [];
    if (index < path.length) {
        const pathSegment = path[index];
        for (const possibleFieldNode of collectFields(fieldNode.selectionSet, fragments)) {
            if (possibleFieldNode.name.value === pathSegment) {
                const newWrappingPath = wrappingPath.concat([alias]);
                newFieldNodes = newFieldNodes.concat(hoistFieldNodes({
                    fieldNode: possibleFieldNode,
                    fieldNames,
                    path,
                    fragments,
                    transformationContext,
                    prefix,
                    index: index + 1,
                    wrappingPath: newWrappingPath,
                }));
            }
        }
    }
    else {
        for (const possibleFieldNode of collectFields(fieldNode.selectionSet, fragments)) {
            if (!fieldNames || fieldNames.includes(possibleFieldNode.name.value)) {
                const nextIndex = transformationContext.nextIndex;
                transformationContext.nextIndex++;
                const indexingAlias = `__${prefix}${nextIndex}__`;
                transformationContext.paths[indexingAlias] = {
                    pathToField: wrappingPath.concat([alias]),
                    alias: possibleFieldNode.alias != null ? possibleFieldNode.alias.value : possibleFieldNode.name.value,
                };
                newFieldNodes.push(aliasFieldNode(possibleFieldNode, indexingAlias));
            }
        }
    }
    return newFieldNodes;
}
export function dehoistValue(originalValue, context) {
    if (originalValue == null) {
        return originalValue;
    }
    const newValue = Object.create(null);
    for (const alias in originalValue) {
        let obj = newValue;
        const path = context.paths[alias];
        if (path == null) {
            newValue[alias] = originalValue[alias];
            continue;
        }
        const pathToField = path.pathToField;
        const fieldAlias = path.alias;
        for (const key of pathToField) {
            obj = obj[key] = obj[key] || Object.create(null);
        }
        obj[fieldAlias] = originalValue[alias];
    }
    return newValue;
}
function dehoistErrors(errors, context) {
    if (errors === undefined) {
        return undefined;
    }
    return errors.map(error => {
        const originalPath = error.path;
        if (originalPath == null) {
            return error;
        }
        let newPath = [];
        for (const pathSegment of originalPath) {
            if (typeof pathSegment !== 'string') {
                newPath.push(pathSegment);
                continue;
            }
            const path = context.paths[pathSegment];
            if (path == null) {
                newPath.push(pathSegment);
                continue;
            }
            newPath = newPath.concat(path.pathToField, [path.alias]);
        }
        return relocatedError(error, newPath);
    });
}
