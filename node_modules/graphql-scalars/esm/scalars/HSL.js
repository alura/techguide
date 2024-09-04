import { GraphQLScalarType, Kind } from 'graphql';
import { createGraphQLError } from '../error.js';
const HSL_REGEX = /^hsl\(\s*(-?\d+|-?\d*.\d+)\s*,\s*(-?\d+|-?\d*.\d+)%\s*,\s*(-?\d+|-?\d*.\d+)%\s*\)$/;
const validate = (value, ast) => {
    if (typeof value !== 'string') {
        throw createGraphQLError(`Value is not string: ${value}`, ast ? { nodes: ast } : undefined);
    }
    if (!HSL_REGEX.test(value)) {
        throw createGraphQLError(`Value is not a valid HSL color: ${value}`, ast ? { nodes: ast } : undefined);
    }
    return value;
};
const specifiedByURL = 'https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#hsl()_and_hsla()';
export const GraphQLHSLConfig = /*#__PURE__*/ {
    name: `HSL`,
    description: `A field whose value is a CSS HSL color: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#hsl()_and_hsla().`,
    serialize(value) {
        return validate(value);
    },
    parseValue(value) {
        return validate(value);
    },
    parseLiteral(ast) {
        if (ast.kind !== Kind.STRING) {
            throw createGraphQLError(`Can only validate strings as HSL colors but got a: ${ast.kind}`, {
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
            title: 'HSL',
            type: 'string',
            pattern: HSL_REGEX.source,
        },
    },
};
export const GraphQLHSL = /*#__PURE__*/ new GraphQLScalarType(GraphQLHSLConfig);
