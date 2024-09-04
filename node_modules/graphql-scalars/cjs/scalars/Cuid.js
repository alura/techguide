"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLCuid = exports.GraphQLCuidConfig = void 0;
const graphql_1 = require("graphql");
const error_js_1 = require("../error.js");
const CUID_REGEX = /^c[^\s-]{8,}$/i;
const validate = (value, ast) => {
    if (typeof value !== 'string') {
        throw (0, error_js_1.createGraphQLError)(`Value is not string: ${value}`, ast
            ? {
                nodes: ast,
            }
            : undefined);
    }
    if (!CUID_REGEX.test(value)) {
        throw (0, error_js_1.createGraphQLError)(`Value is not a valid cuid: ${value}`, ast
            ? {
                nodes: ast,
            }
            : undefined);
    }
    return value;
};
const specifiedByURL = 'https://github.com/ericelliott/cuid#broken-down';
exports.GraphQLCuidConfig = {
    name: 'Cuid',
    description: 'A field whose value conforms to the standard cuid format as specified in https://github.com/ericelliott/cuid#broken-down',
    serialize: validate,
    parseValue: validate,
    parseLiteral(ast) {
        if (ast.kind !== graphql_1.Kind.STRING) {
            throw (0, error_js_1.createGraphQLError)(`Can only validate strings as cuids but got a: ${ast.kind}`, {
                nodes: [ast],
            });
        }
        return validate(ast.value, ast);
    },
    specifiedByURL,
    specifiedByUrl: specifiedByURL,
    extensions: {
        codegenScalarType: 'string',
        jsonSchema: {
            title: 'Cuid',
            type: 'string',
            pattern: CUID_REGEX.source,
        },
    },
};
exports.GraphQLCuid = new graphql_1.GraphQLScalarType(exports.GraphQLCuidConfig);
