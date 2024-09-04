"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLLocalDateTime = exports.LocalDateTimeConfig = void 0;
const graphql_1 = require("graphql");
const error_js_1 = require("../error.js");
const LOCAL_DATE_TIME_REGEX = /^((?:(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2}:\d{2}(?:\.\d+)?))(Z|[\+-]\d{2}:\d{2})?)$/;
function validateLocalDateTime(value, ast) {
    if (typeof value !== 'string') {
        throw (0, error_js_1.createGraphQLError)(`Value is not string: ${value}`, ast
            ? {
                nodes: [ast],
            }
            : undefined);
    }
    if (!LOCAL_DATE_TIME_REGEX.test(value.toUpperCase())) {
        throw (0, error_js_1.createGraphQLError)(`LocalDateTime cannot represent an invalid local date-time-string ${value}.`, ast
            ? {
                nodes: [ast],
            }
            : undefined);
    }
    const valueAsDate = new Date(value);
    const isValidDate = !isNaN(valueAsDate.getTime());
    if (!isValidDate) {
        throw (0, error_js_1.createGraphQLError)(`Value is not a valid LocalDateTime: ${value}`, ast
            ? {
                nodes: [ast],
            }
            : undefined);
    }
    return value;
}
exports.LocalDateTimeConfig = {
    name: 'LocalDateTime',
    description: 'A local date-time string (i.e., with no associated timezone) in `YYYY-MM-DDTHH:mm:ss` format, e.g. `2020-01-01T00:00:00`.',
    serialize(value) {
        return validateLocalDateTime(value);
    },
    parseValue(value) {
        return validateLocalDateTime(value);
    },
    parseLiteral(ast) {
        if (ast.kind !== graphql_1.Kind.STRING) {
            throw (0, error_js_1.createGraphQLError)(`Can only validate strings as local date-times but got a: ${ast.kind}`, {
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
exports.GraphQLLocalDateTime = new graphql_1.GraphQLScalarType(exports.LocalDateTimeConfig);
