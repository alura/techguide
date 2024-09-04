import { GraphQLScalarType, Kind } from 'graphql';
import { createGraphQLError } from '../error.js';
import { processValue } from './utilities.js';
export const GraphQLNonNegativeIntConfig = /*#__PURE__*/ {
    name: 'NonNegativeInt',
    description: 'Integers that will have a value of 0 or more.',
    serialize(value) {
        return processValue(value, 'NonNegativeInt');
    },
    parseValue(value) {
        return processValue(value, 'NonNegativeInt');
    },
    parseLiteral(ast) {
        if (ast.kind !== Kind.INT) {
            throw createGraphQLError(`Can only validate integers as non-negative integers but got a: ${ast.kind}`, {
                nodes: ast,
            });
        }
        return processValue(ast.value, 'NonNegativeInt');
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
export const GraphQLNonNegativeInt = /*#__PURE__*/ new GraphQLScalarType(GraphQLNonNegativeIntConfig);
