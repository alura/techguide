"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLLocale = void 0;
const graphql_1 = require("graphql");
const error_js_1 = require("../error.js");
const BCP_47_REGEX = /^(((en-GB-oed|i-ami|i-bnn|i-default|i-enochian|i-hak|i-klingon|i-lux|i-mingo|i-navajo|i-pwn|i-tao|i-tay|i-tsu|sgn-BE-FR|sgn-BE-NL|sgn-CH-DE)|(art-lojban|cel-gaulish|no-bok|no-nyn|zh-guoyu|zh-hakka|zh-min|zh-min-nan|zh-xiang))|((([A-Za-z]{2,3}(-([A-Za-z]{3}(-[A-Za-z]{3}){0,2}))?)|[A-Za-z]{4}|[A-Za-z]{5,8})(-([A-Za-z]{4}))?(-([A-Za-z]{2}|[0-9]{3}))?(-([A-Za-z0-9]{5,8}|[0-9][A-Za-z0-9]{3}))*(-([0-9A-WY-Za-wy-z](-[A-Za-z0-9]{2,8})+))*(-(x(-[A-Za-z0-9]{1,8})+))?)|(x(-[A-Za-z0-9]{1,8})+))$/;
function validate(value, ast) {
    if (!value) {
        throw (0, error_js_1.createGraphQLError)(`Value is not a valid string. Received: ${value}`, ast ? { nodes: ast } : undefined);
    }
    const isValidFormat = BCP_47_REGEX.test(value);
    if (!isValidFormat) {
        throw (0, error_js_1.createGraphQLError)(`Value is not a valid BCP-47 standard formatted string. Received: ${value}`, ast ? { nodes: ast } : undefined);
    }
    return value;
}
exports.GraphQLLocale = new graphql_1.GraphQLScalarType({
    name: 'Locale',
    description: 'The locale in the format of a BCP 47 (RFC 5646) standard string',
    serialize: validate,
    parseValue: validate,
    parseLiteral(ast) {
        if (ast.kind === graphql_1.Kind.STRING) {
            return validate(ast.value, ast);
        }
        throw (0, error_js_1.createGraphQLError)(`Value is not a string. Received: ${ast.kind}`, { nodes: ast });
    },
    extensions: {
        codegenScalarType: 'string',
        jsonSchema: {
            title: 'Locale',
            type: 'string',
            pattern: BCP_47_REGEX.source,
        },
    },
});
