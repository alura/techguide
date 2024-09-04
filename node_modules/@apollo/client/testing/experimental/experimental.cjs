'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var schema = require('@graphql-tools/schema');
var merge = require('@graphql-tools/merge');
var graphql = require('graphql');
var utilities = require('../../utilities');
var utils = require('@graphql-tools/utils');
var core = require('../../core');

var takeRandom = function (arr) { return arr[Math.floor(Math.random() * arr.length)]; };
var createMockSchema = function (staticSchema, mocks) {
    var _a;
    var getType = function (typeName) {
        var type = staticSchema.getType(typeName);
        if (!type || !(graphql.isObjectType(type) || graphql.isInterfaceType(type))) {
            throw new Error("".concat(typeName, " does not exist on schema or is not an object or interface"));
        }
        return type;
    };
    var getFieldType = function (typeName, fieldName) {
        if (fieldName === "__typename") {
            return graphql.GraphQLString;
        }
        var type = getType(typeName);
        var field = type.getFields()[fieldName];
        if (!field) {
            throw new Error("".concat(fieldName, " does not exist on type ").concat(typeName));
        }
        return field.type;
    };
    var generateValueFromType = function (fieldType) {
        var nullableType = graphql.getNullableType(fieldType);
        if (graphql.isScalarType(nullableType)) {
            var mockFn = mocks[nullableType.name];
            if (typeof mockFn !== "function") {
                throw new Error("No mock defined for type \"".concat(nullableType.name, "\""));
            }
            return mockFn();
        }
        else if (graphql.isEnumType(nullableType)) {
            var mockFn = mocks[nullableType.name];
            if (typeof mockFn === "function")
                return mockFn();
            var values = nullableType.getValues().map(function (v) { return v.value; });
            return takeRandom(values);
        }
        else if (graphql.isObjectType(nullableType)) {
            return {};
        }
        else if (graphql.isListType(nullableType)) {
            return tslib.__spreadArray([], new Array(2), true).map(function () {
                return generateValueFromType(nullableType.ofType);
            });
        }
        else if (graphql.isAbstractType(nullableType)) {
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
                if (!utilities.isNonNullObject(mockRes)) {
                    throw new Error("Value returned by the mock for ".concat(nullableType.name, " is not an object or null"));
                }
                values = mockRes;
                if (typeof values["__typename"] !== "string") {
                    throw new Error("Please return a __typename in \"".concat(nullableType.name, "\""));
                }
                typeName = values["__typename"];
            }
            else if (utilities.isNonNullObject(mock) &&
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
    var isRootType = function (type, schema) {
        var rootTypeNames = utils.getRootTypeNames(schema);
        return rootTypeNames.has(type.name);
    };
    var mockResolver = function (source, args, contex, info) {
        var defaultResolvedValue = graphql.defaultFieldResolver(source, args, contex, info);
        if (defaultResolvedValue !== undefined)
            return defaultResolvedValue;
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
    return utils.mapSchema(staticSchema, (_a = {},
        _a[utils.MapperKind.OBJECT_FIELD] = function (fieldConfig) {
            var newFieldConfig = tslib.__assign({}, fieldConfig);
            var oldResolver = fieldConfig.resolve;
            if (!oldResolver) {
                newFieldConfig.resolve = mockResolver;
            }
            return newFieldConfig;
        },
        _a[utils.MapperKind.ABSTRACT_TYPE] = function (type) {
            if (type.resolveType != null && type.resolveType.length) {
                return;
            }
            var typeResolver = function (typename) {
                return typename;
            };
            if (graphql.isUnionType(type)) {
                return new graphql.GraphQLUnionType(tslib.__assign(tslib.__assign({}, type.toConfig()), { resolveType: typeResolver }));
            }
            else {
                return new graphql.GraphQLInterfaceType(tslib.__assign(tslib.__assign({}, type.toConfig()), { resolveType: typeResolver }));
            }
        },
        _a));
};

var createTestSchema = function (schemaWithTypeDefs, options) {
    var _a;
    var targetResolvers = tslib.__assign({}, options.resolvers);
    var targetSchema = schema.addResolversToSchema({
        schema: createMockSchema(schemaWithTypeDefs, (_a = options.scalars) !== null && _a !== void 0 ? _a : {}),
        resolvers: targetResolvers,
    });
    var fns = {
        add: function (_a) {
            var newResolvers = _a.resolvers;
            targetResolvers = merge.mergeResolvers([targetResolvers, newResolvers]);
            targetSchema = schema.addResolversToSchema({
                schema: targetSchema,
                resolvers: targetResolvers,
            });
            return targetSchema;
        },
        fork: function (_a) {
            var _b;
            var _c = _a === void 0 ? {} : _a, newResolvers = _c.resolvers;
            return createTestSchema(targetSchema, {
                resolvers: (_b = merge.mergeResolvers([targetResolvers, newResolvers])) !== null && _b !== void 0 ? _b : targetResolvers,
                scalars: options.scalars,
            });
        },
        reset: function () {
            targetSchema = schema.addResolversToSchema({
                schema: schemaWithTypeDefs,
                resolvers: options.resolvers,
            });
        },
    };
    var schema$1 = new Proxy(targetSchema, {
        get: function (_target, p) {
            if (p in fns) {
                return Reflect.get(fns, p);
            }
            var property = Reflect.get(targetSchema, p);
            if (typeof property === "function") {
                return property.bind(targetSchema);
            }
            return property;
        },
    });
    return schema$1;
};

function withCleanup(item, cleanup) {
    var _a;
    return tslib.__assign(tslib.__assign({}, item), (_a = {}, _a[Symbol.dispose] = function () {
        cleanup(item);
        if (Symbol.dispose in item) {
            item[Symbol.dispose]();
        }
    }, _a));
}

function wait(ms) {
    return tslib.__awaiter(this, void 0, void 0, function () {
        return tslib.__generator(this, function (_a) {
            return [2 , new Promise(function (resolve) { return setTimeout(resolve, ms); })];
        });
    });
}

var createSchemaFetch = function (schema, mockFetchOpts) {
    var _a, _b, _c, _d;
    if (mockFetchOpts === void 0) { mockFetchOpts = { validate: true }; }
    var prevFetch = window.fetch;
    var delayMin = (_b = (_a = mockFetchOpts.delay) === null || _a === void 0 ? void 0 : _a.min) !== null && _b !== void 0 ? _b : 3;
    var delayMax = (_d = (_c = mockFetchOpts.delay) === null || _c === void 0 ? void 0 : _c.max) !== null && _d !== void 0 ? _d : delayMin + 2;
    if (delayMin > delayMax) {
        throw new Error("Please configure a minimum delay that is less than the maximum delay. The default minimum delay is 3ms.");
    }
    var mockFetch = function (_uri, options) { return tslib.__awaiter(void 0, void 0, void 0, function () {
        var randomDelay, body, document, validationErrors, result, stringifiedResult;
        return tslib.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(delayMin > 0)) return [3 , 2];
                    randomDelay = Math.random() * (delayMax - delayMin) + delayMin;
                    return [4 , wait(randomDelay)];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    body = JSON.parse(options.body);
                    document = core.gql(body.query);
                    if (mockFetchOpts.validate) {
                        validationErrors = [];
                        try {
                            validationErrors = graphql.validate(schema, document);
                        }
                        catch (e) {
                            validationErrors = [
                                new core.ApolloError({ graphQLErrors: [e] }),
                            ];
                        }
                        if ((validationErrors === null || validationErrors === void 0 ? void 0 : validationErrors.length) > 0) {
                            return [2 , new Response(JSON.stringify({ errors: validationErrors }))];
                        }
                    }
                    return [4 , graphql.execute({
                            schema: schema,
                            document: document,
                            variableValues: body.variables,
                            operationName: body.operationName,
                        })];
                case 3:
                    result = _a.sent();
                    stringifiedResult = JSON.stringify(result);
                    return [2 , new Response(stringifiedResult)];
            }
        });
    }); };
    function mockGlobal() {
        window.fetch = mockFetch;
        var restore = function () {
            if (window.fetch === mockFetch) {
                window.fetch = prevFetch;
            }
        };
        return withCleanup({ restore: restore }, restore);
    }
    return Object.assign(mockFetch, {
        mockGlobal: mockGlobal,
    });
};

exports.createSchemaFetch = createSchemaFetch;
exports.createTestSchema = createTestSchema;
//# sourceMappingURL=experimental.cjs.map
