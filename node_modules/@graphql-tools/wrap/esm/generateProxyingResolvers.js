import { getResponseKeyFromInfo, getRootTypeMap } from '@graphql-tools/utils';
import { delegateToSchema, getSubschema, resolveExternalValue, isExternalObject, getUnpathedErrors, } from '@graphql-tools/delegate';
export function generateProxyingResolvers(subschemaConfig) {
    var _a;
    const targetSchema = subschemaConfig.schema;
    const createProxyingResolver = (_a = subschemaConfig.createProxyingResolver) !== null && _a !== void 0 ? _a : defaultCreateProxyingResolver;
    const rootTypeMap = getRootTypeMap(targetSchema);
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
function identical(value) {
    return value;
}
function createPossiblyNestedProxyingResolver(subschemaConfig, proxyingResolver) {
    return function possiblyNestedProxyingResolver(parent, args, context, info) {
        if (parent != null) {
            const responseKey = getResponseKeyFromInfo(info);
            // Check to see if the parent contains a proxied result
            if (isExternalObject(parent)) {
                const unpathedErrors = getUnpathedErrors(parent);
                const subschema = getSubschema(parent, responseKey);
                // If there is a proxied result from this subschema, return it
                // This can happen even for a root field when the root type ia
                // also nested as a field within a different type.
                if (subschemaConfig === subschema && parent[responseKey] !== undefined) {
                    return resolveExternalValue(parent[responseKey], unpathedErrors, subschema, context, info);
                }
            }
        }
        return proxyingResolver(parent, args, context, info);
    };
}
export function defaultCreateProxyingResolver({ subschemaConfig, operation, }) {
    return function proxyingResolver(_parent, _args, context, info) {
        return delegateToSchema({
            schema: subschemaConfig,
            operation,
            context,
            info,
        });
    };
}
