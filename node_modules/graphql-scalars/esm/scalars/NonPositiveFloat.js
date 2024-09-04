import { GraphQLScalarType, Kind } from 'graphql';
import { createGraphQLError } from '../error.js';
import { processValue } from './utilities.js';
export const GraphQLNonPositiveFloat = /*#__PURE__*/ new GraphQLScalarType({
    name: 'NonPositiveFloat',
    description: 'Floats that will have a value of 0 or less.',
    serialize(value) {
        return processValue(value, 'NonPositiveFloat');
    },
    parseValue(value) {
        return processValue(value, 'NonPositiveFloat');
    },
    parseLiteral(ast) {
        if (ast.kind !== Kind.FLOAT && ast.kind !== Kind.INT) {
            throw createGraphQLError(`Can only validate floating point numbers as non-positive floating point numbers but got a: ${ast.kind}`, { nodes: ast });
        }
        return processValue(ast.value, 'NonPositiveFloat');
    },
    extensions: {
        codegenScalarType: 'number',
        jsonSchema: {
            title: 'NonPositiveFloat',
            type: 'number',
            maximum: 0,
        },
    },
});
