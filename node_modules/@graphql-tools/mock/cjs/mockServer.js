"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockServer = void 0;
const graphql_1 = require("graphql");
const schema_1 = require("@graphql-tools/schema");
const addMocksToSchema_js_1 = require("./addMocksToSchema.js");
/**
 * A convenience wrapper on top of addMocksToSchema. It adds your mock resolvers
 * to your schema and returns a client that will correctly execute your query with
 * variables. Note: when executing queries from the returned server, context and
 * root will both equal `{}`.
 * @param schema The schema to which to add mocks. This can also be a set of type
 * definitions instead.
 * @param mocks The mocks to add to the schema.
 * @param preserveResolvers Set to `true` to prevent existing resolvers from being
 * overwritten to provide mock data. This can be used to mock some parts of the
 * server and not others.
 */
function mockServer(schema, mocks, preserveResolvers = false) {
    const mockedSchema = (0, addMocksToSchema_js_1.addMocksToSchema)({
        schema: (0, graphql_1.isSchema)(schema)
            ? schema
            : (0, schema_1.makeExecutableSchema)({
                typeDefs: schema,
            }),
        mocks,
        preserveResolvers,
    });
    return {
        query: (query, vars) => (0, graphql_1.graphql)({
            schema: mockedSchema,
            source: query,
            rootValue: {},
            contextValue: {},
            variableValues: vars,
        }),
    };
}
exports.mockServer = mockServer;
