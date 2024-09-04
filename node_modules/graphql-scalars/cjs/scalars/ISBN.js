"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLISBN = void 0;
const graphql_1 = require("graphql");
const error_js_1 = require("../error.js");
const ISBN_REGEX_ARR = [
    /^(?:ISBN(?:-10)?:? *)?((?=\d{1,5}([ -]?)\d{1,7}\2?\d{1,6}\2?\d)(?:\d\2*){9}[\dX])$/i,
    /^(?:ISBN(?:-13)?:? *)?(97(?:8|9)([ -]?)(?=\d{1,5}\2?\d{1,7}\2?\d{1,6}\2?\d)(?:\d\2*){9}\d)$/i,
];
const validate = (value, ast) => {
    if (typeof value !== 'string') {
        throw (0, error_js_1.createGraphQLError)(`Value is not string: ${value}`, ast ? { nodes: ast } : undefined);
    }
    let valid = false;
    for (const regex of ISBN_REGEX_ARR) {
        if (regex.test(value)) {
            valid = true;
            break;
        }
    }
    if (!valid) {
        throw (0, error_js_1.createGraphQLError)(`Value is not a valid ISBN number: ${value}`, ast ? { nodes: ast } : undefined);
    }
    return value;
};
exports.GraphQLISBN = new graphql_1.GraphQLScalarType({
    name: `ISBN`,
    description: `A field whose value is a ISBN-10 or ISBN-13 number: https://en.wikipedia.org/wiki/International_Standard_Book_Number.`,
    serialize(value) {
        return validate(value);
    },
    parseValue(value) {
        return validate(value);
    },
    parseLiteral(ast) {
        if (ast.kind !== graphql_1.Kind.STRING) {
            throw (0, error_js_1.createGraphQLError)(`Can only validate strings as ISBN numbers but got a: ${ast.kind}`, {
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
