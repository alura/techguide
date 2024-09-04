import { GraphQLScalarType, Kind } from 'graphql';
import { createGraphQLError } from '../error.js';
const validate = (value, ast) => {
    const UUID_REGEX = /^(\{){0,1}[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}(\}){0,1}$/gi;
    if (typeof value !== 'string') {
        throw createGraphQLError(`Value is not string: ${value}`, ast ? { nodes: ast } : undefined);
    }
    if (value.startsWith('{')) {
        value = value.substring(1, value.length - 1);
    }
    if (!UUID_REGEX.test(value)) {
        throw createGraphQLError(`Value is not a valid UUID: ${value}`, ast ? { nodes: ast } : undefined);
    }
    return value;
};
export const GraphQLUUIDConfig = /*#__PURE__*/ {
    name: `UUID`,
    description: `A field whose value is a generic Universally Unique Identifier: https://en.wikipedia.org/wiki/Universally_unique_identifier.`,
    serialize(value) {
        return validate(value);
    },
    parseValue(value) {
        return validate(value);
    },
    parseLiteral(ast) {
        if (ast.kind !== Kind.STRING) {
            throw createGraphQLError(`Can only validate strings as UUIDs but got a: ${ast.kind}`, {
                nodes: ast,
            });
        }
        return validate(ast.value, ast);
    },
    extensions: {
        codegenScalarType: 'string',
        jsonSchema: {
            type: 'string',
            format: 'uuid',
        },
    },
};
export const GraphQLUUID = /*#__PURE__*/ new GraphQLScalarType(GraphQLUUIDConfig);
