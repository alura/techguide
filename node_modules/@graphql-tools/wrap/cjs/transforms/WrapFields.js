"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dehoistValue = void 0;
const tslib_1 = require("tslib");
const graphql_1 = require("graphql");
const utils_1 = require("@graphql-tools/utils");
const delegate_1 = require("@graphql-tools/delegate");
const MapFields_js_1 = tslib_1.__importDefault(require("./MapFields.js"));
const generateProxyingResolvers_js_1 = require("../generateProxyingResolvers.js");
class WrapFields {
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
        this.transformer = new MapFields_js_1.default({
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
        const targetFieldConfigMap = (0, utils_1.selectObjectFields)(originalWrappingSchema, this.outerTypeName, !fieldNames ? () => true : fieldName => fieldNames.includes(fieldName));
        const newTargetFieldConfigMap = Object.create(null);
        for (const fieldName in targetFieldConfigMap) {
            const field = targetFieldConfigMap[fieldName];
            const newField = {
                ...field,
                resolve: delegate_1.defaultMergedResolver,
            };
            newTargetFieldConfigMap[fieldName] = newField;
        }
        let wrapIndex = this.numWraps - 1;
        let wrappingTypeName = this.wrappingTypeNames[wrapIndex];
        let wrappingFieldName = this.wrappingFieldNames[wrapIndex];
        let newSchema = (0, utils_1.appendObjectFields)(originalWrappingSchema, wrappingTypeName, newTargetFieldConfigMap);
        for (wrapIndex--; wrapIndex > -1; wrapIndex--) {
            const nextWrappingTypeName = this.wrappingTypeNames[wrapIndex];
            newSchema = (0, utils_1.appendObjectFields)(newSchema, nextWrappingTypeName, {
                [wrappingFieldName]: {
                    type: new graphql_1.GraphQLNonNull(newSchema.getType(wrappingTypeName)),
                    resolve: delegate_1.defaultMergedResolver,
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
            const createProxyingResolver = (_d = subschemaConfig.createProxyingResolver) !== null && _d !== void 0 ? _d : generateProxyingResolvers_js_1.defaultCreateProxyingResolver;
            resolve = createProxyingResolver({
                subschemaConfig,
                operation: operation,
                fieldName: wrappingFieldName,
            });
        }
        else {
            resolve = delegate_1.defaultMergedResolver;
        }
        [newSchema] = (0, utils_1.modifyObjectFields)(newSchema, this.outerTypeName, fieldName => !!newTargetFieldConfigMap[fieldName], {
            [wrappingFieldName]: {
                type: new graphql_1.GraphQLNonNull(newSchema.getType(wrappingTypeName)),
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
exports.default = WrapFields;
function collectFields(selectionSet, fragments, fields = [], visitedFragmentNames = {}) {
    if (selectionSet != null) {
        for (const selection of selectionSet.selections) {
            switch (selection.kind) {
                case graphql_1.Kind.FIELD:
                    fields.push(selection);
                    break;
                case graphql_1.Kind.INLINE_FRAGMENT:
                    collectFields(selection.selectionSet, fragments, fields, visitedFragmentNames);
                    break;
                case graphql_1.Kind.FRAGMENT_SPREAD: {
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
            kind: graphql_1.Kind.NAME,
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
function dehoistValue(originalValue, context) {
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
exports.dehoistValue = dehoistValue;
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
        return (0, utils_1.relocatedError)(error, newPath);
    });
}
