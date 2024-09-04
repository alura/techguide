"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLNonPositiveInt = void 0;
const graphql_1 = require("graphql");
const error_js_1 = require("../error.js");
const utilities_js_1 = require("./utilities.js");
exports.GraphQLNonPositiveInt = new graphql_1.GraphQLScalarType({
    name: 'NonPositiveInt',
    description: 'Integers that will have a value of 0 or less.',
    serialize(value) {
        return (0, utilities_js_1.processValue)(value, 'NonPositiveInt');
    },
    parseValue(value) {
        return (0, utilities_js_1.processValue)(value, 'NonPositiveInt');
    },
    parseLiteral(ast) {
        if (ast.kind !== graphql_1.Kind.INT) {
            throw (0, error_js_1.createGraphQLError)(`Can only validate integers as non-positive integers but got a: ${ast.kind}`, {
                nodes: ast,
            });
        }
        return (0, utilities_js_1.processValue)(ast.value, 'NonPositiveInt');
    },
    extensions: {
        codegenScalarType: 'number',
        jsonSchema: {
            title: 'NonPositiveInt',
            type: 'integer',
            maximum: 0,
        },
    },
});
