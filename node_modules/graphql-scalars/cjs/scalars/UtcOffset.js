"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLUtcOffset = void 0;
const graphql_1 = require("graphql");
const error_js_1 = require("../error.js");
const UTC_OFFSET_REGEX = /^([+-]?)(\d{2}):(\d{2})$/;
const validate = (value, ast) => {
    if (typeof value !== 'string') {
        throw (0, error_js_1.createGraphQLError)(`Value is not string: ${value}`, ast ? { nodes: ast } : undefined);
    }
    if (!UTC_OFFSET_REGEX.test(value)) {
        throw (0, error_js_1.createGraphQLError)(`Value is not a valid UTC Offset: ${value}`, ast ? { nodes: ast } : undefined);
    }
    return value;
};
exports.GraphQLUtcOffset = new graphql_1.GraphQLScalarType({
    name: 'UtcOffset',
    description: 'A field whose value is a UTC Offset: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones',
    serialize: validate,
    parseValue: validate,
    parseLiteral(ast) {
        if (ast.kind !== graphql_1.Kind.STRING) {
            throw (0, error_js_1.createGraphQLError)(`Can only validate strings as UTC Offset but got a: ${ast.kind}`, {
                nodes: ast,
            });
        }
        return validate(ast.value, ast);
    },
    extensions: {
        codegenScalarType: 'string',
        jsonSchema: {
            title: 'UtcOffset',
            type: 'string',
            pattern: UTC_OFFSET_REGEX.source,
        },
    },
});
