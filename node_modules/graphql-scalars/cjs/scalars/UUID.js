"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLUUID = exports.GraphQLUUIDConfig = void 0;
const graphql_1 = require("graphql");
const error_js_1 = require("../error.js");
const validate = (value, ast) => {
    const UUID_REGEX = /^(\{){0,1}[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}(\}){0,1}$/gi;
    if (typeof value !== 'string') {
        throw (0, error_js_1.createGraphQLError)(`Value is not string: ${value}`, ast ? { nodes: ast } : undefined);
    }
    if (value.startsWith('{')) {
        value = value.substring(1, value.length - 1);
    }
    if (!UUID_REGEX.test(value)) {
        throw (0, error_js_1.createGraphQLError)(`Value is not a valid UUID: ${value}`, ast ? { nodes: ast } : undefined);
    }
    return value;
};
exports.GraphQLUUIDConfig = {
    name: `UUID`,
    description: `A field whose value is a generic Universally Unique Identifier: https://en.wikipedia.org/wiki/Universally_unique_identifier.`,
    serialize(value) {
        return validate(value);
    },
    parseValue(value) {
        return validate(value);
    },
    parseLiteral(ast) {
        if (ast.kind !== graphql_1.Kind.STRING) {
            throw (0, error_js_1.createGraphQLError)(`Can only validate strings as UUIDs but got a: ${ast.kind}`, {
                nodes: ast,
            });
        }
        return validate(ast.value, ast);
    },
    extensions: {
        codegenScalarType: 'string',
        jsonSchema: {
            type: 'string',
            format: 'uuid',
        },
    },
};
exports.GraphQLUUID = new graphql_1.GraphQLScalarType(exports.GraphQLUUIDConfig);
