import { GraphQLScalarType, Kind } from 'graphql';
import { createGraphQLError } from '../error.js';
const RGB_REGEX = /^rgb\(\s*(-?\d+|-?\d*\.\d+(?=%))(%?)\s*,\s*(-?\d+|-?\d*\.\d+(?=%))(\2)\s*,\s*(-?\d+|-?\d*\.\d+(?=%))(\2)\s*\)$/;
const validate = (value, ast) => {
    if (typeof value !== 'string') {
        throw createGraphQLError(`Value is not string: ${value}`, ast ? { nodes: ast } : undefined);
    }
    if (!RGB_REGEX.test(value)) {
        throw createGraphQLError(`Value is not a valid RGB color: ${value}`, ast ? { nodes: ast } : undefined);
    }
    return value;
};
export const GraphQLRGB = /*#__PURE__*/ new GraphQLScalarType({
    name: `RGB`,
    description: `A field whose value is a CSS RGB color: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#rgb()_and_rgba().`,
    serialize(value) {
        return validate(value);
    },
    parseValue(value) {
        return validate(value);
    },
    parseLiteral(ast) {
        if (ast.kind !== Kind.STRING) {
            throw createGraphQLError(`Can only validate strings as RGB colors but got a: ${ast.kind}`, {
                nodes: ast,
            });
        }
        return validate(ast.value, ast);
    },
    extensions: {
        codegenScalarType: 'string',
        jsonSchema: {
            title: 'RGB',
            type: 'string',
            pattern: RGB_REGEX.source,
        },
    },
});
