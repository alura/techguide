"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wrapSchema = void 0;
const graphql_1 = require("graphql");
const utils_1 = require("@graphql-tools/utils");
const delegate_1 = require("@graphql-tools/delegate");
const generateProxyingResolvers_js_1 = require("./generateProxyingResolvers.js");
exports.wrapSchema = (0, utils_1.memoize1)(function wrapSchema(subschemaConfig) {
    const targetSchema = subschemaConfig.schema;
    const proxyingResolvers = (0, generateProxyingResolvers_js_1.generateProxyingResolvers)(subschemaConfig);
    const schema = createWrappingSchema(targetSchema, proxyingResolvers);
    const transformed = (0, delegate_1.applySchemaTransforms)(schema, subschemaConfig);
    return transformed;
});
function createWrappingSchema(schema, proxyingResolvers) {
    return (0, utils_1.mapSchema)(schema, {
        [utils_1.MapperKind.ROOT_FIELD]: (fieldConfig, fieldName, typeName) => {
            var _a;
            return {
                ...fieldConfig,
                ...(_a = proxyingResolvers[typeName]) === null || _a === void 0 ? void 0 : _a[fieldName],
            };
        },
        [utils_1.MapperKind.OBJECT_FIELD]: fieldConfig => {
            return {
                ...fieldConfig,
                resolve: delegate_1.defaultMergedResolver,
                subscribe: undefined,
            };
        },
        [utils_1.MapperKind.OBJECT_TYPE]: type => {
            const config = type.toConfig();
            return new graphql_1.GraphQLObjectType({
                ...config,
                isTypeOf: undefined,
            });
        },
        [utils_1.MapperKind.INTERFACE_TYPE]: type => {
            const config = type.toConfig();
            return new graphql_1.GraphQLInterfaceType({
                ...config,
                resolveType: undefined,
            });
        },
        [utils_1.MapperKind.UNION_TYPE]: type => {
            const config = type.toConfig();
            return new graphql_1.GraphQLUnionType({
                ...config,
                resolveType: undefined,
            });
        },
        [utils_1.MapperKind.ENUM_VALUE]: valueConfig => {
            return {
                ...valueConfig,
                value: undefined,
            };
        },
    });
}
