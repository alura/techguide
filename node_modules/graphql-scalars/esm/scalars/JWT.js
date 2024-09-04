import { GraphQLScalarType, Kind } from 'graphql';
import { createGraphQLError } from '../error.js';
// See https://github.com/auth0/node-jws/blob/master/lib/verify-stream.js#L8
const JWS_REGEX = /^[a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?\.([a-zA-Z0-9\-_]+)?$/;
const validate = (value, ast) => {
    if (typeof value !== 'string') {
        throw createGraphQLError(`Value is not string: ${value}`, ast ? { nodes: ast } : undefined);
    }
    if (!JWS_REGEX.test(value)) {
        throw createGraphQLError(`Value is not a valid JWT: ${value}`, ast ? { nodes: ast } : undefined);
    }
    return value;
};
export const GraphQLJWT = /*#__PURE__*/ new GraphQLScalarType({
    name: `JWT`,
    description: `A field whose value is a JSON Web Token (JWT): https://jwt.io/introduction.`,
    serialize(value) {
        return validate(value);
    },
    parseValue(value) {
        return validate(value);
    },
    parseLiteral(ast) {
        if (ast.kind !== Kind.STRING) {
            throw createGraphQLError(`Can only validate strings as JWT but got a: ${ast.kind}`, {
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
