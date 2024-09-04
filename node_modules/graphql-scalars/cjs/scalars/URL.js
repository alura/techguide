"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLURL = void 0;
const graphql_1 = require("graphql");
const error_js_1 = require("../error.js");
exports.GraphQLURL = new graphql_1.GraphQLScalarType({
    name: 'URL',
    description: 'A field whose value conforms to the standard URL format as specified in RFC3986: https://www.ietf.org/rfc/rfc3986.txt.',
    serialize(value) {
        if (value === null) {
            return value;
        }
        return new URL(value.toString()).toString();
    },
    parseValue: value => (value === null ? value : new URL(value.toString())),
    parseLiteral(ast) {
        if (ast.kind !== graphql_1.Kind.STRING) {
            throw (0, error_js_1.createGraphQLError)(`Can only validate strings as URLs but got a: ${ast.kind}`, {
                nodes: ast,
            });
        }
        if (ast.value === null) {
            return ast.value;
        }
        else {
            return new URL(ast.value.toString());
        }
    },
    extensions: {
        codegenScalarType: 'URL | string',
        jsonSchema: {
            type: 'string',
            format: 'uri',
        },
    },
});
