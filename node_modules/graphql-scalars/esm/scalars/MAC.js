import { GraphQLScalarType, Kind } from 'graphql';
import { createGraphQLError } from '../error.js';
const MAC_REGEX = /^(?:[0-9A-Fa-f]{2}([:-]?)[0-9A-Fa-f]{2})(?:(?:\1|\.)(?:[0-9A-Fa-f]{2}([:-]?)[0-9A-Fa-f]{2})){2}$/;
const validate = (value, ast) => {
    if (typeof value !== 'string') {
        throw createGraphQLError(`Value is not string: ${value}`, ast ? { nodes: ast } : undefined);
    }
    if (!MAC_REGEX.test(value)) {
        throw createGraphQLError(`Value is not a valid MAC address: ${value}`, ast ? { nodes: ast } : undefined);
    }
    return value;
};
export const GraphQLMAC = /*#__PURE__*/ new GraphQLScalarType({
    name: `MAC`,
    description: `A field whose value is a IEEE 802 48-bit MAC address: https://en.wikipedia.org/wiki/MAC_address.`,
    serialize(value) {
        return validate(value);
    },
    parseValue(value) {
        return validate(value);
    },
    parseLiteral(ast) {
        if (ast.kind !== Kind.STRING) {
            throw createGraphQLError(`Can only validate strings as MAC addresses but got a: ${ast.kind}`, { nodes: ast });
        }
        return validate(ast.value, ast);
    },
    extensions: {
        codegenScalarType: 'string',
        jsonSchema: {
            title: 'MAC',
            type: 'string',
            pattern: MAC_REGEX.source,
        },
    },
});
