import { GraphQLScalarType, Kind } from 'graphql';
import { createGraphQLError } from '../error.js';
const validate = (value, ast) => {
    if (typeof value !== 'string') {
        throw createGraphQLError(`Value is not a string: ${value}`, ast ? { nodes: ast } : undefined);
    }
    if (!value.trim().length) {
        throw createGraphQLError(`Value cannot be an empty string: ${value}`, ast ? { nodes: ast } : undefined);
    }
    return value;
};
export const GraphQLNonEmptyString = /*#__PURE__*/ new GraphQLScalarType({
    name: 'NonEmptyString',
    description: 'A string that cannot be passed as an empty value',
    serialize: validate,
    parseValue: validate,
    parseLiteral(ast) {
        if (ast.kind !== Kind.STRING) {
            throw createGraphQLError(`Can only validate strings but got a: ${ast.kind}`, { nodes: ast });
        }
        return validate(ast.value, ast);
    },
    extensions: {
        codegenScalarType: 'string',
        jsonSchema: {
            title: 'NonEmptyString',
            type: 'string',
            minLength: 1,
        },
    },
});
