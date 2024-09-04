"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLPositiveInt = void 0;
const graphql_1 = require("graphql");
const error_js_1 = require("../error.js");
const utilities_js_1 = require("./utilities.js");
exports.GraphQLPositiveInt = new graphql_1.GraphQLScalarType({
    name: 'PositiveInt',
    description: 'Integers that will have a value greater than 0.',
    serialize(value) {
        return (0, utilities_js_1.processValue)(value, 'PositiveInt');
    },
    parseValue(value) {
        return (0, utilities_js_1.processValue)(value, 'PositiveInt');
    },
    parseLiteral(ast) {
        if (ast.kind !== graphql_1.Kind.INT) {
            throw (0, error_js_1.createGraphQLError)(`Can only validate integers as positive integers but got a: ${ast.kind}`, {
                nodes: ast,
            });
        }
        return (0, utilities_js_1.processValue)(ast.value, 'PositiveInt');
    },
    extensions: {
        codegenScalarType: 'number',
        jsonSchema: {
            title: 'PositiveInt',
            type: 'integer',
            minimum: 1,
        },
    },
});
