import { GraphQLScalarType, Kind } from 'graphql';
import { createGraphQLError } from '../error.js';
// See: https://www.w3.org/TR/2021/PR-did-core-20210803/#did-syntax
const DID_REGEX = /^did:[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+:[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]*:?[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]*:?[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]*$/;
const validate = (value, ast) => {
    if (typeof value !== 'string') {
        throw createGraphQLError(`Value is not string: ${value}`, ast ? { nodes: ast } : undefined);
    }
    if (!DID_REGEX.test(value)) {
        throw createGraphQLError(`Value is not a valid DID: ${value}`, ast ? { nodes: ast } : undefined);
    }
    return value;
};
const specifiedByURL = 'https://www.w3.org/TR/did-core/';
export const GraphQLDIDConfig = {
    name: 'DID',
    description: 'A field whose value conforms to the standard DID format as specified in did-core: https://www.w3.org/TR/did-core/.',
    serialize: validate,
    parseValue: validate,
    parseLiteral(ast) {
        if (ast.kind !== Kind.STRING) {
            throw createGraphQLError(`Can only validate strings as DID but got a: ${ast.kind}`, {
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
export const GraphQLDID = /*#__PURE__*/ new GraphQLScalarType(GraphQLDIDConfig);
