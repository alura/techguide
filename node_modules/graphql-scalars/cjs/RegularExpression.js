"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegularExpression = void 0;
const graphql_1 = require("graphql");
const error_js_1 = require("./error.js");
class RegularExpression extends graphql_1.GraphQLScalarType {
    constructor(name, regex, options = {}) {
        const errorMessage = options.errorMessage
            ? options.errorMessage
            : (r, v) => `Value does not match ${r}: ${v}`;
        super({
            name,
            description: options.description || `A field whose value matches ${regex}.`,
            serialize(value) {
                if (value != null && !regex.test(value.toString())) {
                    throw (0, error_js_1.createGraphQLError)(errorMessage(regex, value));
                }
                return value;
            },
            parseValue(value) {
                if (value != null && !regex.test(value === null || value === void 0 ? void 0 : value.toString())) {
                    throw (0, error_js_1.createGraphQLError)(errorMessage(regex, value));
                }
                return value;
            },
            parseLiteral(ast) {
                if (ast.kind === graphql_1.Kind.NULL) {
                    return null;
                }
                if (options.stringOnly && ast.kind !== graphql_1.Kind.STRING) {
                    throw (0, error_js_1.createGraphQLError)(`Can only validate strings as ${name} but got a: ${ast.kind}`);
                }
                if (!('value' in ast) || ast.kind === graphql_1.Kind.ENUM) {
                    throw (0, error_js_1.createGraphQLError)(`Can only validate primitive values as ${name} but got a: ${ast.kind}`, {
                        nodes: [ast],
                    });
                }
                if (ast.value != null && !regex.test(ast.value.toString())) {
                    throw (0, error_js_1.createGraphQLError)(errorMessage(regex, ast.value), { nodes: ast });
                }
                return ast.value;
            },
            extensions: {
                codegenScalarType: options.stringOnly ? 'string' : 'string | number | boolean',
            },
        });
    }
}
exports.RegularExpression = RegularExpression;
