"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLPhoneNumber = void 0;
const graphql_1 = require("graphql");
const error_js_1 = require("../error.js");
const PHONE_NUMBER_REGEX = /^\+[1-9]\d{6,14}$/;
exports.GraphQLPhoneNumber = new graphql_1.GraphQLScalarType({
    name: 'PhoneNumber',
    description: 'A field whose value conforms to the standard E.164 format as specified in: https://en.wikipedia.org/wiki/E.164. Basically this is +17895551234.',
    serialize(value) {
        if (typeof value !== 'string') {
            throw (0, error_js_1.createGraphQLError)(`Value is not string: ${value}`);
        }
        if (!PHONE_NUMBER_REGEX.test(value)) {
            throw (0, error_js_1.createGraphQLError)(`Value is not a valid phone number of the form +17895551234 (7-15 digits): ${value}`);
        }
        return value;
    },
    parseValue(value) {
        if (typeof value !== 'string') {
            throw (0, error_js_1.createGraphQLError)(`Value is not string: ${value}`);
        }
        if (!PHONE_NUMBER_REGEX.test(value)) {
            throw (0, error_js_1.createGraphQLError)(`Value is not a valid phone number of the form +17895551234 (7-15 digits): ${value}`);
        }
        return value;
    },
    parseLiteral(ast) {
        if (ast.kind !== graphql_1.Kind.STRING) {
            throw (0, error_js_1.createGraphQLError)(`Can only validate strings as phone numbers but got a: ${ast.kind}`, { nodes: ast });
        }
        if (!PHONE_NUMBER_REGEX.test(ast.value)) {
            throw (0, error_js_1.createGraphQLError)(`Value is not a valid phone number of the form +17895551234 (7-15 digits): ${ast.value}`, { nodes: ast });
        }
        return ast.value;
    },
    extensions: {
        codegenScalarType: 'string',
        jsonSchema: {
            title: 'PhoneNumber',
            type: 'string',
            pattern: PHONE_NUMBER_REGEX.source,
        },
    },
});
