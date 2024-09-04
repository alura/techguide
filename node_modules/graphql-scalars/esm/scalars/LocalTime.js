import { GraphQLScalarType, Kind } from 'graphql';
import { createGraphQLError } from '../error.js';
// 24-hour time with optional seconds and milliseconds - `HH:mm[:ss[.SSS]]`
export const LOCAL_TIME_FORMAT = /^([0-1][0-9]|2[0-3]):([0-5][0-9])(:[0-5][0-9](\.\d{3})?)?$/;
export function validateLocalTime(value, ast) {
    if (typeof value !== 'string') {
        throw createGraphQLError(`Value is not string: ${value}`, ast ? { nodes: ast } : undefined);
    }
    const isValidFormat = LOCAL_TIME_FORMAT.test(value);
    if (!isValidFormat) {
        throw createGraphQLError(`Value is not a valid LocalTime: ${value}`, ast ? { nodes: ast } : undefined);
    }
    return value;
}
export const GraphQLLocalTime = /*#__PURE__*/ new GraphQLScalarType({
    name: 'LocalTime',
    description: 'A local time string (i.e., with no associated timezone) in 24-hr `HH:mm[:ss[.SSS]]` format, e.g. `14:25` or `14:25:06` or `14:25:06.123`.',
    serialize(value) {
        // value sent to client as string
        return validateLocalTime(value);
    },
    parseValue(value) {
        // value from client as json
        return validateLocalTime(value);
    },
    parseLiteral(ast) {
        // value from client in ast
        if (ast.kind !== Kind.STRING) {
            throw createGraphQLError(`Can only validate strings as local times but got a: ${ast.kind}`, {
                nodes: ast,
            });
        }
        return validateLocalTime(ast.value, ast);
    },
    extensions: {
        codegenScalarType: 'string',
        jsonSchema: {
            title: 'LocalTime',
            type: 'string',
            pattern: LOCAL_TIME_FORMAT.source,
        },
    },
});
