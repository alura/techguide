"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLIPv4 = exports.IPV4_REGEX = void 0;
const graphql_1 = require("graphql");
const error_js_1 = require("../error.js");
exports.IPV4_REGEX = /^(?:(?:(?:0?0?[0-9]|0?[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\.){3}(?:0?0?[0-9]|0?[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])(?:\/(?:[0-9]|[1-2][0-9]|3[0-2]))?)$/;
const validate = (value, ast) => {
    if (typeof value !== 'string') {
        throw (0, error_js_1.createGraphQLError)(`Value is not string: ${value}`, ast ? { nodes: ast } : undefined);
    }
    if (!exports.IPV4_REGEX.test(value)) {
        throw (0, error_js_1.createGraphQLError)(`Value is not a valid IPv4 address: ${value}`, ast ? { nodes: ast } : undefined);
    }
    return value;
};
exports.GraphQLIPv4 = new graphql_1.GraphQLScalarType({
    name: `IPv4`,
    description: `A field whose value is a IPv4 address: https://en.wikipedia.org/wiki/IPv4.`,
    serialize(value) {
        return validate(value);
    },
    parseValue(value) {
        return validate(value);
    },
    parseLiteral(ast) {
        if (ast.kind !== graphql_1.Kind.STRING) {
            throw (0, error_js_1.createGraphQLError)(`Can only validate strings as IPv4 addresses but got a: ${ast.kind}`, { nodes: ast });
        }
        return validate(ast.value, ast);
    },
    extensions: {
        codegenScalarType: 'string',
        jsonSchema: {
            type: 'string',
            format: 'ipv4',
        },
    },
});
