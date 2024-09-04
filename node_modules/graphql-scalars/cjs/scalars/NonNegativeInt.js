"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLNonNegativeInt = exports.GraphQLNonNegativeIntConfig = void 0;
const graphql_1 = require("graphql");
const error_js_1 = require("../error.js");
const utilities_js_1 = require("./utilities.js");
exports.GraphQLNonNegativeIntConfig = {
    name: 'NonNegativeInt',
    description: 'Integers that will have a value of 0 or more.',
    serialize(value) {
        return (0, utilities_js_1.processValue)(value, 'NonNegativeInt');
    },
    parseValue(value) {
        return (0, utilities_js_1.processValue)(value, 'NonNegativeInt');
    },
    parseLiteral(ast) {
        if (ast.kind !== graphql_1.Kind.INT) {
            throw (0, error_js_1.createGraphQLError)(`Can only validate integers as non-negative integers but got a: ${ast.kind}`, {
                nodes: ast,
            });
        }
        return (0, utilities_js_1.processValue)(ast.value, 'NonNegativeInt');
    },
    extensions: {
        codegenScalarType: 'number',
        jsonSchema: {
            title: 'NonNegativeInt',
            type: 'integer',
            minimum: 0,
        },
    },
};
exports.GraphQLNonNegativeInt = new graphql_1.GraphQLScalarType(exports.GraphQLNonNegativeIntConfig);
