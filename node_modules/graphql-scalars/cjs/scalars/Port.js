"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLPort = void 0;
const graphql_1 = require("graphql");
const error_js_1 = require("../error.js");
const validate = (value, ast) => {
    const parsed = typeof value === 'string' ? parseInt(value, 10) : value;
    if (typeof parsed !== 'number' || Number.isNaN(parsed)) {
        throw (0, error_js_1.createGraphQLError)(`Value is not a number: ${value}`, ast ? { nodes: ast } : undefined);
    }
    if (parsed === Infinity || parsed === -Infinity) {
        throw (0, error_js_1.createGraphQLError)(`Value is not a finite number: ${value}`, ast ? { nodes: ast } : undefined);
    }
    if (parsed <= 0 || parsed > 65535) {
        throw (0, error_js_1.createGraphQLError)(`Value is not a valid TCP port: ${value}`, ast ? { nodes: ast } : undefined);
    }
    return parsed;
};
exports.GraphQLPort = new graphql_1.GraphQLScalarType({
    name: `Port`,
    description: `A field whose value is a valid TCP port within the range of 0 to 65535: https://en.wikipedia.org/wiki/Transmission_Control_Protocol#TCP_ports`,
    serialize(value) {
        return validate(value);
    },
    parseValue(value) {
        return validate(value);
    },
    parseLiteral(ast) {
        if (ast.kind !== graphql_1.Kind.INT) {
            throw (0, error_js_1.createGraphQLError)(`Can only validate integers as TCP ports but got a: ${ast.kind}`, {
                nodes: ast,
            });
        }
        return validate(ast.value, ast);
    },
    extensions: {
        codegenScalarType: 'string | number',
        jsonSchema: {
            title: 'Port',
            type: 'integer',
            minimum: 0,
            maximum: 65535,
        },
    },
});
