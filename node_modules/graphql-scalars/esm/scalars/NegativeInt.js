import { GraphQLScalarType, Kind } from 'graphql';
import { createGraphQLError } from '../error.js';
import { processValue } from './utilities.js';
export const GraphQLNegativeInt = /*#__PURE__*/ new GraphQLScalarType({
    name: 'NegativeInt',
    description: 'Integers that will have a value less than 0.',
    serialize(value) {
        return processValue(value, 'NegativeInt');
    },
    parseValue(value) {
        return processValue(value, 'NegativeInt');
    },
    parseLiteral(ast) {
        if (ast.kind !== Kind.INT) {
            throw createGraphQLError(`Can only validate integers as negative integers but got a: ${ast.kind}`, {
                nodes: ast,
            });
        }
        return processValue(ast.value, 'NegativeInt');
    },
    extensions: {
        codegenScalarType: 'number',
        jsonSchema: {
            title: 'NegativeInt',
            type: 'integer',
            maximum: 0,
        },
    },
});
