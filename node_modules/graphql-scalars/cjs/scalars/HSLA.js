"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLHSLA = void 0;
const graphql_1 = require("graphql");
const error_js_1 = require("../error.js");
const HSLA_REGEX = /^hsla\(\s*(-?\d+|-?\d*.\d+)\s*,\s*(-?\d+|-?\d*.\d+)%\s*,\s*(-?\d+|-?\d*.\d+)%\s*,\s*(-?\d+|-?\d*.\d+)\s*\)$/;
const validate = (value, ast) => {
    if (typeof value !== 'string') {
        throw (0, error_js_1.createGraphQLError)(`Value is not string: ${value}`, ast ? { nodes: ast } : undefined);
    }
    if (!HSLA_REGEX.test(value)) {
        throw (0, error_js_1.createGraphQLError)(`Value is not a valid HSLA color: ${value}`, ast ? { nodes: ast } : undefined);
    }
    return value;
};
exports.GraphQLHSLA = new graphql_1.GraphQLScalarType({
    name: `HSLA`,
    description: `A field whose value is a CSS HSLA color: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#hsl()_and_hsla().`,
    serialize(value) {
        return validate(value);
    },
    parseValue(value) {
        return validate(value);
    },
    parseLiteral(ast) {
        if (ast.kind !== graphql_1.Kind.STRING) {
            throw (0, error_js_1.createGraphQLError)(`Can only validate strings as HSLA colors but got a: ${ast.kind}`, {
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
