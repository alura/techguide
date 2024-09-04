import { GraphQLScalarType, Kind } from 'graphql';
import { createGraphQLError } from '../error.js';
const validateTimeZone = (str, ast) => {
    if (!(Intl === null || Intl === void 0 ? void 0 : Intl.DateTimeFormat().resolvedOptions().timeZone)) {
        throw createGraphQLError('Time zones are not available in this environment', ast
            ? {
                nodes: ast,
            }
            : undefined);
    }
    try {
        Intl.DateTimeFormat(undefined, { timeZone: str });
        return str;
    }
    catch (ex) {
        if (ex instanceof RangeError) {
            throw createGraphQLError(`Value is not a valid IANA time zone: ${str}`, ast
                ? {
                    nodes: ast,
                }
                : undefined);
        }
        else {
            throw createGraphQLError('Could not validate time zone.', ast
                ? {
                    nodes: ast,
                }
                : undefined);
        }
    }
};
export const GraphQLTimeZone = /*#__PURE__*/ new GraphQLScalarType({
    name: 'TimeZone',
    description: 'A field whose value exists in the standard IANA Time Zone Database: https://www.iana.org/time-zones',
    serialize: validateTimeZone,
    parseValue: validateTimeZone,
    parseLiteral(ast) {
        if (ast.kind !== Kind.STRING) {
            throw createGraphQLError(`Can only sanitize time zone strings, but got: ${ast.kind}`);
        }
        return validateTimeZone(ast.value);
    },
    extensions: {
        codegenScalarType: 'string',
        jsonSchema: {
            title: 'TimeZone',
            type: 'string',
            pattern: '^(?:[A-Za-z0-9_]|(?:%[0-9A-Fa-f]{2}))+',
        },
    },
});
