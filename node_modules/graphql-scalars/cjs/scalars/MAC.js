"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLMAC = void 0;
const graphql_1 = require("graphql");
const error_js_1 = require("../error.js");
const MAC_REGEX = /^(?:[0-9A-Fa-f]{2}([:-]?)[0-9A-Fa-f]{2})(?:(?:\1|\.)(?:[0-9A-Fa-f]{2}([:-]?)[0-9A-Fa-f]{2})){2}$/;
const validate = (value, ast) => {
    if (typeof value !== 'string') {
        throw (0, error_js_1.createGraphQLError)(`Value is not string: ${value}`, ast ? { nodes: ast } : undefined);
    }
    if (!MAC_REGEX.test(value)) {
        throw (0, error_js_1.createGraphQLError)(`Value is not a valid MAC address: ${value}`, ast ? { nodes: ast } : undefined);
    }
    return value;
};
exports.GraphQLMAC = new graphql_1.GraphQLScalarType({
    name: `MAC`,
    description: `A field whose value is a IEEE 802 48-bit MAC address: https://en.wikipedia.org/wiki/MAC_address.`,
    serialize(value) {
        return validate(value);
    },
    parseValue(value) {
        return validate(value);
    },
    parseLiteral(ast) {
        if (ast.kind !== graphql_1.Kind.STRING) {
            throw (0, error_js_1.createGraphQLError)(`Can only validate strings as MAC addresses but got a: ${ast.kind}`, { nodes: ast });
        }
        return validate(ast.value, ast);
    },
    extensions: {
        codegenScalarType: 'string',
        jsonSchema: {
            title: 'MAC',
            type: 'string',
            pattern: MAC_REGEX.source,
        },
    },
});
