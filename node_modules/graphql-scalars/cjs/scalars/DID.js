"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLDID = exports.GraphQLDIDConfig = void 0;
const graphql_1 = require("graphql");
const error_js_1 = require("../error.js");
// See: https://www.w3.org/TR/2021/PR-did-core-20210803/#did-syntax
const DID_REGEX = /^did:[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+:[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]*:?[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]*:?[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]*$/;
const validate = (value, ast) => {
    if (typeof value !== 'string') {
        throw (0, error_js_1.createGraphQLError)(`Value is not string: ${value}`, ast ? { nodes: ast } : undefined);
    }
    if (!DID_REGEX.test(value)) {
        throw (0, error_js_1.createGraphQLError)(`Value is not a valid DID: ${value}`, ast ? { nodes: ast } : undefined);
    }
    return value;
};
const specifiedByURL = 'https://www.w3.org/TR/did-core/';
exports.GraphQLDIDConfig = {
    name: 'DID',
    description: 'A field whose value conforms to the standard DID format as specified in did-core: https://www.w3.org/TR/did-core/.',
    serialize: validate,
    parseValue: validate,
    parseLiteral(ast) {
        if (ast.kind !== graphql_1.Kind.STRING) {
            throw (0, error_js_1.createGraphQLError)(`Can only validate strings as DID but got a: ${ast.kind}`, {
                nodes: ast,
            });
        }
        return validate(ast.value, ast);
    },
    specifiedByURL,
    specifiedByUrl: specifiedByURL,
    extensions: {
        codegenScalarType: 'string',
        jsonSchema: {
            title: 'DID',
            type: 'string',
            pattern: DID_REGEX.source,
        },
    },
};
exports.GraphQLDID = new graphql_1.GraphQLScalarType(exports.GraphQLDIDConfig);
