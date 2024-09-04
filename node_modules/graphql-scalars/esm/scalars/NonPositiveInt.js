import { GraphQLScalarType, Kind } from 'graphql';
import { createGraphQLError } from '../error.js';
import { processValue } from './utilities.js';
export const GraphQLNonPositiveInt = /*#__PURE__*/ new GraphQLScalarType({
    name: 'NonPositiveInt',
    description: 'Integers that will have a value of 0 or less.',
    serialize(value) {
        return processValue(value, 'NonPositiveInt');
    },
    parseValue(value) {
        return processValue(value, 'NonPositiveInt');
    },
    parseLiteral(ast) {
        if (ast.kind !== Kind.INT) {
            throw createGraphQLError(`Can only validate integers as non-positive integers but got a: ${ast.kind}`, {
                nodes: ast,
            });
        }
        return processValue(ast.value, 'NonPositiveInt');
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
