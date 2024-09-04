"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLNegativeFloat = void 0;
const graphql_1 = require("graphql");
const error_js_1 = require("../error.js");
const utilities_js_1 = require("./utilities.js");
exports.GraphQLNegativeFloat = new graphql_1.GraphQLScalarType({
    name: 'NegativeFloat',
    description: 'Floats that will have a value less than 0.',
    serialize(value) {
        return (0, utilities_js_1.processValue)(value, 'NegativeFloat');
    },
    parseValue(value) {
        return (0, utilities_js_1.processValue)(value, 'NegativeFloat');
    },
    parseLiteral(ast) {
        if (ast.kind !== graphql_1.Kind.FLOAT && ast.kind !== graphql_1.Kind.INT) {
            throw (0, error_js_1.createGraphQLError)(`Can only validate floating point numbers as negative floating point numbers but got a: ${ast.kind}`, { nodes: ast });
        }
        return (0, utilities_js_1.processValue)(ast.value, 'NegativeFloat');
    },
    extensions: {
        codegenScalarType: 'number',
        jsonSchema: {
            title: 'NegativeFloat',
            type: 'number',
            maximum: 0,
        },
    },
});
