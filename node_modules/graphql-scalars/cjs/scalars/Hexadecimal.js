"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLHexadecimal = exports.GraphQLHexadecimalConfig = void 0;
const graphql_1 = require("graphql");
const error_js_1 = require("../error.js");
const HEXADECIMAL_REGEX = /^[a-f0-9]+$/i;
const validate = (value, ast) => {
    if (typeof value !== 'string') {
        throw (0, error_js_1.createGraphQLError)(`Value is not string: ${value}`, ast ? { nodes: ast } : undefined);
    }
    if (!HEXADECIMAL_REGEX.test(value)) {
        throw (0, error_js_1.createGraphQLError)(`Value is not a valid hexadecimal value: ${value}`, ast ? { nodes: ast } : undefined);
    }
    return value;
};
exports.GraphQLHexadecimalConfig = {
    name: `Hexadecimal`,
    description: `A field whose value is a hexadecimal: https://en.wikipedia.org/wiki/Hexadecimal.`,
    serialize(value) {
        return validate(value);
    },
    parseValue(value) {
        return validate(value);
    },
    parseLiteral(ast) {
        if (ast.kind !== graphql_1.Kind.STRING) {
            throw (0, error_js_1.createGraphQLError)(`Can only validate strings as a hexadecimal but got a: ${ast.kind}`, { nodes: ast });
        }
        return validate(ast.value, ast);
    },
    extensions: {
        codegenScalarType: 'string',
        jsonSchema: {
            title: 'Hexadecimal',
            type: 'string',
            pattern: HEXADECIMAL_REGEX.source,
        },
    },
};
exports.GraphQLHexadecimal = new graphql_1.GraphQLScalarType(exports.GraphQLHexadecimalConfig);
