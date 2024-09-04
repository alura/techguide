"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.whenResultIsFinished = exports.pluginsEnabledForSchemaResolvers = exports.enablePluginsForSchemaResolvers = exports.symbolUserFieldResolver = exports.symbolExecutionDispatcherWillResolveField = void 0;
const type_1 = require("graphql/type");
const execution_1 = require("graphql/execution");
exports.symbolExecutionDispatcherWillResolveField = Symbol('apolloServerExecutionDispatcherWillResolveField');
exports.symbolUserFieldResolver = Symbol('apolloServerUserFieldResolver');
const symbolPluginsEnabled = Symbol('apolloServerPluginsEnabled');
function enablePluginsForSchemaResolvers(schema) {
    if (pluginsEnabledForSchemaResolvers(schema)) {
        return schema;
    }
    Object.defineProperty(schema, symbolPluginsEnabled, {
        value: true,
    });
    forEachField(schema, wrapField);
    return schema;
}
exports.enablePluginsForSchemaResolvers = enablePluginsForSchemaResolvers;
function pluginsEnabledForSchemaResolvers(schema) {
    return !!schema[symbolPluginsEnabled];
}
exports.pluginsEnabledForSchemaResolvers = pluginsEnabledForSchemaResolvers;
function wrapField(field) {
    const originalFieldResolve = field.resolve;
    field.resolve = (source, args, context, info) => {
        const parentPath = info.path.prev;
        const willResolveField = context === null || context === void 0 ? void 0 : context[exports.symbolExecutionDispatcherWillResolveField];
        const userFieldResolver = context === null || context === void 0 ? void 0 : context[exports.symbolUserFieldResolver];
        const didResolveField = typeof willResolveField === 'function' &&
            willResolveField({ source, args, context, info });
        const resolveObject = info.parentType.resolveObject;
        let whenObjectResolved;
        if (parentPath && resolveObject) {
            if (!parentPath.__fields) {
                parentPath.__fields = {};
            }
            parentPath.__fields[info.fieldName] = info.fieldNodes;
            whenObjectResolved = parentPath.__whenObjectResolved;
            if (!whenObjectResolved) {
                whenObjectResolved = Promise.resolve().then(() => {
                    return resolveObject(source, parentPath.__fields, context, info);
                });
                parentPath.__whenObjectResolved = whenObjectResolved;
            }
        }
        const fieldResolver = originalFieldResolve || userFieldResolver || execution_1.defaultFieldResolver;
        try {
            let result;
            if (whenObjectResolved) {
                result = whenObjectResolved.then((resolvedObject) => {
                    return fieldResolver(resolvedObject, args, context, info);
                });
            }
            else {
                result = fieldResolver(source, args, context, info);
            }
            if (typeof didResolveField === 'function') {
                whenResultIsFinished(result, didResolveField);
            }
            return result;
        }
        catch (error) {
            if (typeof didResolveField === 'function') {
                didResolveField(error);
            }
            throw error;
        }
    };
}
function isPromise(x) {
    return x && typeof x.then === 'function';
}
function whenResultIsFinished(result, callback) {
    if (isPromise(result)) {
        result.then((r) => callback(null, r), (err) => callback(err));
    }
    else if (Array.isArray(result)) {
        if (result.some(isPromise)) {
            Promise.all(result).then((r) => callback(null, r), (err) => callback(err));
        }
        else {
            callback(null, result);
        }
    }
    else {
        callback(null, result);
    }
}
exports.whenResultIsFinished = whenResultIsFinished;
function forEachField(schema, fn) {
    const typeMap = schema.getTypeMap();
    Object.entries(typeMap).forEach(([typeName, type]) => {
        if (!(0, type_1.getNamedType)(type).name.startsWith('__') &&
            type instanceof type_1.GraphQLObjectType) {
            const fields = type.getFields();
            Object.entries(fields).forEach(([fieldName, field]) => {
                fn(field, typeName, fieldName);
            });
        }
    });
}
//# sourceMappingURL=schemaInstrumentation.js.map