"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLAccountNumber = exports.GraphQLAccountNumberConfig = void 0;
const graphql_1 = require("graphql");
const error_js_1 = require("../error.js");
const regexp = /^([a-zA-Z0-9]){5,17}$/;
const validator = rtn => regexp.test(rtn);
const validate = (account, ast) => {
    if (typeof account !== 'string') {
        throw (0, error_js_1.createGraphQLError)('can only parse String', ast
            ? {
                nodes: ast,
            }
            : undefined);
    }
    if (!validator(account)) {
        throw (0, error_js_1.createGraphQLError)('must be alphanumeric between 5-17', ast
            ? {
                nodes: ast,
            }
            : undefined);
    }
    return account;
};
exports.GraphQLAccountNumberConfig = {
    name: 'AccountNumber',
    description: 'Banking account number is a string of 5 to 17 alphanumeric values for ' +
        'representing an generic account number',
    serialize(value) {
        return validate(value);
    },
    parseValue(value) {
        return validate(value);
    },
    parseLiteral(ast) {
        if (ast.kind === graphql_1.Kind.STRING) {
            return validate(ast.value, ast);
        }
        throw (0, error_js_1.createGraphQLError)(`Account Number can only parse String but got '${ast.kind}'`, {
            nodes: [ast],
        });
    },
    extensions: {
        codegenScalarType: 'string',
        jsonSchema: {
            title: 'AccountNumber',
            type: 'string',
            pattern: regexp.source,
        },
    },
};
exports.GraphQLAccountNumber = new graphql_1.GraphQLScalarType(exports.GraphQLAccountNumberConfig);
