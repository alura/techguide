import { getNullableType, Kind, isListType, getNamedType, GraphQLList, } from 'graphql';
import { appendObjectFields, removeObjectFields, relocatedError, } from '@graphql-tools/utils';
import { defaultMergedResolver } from '@graphql-tools/delegate';
import { defaultCreateProxyingResolver } from '../generateProxyingResolvers.js';
import MapFields from './MapFields.js';
export default class HoistField {
    constructor(typeName, pathConfig, newFieldName, alias = '__gqtlw__') {
        this.typeName = typeName;
        this.newFieldName = newFieldName;
        const path = pathConfig.map(segment => (typeof segment === 'string' ? segment : segment.fieldName));
        this.argFilters = pathConfig.map((segment, index) => {
            if (typeof segment === 'string' || segment.argFilter == null) {
                return index === pathConfig.length - 1 ? () => true : () => false;
            }
            return segment.argFilter;
        });
        const pathToField = path.slice();
        const oldFieldName = pathToField.pop();
        if (oldFieldName == null) {
            throw new Error(`Cannot hoist field to ${newFieldName} on type ${typeName}, no path provided.`);
        }
        this.oldFieldName = oldFieldName;
        this.pathToField = pathToField;
        const argLevels = Object.create(null);
        this.transformer = new MapFields({
            [typeName]: {
                [newFieldName]: fieldNode => wrapFieldNode(renameFieldNode(fieldNode, oldFieldName), pathToField, alias, argLevels),
            },
        }, {
            [typeName]: value => unwrapValue(value, alias),
        }, errors => (errors != null ? unwrapErrors(errors, alias) : undefined));
        this.argLevels = argLevels;
    }
    transformSchema(originalWrappingSchema, subschemaConfig) {
        var _a, _b, _c, _d;
        const argsMap = Object.create(null);
        let isList = false;
        const innerType = this.pathToField.reduce((acc, pathSegment, index) => {
            const field = acc.getFields()[pathSegment];
            for (const arg of field.args) {
                if (this.argFilters[index](arg)) {
                    argsMap[arg.name] = arg;
                    this.argLevels[arg.name] = index;
                }
            }
            const nullableType = getNullableType(field.type);
            if (isListType(nullableType)) {
                isList = true;
                return getNamedType(nullableType);
            }
            return nullableType;
        }, originalWrappingSchema.getType(this.typeName));
        let [newSchema, targetFieldConfigMap] = removeObjectFields(originalWrappingSchema, innerType.name, fieldName => fieldName === this.oldFieldName);
        const targetField = targetFieldConfigMap[this.oldFieldName];
        let resolve;
        const hoistingToRootField = this.typeName === ((_a = originalWrappingSchema.getQueryType()) === null || _a === void 0 ? void 0 : _a.name) ||
            this.typeName === ((_b = originalWrappingSchema.getMutationType()) === null || _b === void 0 ? void 0 : _b.name);
        if (hoistingToRootField) {
            const targetSchema = subschemaConfig.schema;
            const operation = this.typeName === ((_c = targetSchema.getQueryType()) === null || _c === void 0 ? void 0 : _c.name) ? 'query' : 'mutation';
            const createProxyingResolver = (_d = subschemaConfig.createProxyingResolver) !== null && _d !== void 0 ? _d : defaultCreateProxyingResolver;
            resolve = createProxyingResolver({
                subschemaConfig,
                operation: operation,
                fieldName: this.newFieldName,
            });
        }
        else {
            resolve = defaultMergedResolver;
        }
        const newTargetField = {
            ...targetField,
            resolve: resolve,
        };
        const level = this.pathToField.length;
        const args = targetField.args;
        if (args != null) {
            for (const argName in args) {
                const argConfig = args[argName];
                if (argConfig == null) {
                    continue;
                }
                const arg = {
                    ...argConfig,
                    name: argName,
                    description: argConfig.description,
                    defaultValue: argConfig.defaultValue,
                    extensions: argConfig.extensions,
                    astNode: argConfig.astNode,
                };
                if (this.argFilters[level](arg)) {
                    argsMap[argName] = arg;
                    this.argLevels[arg.name] = level;
                }
            }
        }
        newTargetField.args = argsMap;
        if (isList) {
            newTargetField.type = new GraphQLList(newTargetField.type);
            const resolver = newTargetField.resolve;
            newTargetField.resolve = (parent, args, context, info) => Promise.all(Object.keys(parent)
                .filter(key => !isNaN(parseInt(key, 10)))
                .map(key => resolver(parent[key], args, context, info)));
        }
        newSchema = appendObjectFields(newSchema, this.typeName, {
            [this.newFieldName]: newTargetField,
        });
        return this.transformer.transformSchema(newSchema, subschemaConfig);
    }
    transformRequest(originalRequest, delegationContext, transformationContext) {
        return this.transformer.transformRequest(originalRequest, delegationContext, transformationContext);
    }
    transformResult(originalResult, delegationContext, transformationContext) {
        return this.transformer.transformResult(originalResult, delegationContext, transformationContext);
    }
}
export function wrapFieldNode(fieldNode, path, alias, argLevels) {
    return path.reduceRight((acc, fieldName, index) => ({
        kind: Kind.FIELD,
        alias: {
            kind: Kind.NAME,
            value: alias,
        },
        name: {
            kind: Kind.NAME,
            value: fieldName,
        },
        selectionSet: {
            kind: Kind.SELECTION_SET,
            selections: [acc],
        },
        arguments: fieldNode.arguments != null
            ? fieldNode.arguments.filter(arg => argLevels[arg.name.value] === index)
            : undefined,
    }), {
        ...fieldNode,
        arguments: fieldNode.arguments != null
            ? fieldNode.arguments.filter(arg => argLevels[arg.name.value] === path.length)
            : undefined,
    });
}
export function renameFieldNode(fieldNode, name) {
    return {
        ...fieldNode,
        alias: {
            kind: Kind.NAME,
            value: fieldNode.alias != null ? fieldNode.alias.value : fieldNode.name.value,
        },
        name: {
            kind: Kind.NAME,
            value: name,
        },
    };
}
export function unwrapValue(originalValue, alias) {
    let newValue = originalValue;
    let object = newValue[alias];
    while (object != null) {
        newValue = object;
        object = newValue[alias];
    }
    delete originalValue[alias];
    Object.assign(originalValue, newValue);
    return originalValue;
}
function unwrapErrors(errors, alias) {
    if (errors === undefined) {
        return undefined;
    }
    return errors.map(error => {
        const originalPath = error.path;
        if (originalPath == null) {
            return error;
        }
        const newPath = originalPath.filter(pathSegment => pathSegment !== alias);
        return relocatedError(error, newPath);
    });
}
