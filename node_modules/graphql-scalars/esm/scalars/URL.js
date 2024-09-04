import { GraphQLScalarType, Kind } from 'graphql';
import { createGraphQLError } from '../error.js';
export const GraphQLURL = /*#__PURE__*/ new GraphQLScalarType({
    name: 'URL',
    description: 'A field whose value conforms to the standard URL format as specified in RFC3986: https://www.ietf.org/rfc/rfc3986.txt.',
    serialize(value) {
        if (value === null) {
            return value;
        }
        return new URL(value.toString()).toString();
    },
    parseValue: value => (value === null ? value : new URL(value.toString())),
    parseLiteral(ast) {
        if (ast.kind !== Kind.STRING) {
            throw createGraphQLError(`Can only validate strings as URLs but got a: ${ast.kind}`, {
                nodes: ast,
            });
        }
        if (ast.value === null) {
            return ast.value;
        }
        else {
            return new URL(ast.value.toString());
        }
    },
    extensions: {
        codegenScalarType: 'URL | string',
        jsonSchema: {
            type: 'string',
            format: 'uri',
        },
    },
});
