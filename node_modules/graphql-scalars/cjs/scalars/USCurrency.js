"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLUSCurrency = void 0;
// https://github.com/abhiaiyer91/graphql-currency-scalars
const graphql_1 = require("graphql");
const error_js_1 = require("../error.js");
function generateCurrency(value) {
    if (typeof value !== 'number') {
        throw (0, error_js_1.createGraphQLError)(`Currency cannot represent non integer type ${JSON.stringify(value)}`);
    }
    const currencyInCents = parseInt(value.toString(), 10);
    return (currencyInCents / 100).toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
    });
}
function generateCents(value) {
    const digits = value.replace('$', '').replace(',', '');
    const number = parseFloat(digits);
    return number * 100;
}
/**
 * An Currency Scalar.
 *
 * Input:
 *    This scalar takes a currency string as input and
 *    formats it to currency in cents.
 *
 * Output:
 *    This scalar serializes currency in cents to
 *    currency strings.
 */
exports.GraphQLUSCurrency = new graphql_1.GraphQLScalarType({
    name: 'USCurrency',
    description: 'A currency string, such as $21.25',
    serialize: generateCurrency,
    parseValue(value) {
        if (typeof value !== 'string') {
            throw (0, error_js_1.createGraphQLError)(`Currency cannot represent non string type ${JSON.stringify(value)}`);
        }
        return generateCents(value);
    },
    parseLiteral(ast) {
        if (ast.kind === graphql_1.Kind.STRING) {
            if (typeof ast.value === 'string') {
                return generateCents(ast.value);
            }
        }
        throw (0, error_js_1.createGraphQLError)(`Currency cannot represent an invalid currency-string ${JSON.stringify(ast)}.`, {
            nodes: ast,
        });
    },
    extensions: {
        codegenScalarType: 'string',
        jsonSchema: {
            title: 'USCurrency',
            type: 'string',
            pattern: '^\\$[0-9]+(\\.[0-9]{2})?$',
        },
    },
});
