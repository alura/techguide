"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultCreateProxyingResolver = exports.generateProxyingResolvers = void 0;
const utils_1 = require("@graphql-tools/utils");
const delegate_1 = require("@graphql-tools/delegate");
function generateProxyingResolvers(subschemaConfig) {
    var _a;
    const targetSchema = subschemaConfig.schema;
    const createProxyingResolver = (_a = subschemaConfig.createProxyingResolver) !== null && _a !== void 0 ? _a : defaultCreateProxyingResolver;
    const rootTypeMap = (0, utils_1.getRootTypeMap)(targetSchema);
    const resolvers = {};
    for (const [operation, rootType] of rootTypeMap.entries()) {
        const typeName = rootType.name;
        const fields = rootType.getFields();
        resolvers[typeName] = {};
        for (const fieldName in fields) {
            const proxyingResolver = createProxyingResolver({
                subschemaConfig,
                operation,
                fieldName,
            });
            const finalResolver = createPossiblyNestedProxyingResolver(subschemaConfig, proxyingResolver);
            if (operation === 'subscription') {
                resolvers[typeName][fieldName] = {
                    subscribe: finalResolver,
                    resolve: identical,
                };
            }
            else {
                resolvers[typeName][fieldName] = {
                    resolve: finalResolver,
                };
            }
        }
    }
    return resolvers;
}
exports.generateProxyingResolvers = generateProxyingResolvers;
function identical(value) {
    return value;
}
function createPossiblyNestedProxyingResolver(subschemaConfig, proxyingResolver) {
    return function possiblyNestedProxyingResolver(parent, args, context, info) {
        if (parent != null) {
            const responseKey = (0, utils_1.getResponseKeyFromInfo)(info);
            // Check to see if the parent contains a proxied result
            if ((0, delegate_1.isExternalObject)(parent)) {
                const unpathedErrors = (0, delegate_1.getUnpathedErrors)(parent);
                const subschema = (0, delegate_1.getSubschema)(parent, responseKey);
                // If there is a proxied result from this subschema, return it
                // This can happen even for a root field when the root type ia
                // also nested as a field within a different type.
                if (subschemaConfig === subschema && parent[responseKey] !== undefined) {
                    return (0, delegate_1.resolveExternalValue)(parent[responseKey], unpathedErrors, subschema, context, info);
                }
            }
        }
        return proxyingResolver(parent, args, context, info);
    };
}
function defaultCreateProxyingResolver({ subschemaConfig, operation, }) {
    return function proxyingResolver(_parent, _args, context, info) {
        return (0, delegate_1.delegateToSchema)({
            schema: subschemaConfig,
            operation,
            context,
            info,
        });
    };
}
exports.defaultCreateProxyingResolver = defaultCreateProxyingResolver;
