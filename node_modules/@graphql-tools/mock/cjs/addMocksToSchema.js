"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addMocksToSchema = void 0;
const graphql_1 = require("graphql");
const utils_1 = require("@graphql-tools/utils");
const schema_1 = require("@graphql-tools/schema");
const types_js_1 = require("./types.js");
const utils_js_1 = require("./utils.js");
const MockStore_js_1 = require("./MockStore.js");
// todo: add option to preserve resolver
/**
 * Given a `schema` and a `MockStore`, returns an executable schema that
 * will use the provided `MockStore` to execute queries.
 *
 * ```ts
 * const schema = buildSchema(`
 *  type User {
 *    id: ID!
 *    name: String!
 *  }
 *  type Query {
 *    me: User!
 *  }
 * `)
 *
 * const store = createMockStore({ schema });
 * const mockedSchema = addMocksToSchema({ schema, store });
 * ```
 *
 *
 * If a `resolvers` parameter is passed, the query execution will use
 * the provided `resolvers` if, one exists, instead of the default mock
 * resolver.
 *
 *
 * ```ts
 * const schema = buildSchema(`
 *   type User {
 *     id: ID!
 *     name: String!
 *   }
 *   type Query {
 *     me: User!
 *   }
 *   type Mutation {
 *     setMyName(newName: String!): User!
 *   }
 * `)
 *
 * const store = createMockStore({ schema });
 * const mockedSchema = addMocksToSchema({
 *   schema,
 *   store,
 *   resolvers: {
 *     Mutation: {
 *       setMyName: (_, { newName }) => {
 *          const ref = store.get('Query', 'ROOT', 'viewer');
 *          store.set(ref, 'name', newName);
 *          return ref;
 *       }
 *     }
 *   }
 *  });
 * ```
 *
 *
 * `Query` and `Mutation` type will use `key` `'ROOT'`.
 */
function addMocksToSchema({ schema, store: maybeStore, mocks, typePolicies, resolvers: resolversOrFnResolvers, preserveResolvers = false, }) {
    if (!schema) {
        throw new Error('Must provide schema to mock');
    }
    if (!(0, graphql_1.isSchema)(schema)) {
        throw new Error('Value at "schema" must be of type GraphQLSchema');
    }
    if (mocks && !(0, utils_js_1.isObject)(mocks)) {
        throw new Error('mocks must be of type Object');
    }
    const store = maybeStore ||
        (0, MockStore_js_1.createMockStore)({
            schema,
            mocks,
            typePolicies,
        });
    const resolvers = typeof resolversOrFnResolvers === 'function'
        ? resolversOrFnResolvers(store)
        : resolversOrFnResolvers;
    const mockResolver = (source, args, contex, info) => {
        const defaultResolvedValue = (0, graphql_1.defaultFieldResolver)(source, args, contex, info);
        // priority to default resolved value
        if (defaultResolvedValue !== undefined)
            return defaultResolvedValue;
        if ((0, types_js_1.isRef)(source)) {
            return store.get({
                typeName: source.$ref.typeName,
                key: source.$ref.key,
                fieldName: info.fieldName,
                fieldArgs: args,
            });
        }
        // we have to handle the root mutation, root query and root subscription types
        // differently, because no resolver is called at the root
        if ((0, utils_js_1.isRootType)(info.parentType, info.schema)) {
            return store.get({
                typeName: info.parentType.name,
                key: 'ROOT',
                fieldName: info.fieldName,
                fieldArgs: args,
            });
        }
        if (defaultResolvedValue === undefined) {
            // any is used here because generateFieldValue is a private method at time of writing
            return store.generateFieldValue(info.parentType.name, info.fieldName);
        }
        return undefined;
    };
    const typeResolver = data => {
        if ((0, types_js_1.isRef)(data)) {
            return data.$ref.typeName;
        }
    };
    const mockSubscriber = () => ({
        [Symbol.asyncIterator]() {
            return {
                async next() {
                    return {
                        done: true,
                        value: {},
                    };
                },
            };
        },
    });
    const schemaWithMocks = (0, utils_1.mapSchema)(schema, {
        [utils_1.MapperKind.OBJECT_FIELD]: fieldConfig => {
            const newFieldConfig = {
                ...fieldConfig,
            };
            const oldResolver = fieldConfig.resolve;
            if (!preserveResolvers || !oldResolver) {
                newFieldConfig.resolve = mockResolver;
            }
            else {
                newFieldConfig.resolve = async (rootObject, args, context, info) => {
                    const [mockedValue, resolvedValue] = await Promise.all([
                        mockResolver(rootObject, args, context, info),
                        oldResolver(rootObject, args, context, info),
                    ]);
                    // In case we couldn't mock
                    if (mockedValue instanceof Error) {
                        // only if value was not resolved, populate the error.
                        if (undefined === resolvedValue) {
                            throw mockedValue;
                        }
                        return resolvedValue;
                    }
                    if (resolvedValue instanceof Date && mockedValue instanceof Date) {
                        return undefined !== resolvedValue ? resolvedValue : mockedValue;
                    }
                    if ((0, utils_js_1.isObject)(mockedValue) && (0, utils_js_1.isObject)(resolvedValue)) {
                        // Object.assign() won't do here, as we need to all properties, including
                        // the non-enumerable ones and defined using Object.defineProperty
                        const emptyObject = Object.create(Object.getPrototypeOf(resolvedValue));
                        return (0, utils_js_1.copyOwnProps)(emptyObject, resolvedValue, mockedValue);
                    }
                    return undefined !== resolvedValue ? resolvedValue : mockedValue;
                };
            }
            const fieldSubscriber = fieldConfig.subscribe;
            if (!preserveResolvers || !fieldSubscriber) {
                newFieldConfig.subscribe = mockSubscriber;
            }
            else {
                newFieldConfig.subscribe = async (rootObject, args, context, info) => {
                    const [mockAsyncIterable, oldAsyncIterable] = await Promise.all([
                        mockSubscriber(rootObject, args, context, info),
                        fieldSubscriber(rootObject, args, context, info),
                    ]);
                    return oldAsyncIterable || mockAsyncIterable;
                };
            }
            return newFieldConfig;
        },
        [utils_1.MapperKind.ABSTRACT_TYPE]: type => {
            if (preserveResolvers && type.resolveType != null && type.resolveType.length) {
                return;
            }
            if ((0, graphql_1.isUnionType)(type)) {
                return new graphql_1.GraphQLUnionType({
                    ...type.toConfig(),
                    resolveType: typeResolver,
                });
            }
            else {
                return new graphql_1.GraphQLInterfaceType({
                    ...type.toConfig(),
                    resolveType: typeResolver,
                });
            }
        },
    });
    return resolvers
        ? (0, schema_1.addResolversToSchema)({
            schema: schemaWithMocks,
            resolvers: resolvers,
        })
        : schemaWithMocks;
}
exports.addMocksToSchema = addMocksToSchema;
