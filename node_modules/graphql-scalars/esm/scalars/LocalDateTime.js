import { GraphQLScalarType, Kind } from 'graphql';
import { createGraphQLError } from '../error.js';
const LOCAL_DATE_TIME_REGEX = /^((?:(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2}:\d{2}(?:\.\d+)?))(Z|[\+-]\d{2}:\d{2})?)$/;
function validateLocalDateTime(value, ast) {
    if (typeof value !== 'string') {
        throw createGraphQLError(`Value is not string: ${value}`, ast
            ? {
                nodes: [ast],
            }
            : undefined);
    }
    if (!LOCAL_DATE_TIME_REGEX.test(value.toUpperCase())) {
        throw createGraphQLError(`LocalDateTime cannot represent an invalid local date-time-string ${value}.`, ast
            ? {
                nodes: [ast],
            }
            : undefined);
    }
    const valueAsDate = new Date(value);
    const isValidDate = !isNaN(valueAsDate.getTime());
    if (!isValidDate) {
        throw createGraphQLError(`Value is not a valid LocalDateTime: ${value}`, ast
            ? {
                nodes: [ast],
            }
            : undefined);
    }
    return value;
}
export const LocalDateTimeConfig = /*#__PURE__*/ {
    name: 'LocalDateTime',
    description: 'A local date-time string (i.e., with no associated timezone) in `YYYY-MM-DDTHH:mm:ss` format, e.g. `2020-01-01T00:00:00`.',
    serialize(value) {
        return validateLocalDateTime(value);
    },
    parseValue(value) {
        return validateLocalDateTime(value);
    },
    parseLiteral(ast) {
        if (ast.kind !== Kind.STRING) {
            throw createGraphQLError(`Can only validate strings as local date-times but got a: ${ast.kind}`, {
                nodes: [ast],
            });
        }
        return validateLocalDateTime(ast.value, ast);
    },
    extensions: {
        codegenScalarType: 
        // eslint-disable-next-line no-template-curly-in-string
        '`${number}${number}${number}${number}-${number}${number}-${number}${number}T${number}${number}:${number}${number}:${number}${number}`',
        jsonSchema: {
            title: 'LocalDateTime',
            type: 'string',
            format: 'date-time',
        },
    },
};
export const GraphQLLocalDateTime = /*#__PURE__*/ new GraphQLScalarType(LocalDateTimeConfig);
