"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLNonNegativeFloat = exports.GraphQLNonNegativeFloatConfig = void 0;
const graphql_1 = require("graphql");
const error_js_1 = require("../error.js");
const utilities_js_1 = require("./utilities.js");
exports.GraphQLNonNegativeFloatConfig = {
    name: 'NonNegativeFloat',
    description: 'Floats that will have a value of 0 or more.',
    serialize(value) {
        return (0, utilities_js_1.processValue)(value, 'NonNegativeFloat');
    },
    parseValue(value) {
        return (0, utilities_js_1.processValue)(value, 'NonNegativeFloat');
    },
    parseLiteral(ast) {
        if (ast.kind !== graphql_1.Kind.FLOAT && ast.kind !== graphql_1.Kind.INT) {
            throw (0, error_js_1.createGraphQLError)(`Can only validate floating point numbers as non-negative floating point numbers but got a: ${ast.kind}`, { nodes: ast });
        }
        return (0, utilities_js_1.processValue)(ast.value, 'NonNegativeFloat');
    },
    extensions: {
        codegenScalarType: 'number',
        jsonSchema: {
            title: 'NonNegativeFloat',
            type: 'number',
            minimum: 0,
        },
    },
};
exports.GraphQLNonNegativeFloat = new graphql_1.GraphQLScalarType(exports.GraphQLNonNegativeFloatConfig);
