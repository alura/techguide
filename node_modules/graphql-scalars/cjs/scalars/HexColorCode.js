"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLHexColorCode = exports.GraphQLHexColorCodeConfig = void 0;
const graphql_1 = require("graphql");
const error_js_1 = require("../error.js");
const HEX_COLOR_CODE = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3}|[A-Fa-f0-9]{8})$/;
const validate = (value, ast) => {
    if (typeof value !== 'string') {
        throw (0, error_js_1.createGraphQLError)(`Value is not string: ${value}`, ast ? { nodes: ast } : undefined);
    }
    if (!HEX_COLOR_CODE.test(value)) {
        throw (0, error_js_1.createGraphQLError)(`Value is not a valid HexColorCode: ${value}`, ast ? { nodes: ast } : undefined);
    }
    return value;
};
const specifiedByURL = 'https://en.wikipedia.org/wiki/Web_colors';
exports.GraphQLHexColorCodeConfig = {
    name: `HexColorCode`,
    description: `A field whose value is a hex color code: https://en.wikipedia.org/wiki/Web_colors.`,
    serialize(value) {
        return validate(value);
    },
    parseValue(value) {
        return validate(value);
    },
    parseLiteral(ast) {
        if (ast.kind !== graphql_1.Kind.STRING) {
            throw (0, error_js_1.createGraphQLError)(`Can only validate strings as hex color codes but got a: ${ast.kind}`, { nodes: ast });
        }
        return validate(ast.value, ast);
    },
    specifiedByURL,
    specifiedByUrl: specifiedByURL,
    extensions: {
        codegenScalarType: 'string',
        jsonSchema: {
            title: 'HexColorCode',
            type: 'string',
            pattern: HEX_COLOR_CODE.source,
        },
    },
};
exports.GraphQLHexColorCode = new graphql_1.GraphQLScalarType(exports.GraphQLHexColorCodeConfig);
