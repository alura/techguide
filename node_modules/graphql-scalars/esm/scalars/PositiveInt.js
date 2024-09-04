import { GraphQLScalarType, Kind } from 'graphql';
import { createGraphQLError } from '../error.js';
import { processValue } from './utilities.js';
export const GraphQLPositiveInt = /*#__PURE__*/ new GraphQLScalarType({
    name: 'PositiveInt',
    description: 'Integers that will have a value greater than 0.',
    serialize(value) {
        return processValue(value, 'PositiveInt');
    },
    parseValue(value) {
        return processValue(value, 'PositiveInt');
    },
    parseLiteral(ast) {
        if (ast.kind !== Kind.INT) {
            throw createGraphQLError(`Can only validate integers as positive integers but got a: ${ast.kind}`, {
                nodes: ast,
            });
        }
        return processValue(ast.value, 'PositiveInt');
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
