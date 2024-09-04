"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLRGBA = void 0;
const graphql_1 = require("graphql");
const error_js_1 = require("../error.js");
const RGBA_REGEX = /^rgba\(\s*(-?\d+|-?\d*\.\d+(?=%))(%?)\s*,\s*(-?\d+|-?\d*\.\d+(?=%))(\2)\s*,\s*(-?\d+|-?\d*\.\d+(?=%))(\2)\s*,\s*(-?\d+|-?\d*.\d+)\s*\)$/;
const validate = (value, ast) => {
    if (typeof value !== 'string') {
        throw (0, error_js_1.createGraphQLError)(`Value is not string: ${value}`, ast ? { nodes: ast } : undefined);
    }
    if (!RGBA_REGEX.test(value)) {
        throw (0, error_js_1.createGraphQLError)(`Value is not a valid RGBA color: ${value}`, ast ? { nodes: ast } : undefined);
    }
    return value;
};
exports.GraphQLRGBA = new graphql_1.GraphQLScalarType({
    name: `RGBA`,
    description: `A field whose value is a CSS RGBA color: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#rgb()_and_rgba().`,
    serialize(value) {
        return validate(value);
    },
    parseValue(value) {
        return validate(value);
    },
    parseLiteral(ast) {
        if (ast.kind !== graphql_1.Kind.STRING) {
            throw (0, error_js_1.createGraphQLError)(`Can only validate strings as RGBA colors but got a: ${ast.kind}`, {
                nodes: ast,
            });
        }
        return validate(ast.value, ast);
    },
    extensions: {
        codegenScalarType: 'string',
        jsonSchema: {
            title: 'RGBA',
            type: 'string',
            pattern: RGBA_REGEX.source,
        },
    },
});
