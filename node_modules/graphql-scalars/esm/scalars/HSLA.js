import { GraphQLScalarType, Kind } from 'graphql';
import { createGraphQLError } from '../error.js';
const HSLA_REGEX = /^hsla\(\s*(-?\d+|-?\d*.\d+)\s*,\s*(-?\d+|-?\d*.\d+)%\s*,\s*(-?\d+|-?\d*.\d+)%\s*,\s*(-?\d+|-?\d*.\d+)\s*\)$/;
const validate = (value, ast) => {
    if (typeof value !== 'string') {
        throw createGraphQLError(`Value is not string: ${value}`, ast ? { nodes: ast } : undefined);
    }
    if (!HSLA_REGEX.test(value)) {
        throw createGraphQLError(`Value is not a valid HSLA color: ${value}`, ast ? { nodes: ast } : undefined);
    }
    return value;
};
export const GraphQLHSLA = /*#__PURE__*/ new GraphQLScalarType({
    name: `HSLA`,
    description: `A field whose value is a CSS HSLA color: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#hsl()_and_hsla().`,
    serialize(value) {
        return validate(value);
    },
    parseValue(value) {
        return validate(value);
    },
    parseLiteral(ast) {
        if (ast.kind !== Kind.STRING) {
            throw createGraphQLError(`Can only validate strings as HSLA colors but got a: ${ast.kind}`, {
                nodes: ast,
            });
        }
        return validate(ast.value, ast);
    },
    extensions: {
        codegenScalarType: 'string',
        jsonSchema: {
            title: 'HSLA',
            type: 'string',
            pattern: HSLA_REGEX.source,
        },
    },
});
