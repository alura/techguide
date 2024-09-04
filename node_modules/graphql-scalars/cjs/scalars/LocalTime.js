"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLLocalTime = exports.validateLocalTime = exports.LOCAL_TIME_FORMAT = void 0;
const graphql_1 = require("graphql");
const error_js_1 = require("../error.js");
// 24-hour time with optional seconds and milliseconds - `HH:mm[:ss[.SSS]]`
exports.LOCAL_TIME_FORMAT = /^([0-1][0-9]|2[0-3]):([0-5][0-9])(:[0-5][0-9](\.\d{3})?)?$/;
function validateLocalTime(value, ast) {
    if (typeof value !== 'string') {
        throw (0, error_js_1.createGraphQLError)(`Value is not string: ${value}`, ast ? { nodes: ast } : undefined);
    }
    const isValidFormat = exports.LOCAL_TIME_FORMAT.test(value);
    if (!isValidFormat) {
        throw (0, error_js_1.createGraphQLError)(`Value is not a valid LocalTime: ${value}`, ast ? { nodes: ast } : undefined);
    }
    return value;
}
exports.validateLocalTime = validateLocalTime;
exports.GraphQLLocalTime = new graphql_1.GraphQLScalarType({
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
        if (ast.kind !== graphql_1.Kind.STRING) {
            throw (0, error_js_1.createGraphQLError)(`Can only validate strings as local times but got a: ${ast.kind}`, {
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
            pattern: exports.LOCAL_TIME_FORMAT.source,
        },
    },
});
