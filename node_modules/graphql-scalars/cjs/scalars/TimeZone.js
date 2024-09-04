"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLTimeZone = void 0;
const graphql_1 = require("graphql");
const error_js_1 = require("../error.js");
const validateTimeZone = (str, ast) => {
    if (!(Intl === null || Intl === void 0 ? void 0 : Intl.DateTimeFormat().resolvedOptions().timeZone)) {
        throw (0, error_js_1.createGraphQLError)('Time zones are not available in this environment', ast
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
            throw (0, error_js_1.createGraphQLError)(`Value is not a valid IANA time zone: ${str}`, ast
                ? {
                    nodes: ast,
                }
                : undefined);
        }
        else {
            throw (0, error_js_1.createGraphQLError)('Could not validate time zone.', ast
                ? {
                    nodes: ast,
                }
                : undefined);
        }
    }
};
exports.GraphQLTimeZone = new graphql_1.GraphQLScalarType({
    name: 'TimeZone',
    description: 'A field whose value exists in the standard IANA Time Zone Database: https://www.iana.org/time-zones',
    serialize: validateTimeZone,
    parseValue: validateTimeZone,
    parseLiteral(ast) {
        if (ast.kind !== graphql_1.Kind.STRING) {
            throw (0, error_js_1.createGraphQLError)(`Can only sanitize time zone strings, but got: ${ast.kind}`);
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
