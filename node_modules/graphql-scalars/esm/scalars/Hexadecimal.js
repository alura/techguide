import { GraphQLScalarType, Kind } from 'graphql';
import { createGraphQLError } from '../error.js';
const HEXADECIMAL_REGEX = /^[a-f0-9]+$/i;
const validate = (value, ast) => {
    if (typeof value !== 'string') {
        throw createGraphQLError(`Value is not string: ${value}`, ast ? { nodes: ast } : undefined);
    }
    if (!HEXADECIMAL_REGEX.test(value)) {
        throw createGraphQLError(`Value is not a valid hexadecimal value: ${value}`, ast ? { nodes: ast } : undefined);
    }
    return value;
};
export const GraphQLHexadecimalConfig = /*#__PURE__*/ {
    name: `Hexadecimal`,
    description: `A field whose value is a hexadecimal: https://en.wikipedia.org/wiki/Hexadecimal.`,
    serialize(value) {
        return validate(value);
    },
    parseValue(value) {
        return validate(value);
    },
    parseLiteral(ast) {
        if (ast.kind !== Kind.STRING) {
            throw createGraphQLError(`Can only validate strings as a hexadecimal but got a: ${ast.kind}`, { nodes: ast });
        }
        return validate(ast.value, ast);
    },
    extensions: {
        codegenScalarType: 'string',
        jsonSchema: {
            title: 'Hexadecimal',
            type: 'string',
            pattern: HEXADECIMAL_REGEX.source,
        },
    },
};
export const GraphQLHexadecimal = /*#__PURE__*/ new GraphQLScalarType(GraphQLHexadecimalConfig);
