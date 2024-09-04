import { GraphQLScalarType, Kind } from 'graphql';
import { createGraphQLError } from '../error.js';
const UTC_OFFSET_REGEX = /^([+-]?)(\d{2}):(\d{2})$/;
const validate = (value, ast) => {
    if (typeof value !== 'string') {
        throw createGraphQLError(`Value is not string: ${value}`, ast ? { nodes: ast } : undefined);
    }
    if (!UTC_OFFSET_REGEX.test(value)) {
        throw createGraphQLError(`Value is not a valid UTC Offset: ${value}`, ast ? { nodes: ast } : undefined);
    }
    return value;
};
export const GraphQLUtcOffset = /*#__PURE__*/ new GraphQLScalarType({
    name: 'UtcOffset',
    description: 'A field whose value is a UTC Offset: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones',
    serialize: validate,
    parseValue: validate,
    parseLiteral(ast) {
        if (ast.kind !== Kind.STRING) {
            throw createGraphQLError(`Can only validate strings as UTC Offset but got a: ${ast.kind}`, {
                nodes: ast,
            });
        }
        return validate(ast.value, ast);
    },
    extensions: {
        codegenScalarType: 'string',
        jsonSchema: {
            title: 'UtcOffset',
            type: 'string',
            pattern: UTC_OFFSET_REGEX.source,
        },
    },
});
