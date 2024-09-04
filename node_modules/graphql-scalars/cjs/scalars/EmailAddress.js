"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLEmailAddress = exports.GraphQLEmailAddressConfig = void 0;
const graphql_1 = require("graphql");
const error_js_1 = require("../error.js");
const validate = (value, ast) => {
    const EMAIL_ADDRESS_REGEX = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (typeof value !== 'string') {
        throw (0, error_js_1.createGraphQLError)(`Value is not string: ${value}`, { nodes: ast });
    }
    if (!EMAIL_ADDRESS_REGEX.test(value)) {
        throw (0, error_js_1.createGraphQLError)(`Value is not a valid email address: ${value}`, { nodes: ast });
    }
    return value;
};
const specifiedByURL = 'https://html.spec.whatwg.org/multipage/input.html#valid-e-mail-address';
exports.GraphQLEmailAddressConfig = {
    name: 'EmailAddress',
    description: 'A field whose value conforms to the standard internet email address format as specified in HTML Spec: https://html.spec.whatwg.org/multipage/input.html#valid-e-mail-address.',
    serialize: validate,
    parseValue: validate,
    parseLiteral(ast) {
        if (ast.kind !== graphql_1.Kind.STRING) {
            throw (0, error_js_1.createGraphQLError)(`Can only validate strings as email addresses but got a: ${ast.kind}`, { nodes: ast });
        }
        return validate(ast.value, ast);
    },
    specifiedByURL,
    specifiedByUrl: specifiedByURL,
    extensions: {
        codegenScalarType: 'string',
        jsonSchema: {
            type: 'string',
            format: 'email',
        },
    },
};
exports.GraphQLEmailAddress = new graphql_1.GraphQLScalarType(exports.GraphQLEmailAddressConfig);
