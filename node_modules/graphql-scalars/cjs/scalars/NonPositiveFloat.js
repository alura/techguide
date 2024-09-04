"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLNonPositiveFloat = void 0;
const graphql_1 = require("graphql");
const error_js_1 = require("../error.js");
const utilities_js_1 = require("./utilities.js");
exports.GraphQLNonPositiveFloat = new graphql_1.GraphQLScalarType({
    name: 'NonPositiveFloat',
    description: 'Floats that will have a value of 0 or less.',
    serialize(value) {
        return (0, utilities_js_1.processValue)(value, 'NonPositiveFloat');
    },
    parseValue(value) {
        return (0, utilities_js_1.processValue)(value, 'NonPositiveFloat');
    },
    parseLiteral(ast) {
        if (ast.kind !== graphql_1.Kind.FLOAT && ast.kind !== graphql_1.Kind.INT) {
            throw (0, error_js_1.createGraphQLError)(`Can only validate floating point numbers as non-positive floating point numbers but got a: ${ast.kind}`, { nodes: ast });
        }
        return (0, utilities_js_1.processValue)(ast.value, 'NonPositiveFloat');
    },
    extensions: {
        codegenScalarType: 'number',
        jsonSchema: {
            title: 'NonPositiveFloat',
            type: 'number',
            maximum: 0,
        },
    },
});
