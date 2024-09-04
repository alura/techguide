import { GraphQLObjectType, GraphQLInterfaceType, GraphQLUnionType, } from 'graphql';
import { MapperKind, mapSchema, memoize1 } from '@graphql-tools/utils';
import { defaultMergedResolver, applySchemaTransforms } from '@graphql-tools/delegate';
import { generateProxyingResolvers } from './generateProxyingResolvers.js';
export const wrapSchema = memoize1(function wrapSchema(subschemaConfig) {
    const targetSchema = subschemaConfig.schema;
    const proxyingResolvers = generateProxyingResolvers(subschemaConfig);
    const schema = createWrappingSchema(targetSchema, proxyingResolvers);
    const transformed = applySchemaTransforms(schema, subschemaConfig);
    return transformed;
});
function createWrappingSchema(schema, proxyingResolvers) {
    return mapSchema(schema, {
        [MapperKind.ROOT_FIELD]: (fieldConfig, fieldName, typeName) => {
            var _a;
            return {
                ...fieldConfig,
                ...(_a = proxyingResolvers[typeName]) === null || _a === void 0 ? void 0 : _a[fieldName],
            };
        },
        [MapperKind.OBJECT_FIELD]: fieldConfig => {
            return {
                ...fieldConfig,
                resolve: defaultMergedResolver,
                subscribe: undefined,
            };
        },
        [MapperKind.OBJECT_TYPE]: type => {
            const config = type.toConfig();
            return new GraphQLObjectType({
                ...config,
                isTypeOf: undefined,
            });
        },
        [MapperKind.INTERFACE_TYPE]: type => {
            const config = type.toConfig();
            return new GraphQLInterfaceType({
                ...config,
                resolveType: undefined,
            });
        },
        [MapperKind.UNION_TYPE]: type => {
            const config = type.toConfig();
            return new GraphQLUnionType({
                ...config,
                resolveType: undefined,
            });
        },
        [MapperKind.ENUM_VALUE]: valueConfig => {
            return {
                ...valueConfig,
                value: undefined,
            };
        },
    });
}
