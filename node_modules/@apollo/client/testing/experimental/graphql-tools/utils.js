import { __assign, __spreadArray } from "tslib";
import { GraphQLInterfaceType, GraphQLString, GraphQLUnionType, defaultFieldResolver, getNullableType, isAbstractType, isEnumType, isInterfaceType, isListType, isObjectType, isScalarType, isUnionType, } from "graphql";
import { isNonNullObject } from "../../../utilities/index.js";
import { MapperKind, mapSchema, getRootTypeNames } from "@graphql-tools/utils";
// Taken from @graphql-tools/mock:
// https://github.com/ardatan/graphql-tools/blob/4b56b04d69b02919f6c5fa4f97d33da63f36e8c8/packages/mock/src/utils.ts#L20
var takeRandom = function (arr) { return arr[Math.floor(Math.random() * arr.length)]; };
/**
 * A function that accepts a static `schema` and a `mocks` object for specifying
 * default scalar mocks and returns a `GraphQLSchema`.
 *
 * @param staticSchema - A static `GraphQLSchema`.
 * @param mocks - An object containing scalar mocks.
 * @returns A `GraphQLSchema` with scalar mocks.
 *
 * @example
 * ```js
 * const mockedSchema = createMockSchema(schema, {
     ID: () => "1",
     Int: () => 42,
     String: () => "String",
     Date: () => new Date("January 1, 2024 01:00:00").toJSON().split("T")[0],
  });
 * ```
 * @since 3.10.0
 * @alpha
 */
var createMockSchema = function (staticSchema, mocks) {
    var _a;
    // Taken from @graphql-tools/mock:
    // https://github.com/ardatan/graphql-tools/blob/5ed60e44f94868f976cd28fe1b6a764fb146bbe9/packages/mock/src/MockStore.ts#L613
    var getType = function (typeName) {
        var type = staticSchema.getType(typeName);
        if (!type || !(isObjectType(type) || isInterfaceType(type))) {
            throw new Error("".concat(typeName, " does not exist on schema or is not an object or interface"));
        }
        return type;
    };
    // Taken from @graphql-tools/mock:
    // https://github.com/ardatan/graphql-tools/blob/5ed60e44f94868f976cd28fe1b6a764fb146bbe9/packages/mock/src/MockStore.ts#L597
    var getFieldType = function (typeName, fieldName) {
        if (fieldName === "__typename") {
            return GraphQLString;
        }
        var type = getType(typeName);
        var field = type.getFields()[fieldName];
        if (!field) {
            throw new Error("".concat(fieldName, " does not exist on type ").concat(typeName));
        }
        return field.type;
    };
    // Taken from @graphql-tools/mock:
    // https://github.com/ardatan/graphql-tools/blob/5ed60e44f94868f976cd28fe1b6a764fb146bbe9/packages/mock/src/MockStore.ts#L527
    var generateValueFromType = function (fieldType) {
        var nullableType = getNullableType(fieldType);
        if (isScalarType(nullableType)) {
            var mockFn = mocks[nullableType.name];
            if (typeof mockFn !== "function") {
                throw new Error("No mock defined for type \"".concat(nullableType.name, "\""));
            }
            return mockFn();
        }
        else if (isEnumType(nullableType)) {
            var mockFn = mocks[nullableType.name];
            if (typeof mockFn === "function")
                return mockFn();
            var values = nullableType.getValues().map(function (v) { return v.value; });
            return takeRandom(values);
        }
        else if (isObjectType(nullableType)) {
            return {};
        }
        else if (isListType(nullableType)) {
            return __spreadArray([], new Array(2), true).map(function () {
                return generateValueFromType(nullableType.ofType);
            });
        }
        else if (isAbstractType(nullableType)) {
            var mock = mocks[nullableType.name];
            var typeName = void 0;
            var values = {};
            if (!mock) {
                typeName = takeRandom(staticSchema.getPossibleTypes(nullableType).map(function (t) { return t.name; }));
            }
            else if (typeof mock === "function") {
                var mockRes = mock();
                if (mockRes === null)
                    return null;
                if (!isNonNullObject(mockRes)) {
                    throw new Error("Value returned by the mock for ".concat(nullableType.name, " is not an object or null"));
                }
                values = mockRes;
                if (typeof values["__typename"] !== "string") {
                    throw new Error("Please return a __typename in \"".concat(nullableType.name, "\""));
                }
                typeName = values["__typename"];
            }
            else if (isNonNullObject(mock) &&
                typeof mock["__typename"] === "function") {
                var mockRes = mock["__typename"]();
                if (typeof mockRes !== "string") {
                    throw new Error("'__typename' returned by the mock for abstract type ".concat(nullableType.name, " is not a string"));
                }
                typeName = mockRes;
            }
            else {
                throw new Error("Please return a __typename in \"".concat(nullableType.name, "\""));
            }
            return typeName;
        }
        else {
            throw new Error("".concat(nullableType, " not implemented"));
        }
    };
    // Taken from @graphql-tools/mock:
    // https://github.com/ardatan/graphql-tools/blob/5ed60e44f94868f976cd28fe1b6a764fb146bbe9/packages/mock/src/utils.ts#L53
    var isRootType = function (type, schema) {
        var rootTypeNames = getRootTypeNames(schema);
        return rootTypeNames.has(type.name);
    };
    // Taken from @graphql-tools/mock:
    // https://github.com/ardatan/graphql-tools/blob/5ed60e44f94868f976cd28fe1b6a764fb146bbe9/packages/mock/src/addMocksToSchema.ts#L123
    var mockResolver = function (source, args, contex, info) {
        var defaultResolvedValue = defaultFieldResolver(source, args, contex, info);
        // priority to default resolved value
        if (defaultResolvedValue !== undefined)
            return defaultResolvedValue;
        // we have to handle the root mutation, root query and root subscription types
        // differently, because no resolver is called at the root
        if (isRootType(info.parentType, info.schema)) {
            return {
                typeName: info.parentType.name,
                key: "ROOT",
                fieldName: info.fieldName,
                fieldArgs: args,
            };
        }
        if (defaultResolvedValue === undefined) {
            var fieldType = getFieldType(info.parentType.name, info.fieldName);
            return generateValueFromType(fieldType);
        }
        return undefined;
    };
    // Taken from @graphql-tools/mock:
    // https://github.com/ardatan/graphql-tools/blob/5ed60e44f94868f976cd28fe1b6a764fb146bbe9/packages/mock/src/addMocksToSchema.ts#L176
    return mapSchema(staticSchema, (_a = {},
        _a[MapperKind.OBJECT_FIELD] = function (fieldConfig) {
            var newFieldConfig = __assign({}, fieldConfig);
            var oldResolver = fieldConfig.resolve;
            if (!oldResolver) {
                newFieldConfig.resolve = mockResolver;
            }
            return newFieldConfig;
        },
        _a[MapperKind.ABSTRACT_TYPE] = function (type) {
            if (type.resolveType != null && type.resolveType.length) {
                return;
            }
            var typeResolver = function (typename) {
                return typename;
            };
            if (isUnionType(type)) {
                return new GraphQLUnionType(__assign(__assign({}, type.toConfig()), { resolveType: typeResolver }));
            }
            else {
                return new GraphQLInterfaceType(__assign(__assign({}, type.toConfig()), { resolveType: typeResolver }));
            }
        },
        _a));
};
export { createMockSchema };
//# sourceMappingURL=utils.js.map