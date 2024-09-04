import { GraphQLScalarType, Kind } from 'graphql';
import { createGraphQLError } from '../error.js';
import { processValue } from './utilities.js';
export const GraphQLPositiveFloat = /*#__PURE__*/ new GraphQLScalarType({
    name: 'PositiveFloat',
    description: 'Floats that will have a value greater than 0.',
    serialize(value) {
        return processValue(value, 'PositiveFloat');
    },
    parseValue(value) {
        return processValue(value, 'PositiveFloat');
    },
    parseLiteral(ast) {
        if (ast.kind !== Kind.FLOAT && ast.kind !== Kind.INT) {
            throw createGraphQLError(`Can only validate floating point numbers as positive floating point numbers but got a: ${ast.kind}`, { nodes: ast });
        }
        return processValue(ast.value, 'PositiveFloat');
    },
    extensions: {
        codegenScalarType: 'number',
        jsonSchema: {
            title: 'PositiveFloat',
            type: 'number',
            minimum: 0,
        },
    },
});
