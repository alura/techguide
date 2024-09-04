"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLJWT = void 0;
const graphql_1 = require("graphql");
const error_js_1 = require("../error.js");
// See https://github.com/auth0/node-jws/blob/master/lib/verify-stream.js#L8
const JWS_REGEX = /^[a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?\.([a-zA-Z0-9\-_]+)?$/;
const validate = (value, ast) => {
    if (typeof value !== 'string') {
        throw (0, error_js_1.createGraphQLError)(`Value is not string: ${value}`, ast ? { nodes: ast } : undefined);
    }
    if (!JWS_REGEX.test(value)) {
        throw (0, error_js_1.createGraphQLError)(`Value is not a valid JWT: ${value}`, ast ? { nodes: ast } : undefined);
    }
    return value;
};
exports.GraphQLJWT = new graphql_1.GraphQLScalarType({
    name: `JWT`,
    description: `A field whose value is a JSON Web Token (JWT): https://jwt.io/introduction.`,
    serialize(value) {
        return validate(value);
    },
    parseValue(value) {
        return validate(value);
    },
    parseLiteral(ast) {
        if (ast.kind !== graphql_1.Kind.STRING) {
            throw (0, error_js_1.createGraphQLError)(`Can only validate strings as JWT but got a: ${ast.kind}`, {
                nodes: ast,
            });
        }
        return validate(ast.value, ast);
    },
    extensions: {
        codegenScalarType: 'string',
        jsonSchema: {
            title: 'JWT',
            type: 'string',
            pattern: JWS_REGEX.source,
        },
    },
});
