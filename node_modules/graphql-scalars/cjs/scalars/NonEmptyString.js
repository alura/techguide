"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLNonEmptyString = void 0;
const graphql_1 = require("graphql");
const error_js_1 = require("../error.js");
const validate = (value, ast) => {
    if (typeof value !== 'string') {
        throw (0, error_js_1.createGraphQLError)(`Value is not a string: ${value}`, ast ? { nodes: ast } : undefined);
    }
    if (!value.trim().length) {
        throw (0, error_js_1.createGraphQLError)(`Value cannot be an empty string: ${value}`, ast ? { nodes: ast } : undefined);
    }
    return value;
};
exports.GraphQLNonEmptyString = new graphql_1.GraphQLScalarType({
    name: 'NonEmptyString',
    description: 'A string that cannot be passed as an empty value',
    serialize: validate,
    parseValue: validate,
    parseLiteral(ast) {
        if (ast.kind !== graphql_1.Kind.STRING) {
            throw (0, error_js_1.createGraphQLError)(`Can only validate strings but got a: ${ast.kind}`, { nodes: ast });
        }
        return validate(ast.value, ast);
    },
    extensions: {
        codegenScalarType: 'string',
        jsonSchema: {
            title: 'NonEmptyString',
            type: 'string',
            minLength: 1,
        },
    },
});
