import { GraphQLScalarType, Kind } from 'graphql';
import { createGraphQLError } from '../error.js';
const ISBN_REGEX_ARR = [
    /^(?:ISBN(?:-10)?:? *)?((?=\d{1,5}([ -]?)\d{1,7}\2?\d{1,6}\2?\d)(?:\d\2*){9}[\dX])$/i,
    /^(?:ISBN(?:-13)?:? *)?(97(?:8|9)([ -]?)(?=\d{1,5}\2?\d{1,7}\2?\d{1,6}\2?\d)(?:\d\2*){9}\d)$/i,
];
const validate = (value, ast) => {
    if (typeof value !== 'string') {
        throw createGraphQLError(`Value is not string: ${value}`, ast ? { nodes: ast } : undefined);
    }
    let valid = false;
    for (const regex of ISBN_REGEX_ARR) {
        if (regex.test(value)) {
            valid = true;
            break;
        }
    }
    if (!valid) {
        throw createGraphQLError(`Value is not a valid ISBN number: ${value}`, ast ? { nodes: ast } : undefined);
    }
    return value;
};
export const GraphQLISBN = /*#__PURE__*/ new GraphQLScalarType({
    name: `ISBN`,
    description: `A field whose value is a ISBN-10 or ISBN-13 number: https://en.wikipedia.org/wiki/International_Standard_Book_Number.`,
    serialize(value) {
        return validate(value);
    },
    parseValue(value) {
        return validate(value);
    },
    parseLiteral(ast) {
        if (ast.kind !== Kind.STRING) {
            throw createGraphQLError(`Can only validate strings as ISBN numbers but got a: ${ast.kind}`, {
                nodes: ast,
            });
        }
        return validate(ast.value, ast);
    },
    extensions: {
        codegenScalarType: 'string',
        jsonSchema: {
            title: 'ISBN',
            oneOf: ISBN_REGEX_ARR.map(regex => ({
                type: 'string',
                pattern: regex.source,
            })),
        },
    },
});
