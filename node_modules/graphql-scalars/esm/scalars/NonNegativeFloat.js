import { GraphQLScalarType, Kind } from 'graphql';
import { createGraphQLError } from '../error.js';
import { processValue } from './utilities.js';
export const GraphQLNonNegativeFloatConfig = /*#__PURE__*/ {
    name: 'NonNegativeFloat',
    description: 'Floats that will have a value of 0 or more.',
    serialize(value) {
        return processValue(value, 'NonNegativeFloat');
    },
    parseValue(value) {
        return processValue(value, 'NonNegativeFloat');
    },
    parseLiteral(ast) {
        if (ast.kind !== Kind.FLOAT && ast.kind !== Kind.INT) {
            throw createGraphQLError(`Can only validate floating point numbers as non-negative floating point numbers but got a: ${ast.kind}`, { nodes: ast });
        }
        return processValue(ast.value, 'NonNegativeFloat');
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
export const GraphQLNonNegativeFloat = /*#__PURE__*/ new GraphQLScalarType(GraphQLNonNegativeFloatConfig);
