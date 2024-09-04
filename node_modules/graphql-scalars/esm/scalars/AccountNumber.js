import { GraphQLScalarType, Kind } from 'graphql';
import { createGraphQLError } from '../error.js';
const regexp = /^([a-zA-Z0-9]){5,17}$/;
const validator = rtn => regexp.test(rtn);
const validate = (account, ast) => {
    if (typeof account !== 'string') {
        throw createGraphQLError('can only parse String', ast
            ? {
                nodes: ast,
            }
            : undefined);
    }
    if (!validator(account)) {
        throw createGraphQLError('must be alphanumeric between 5-17', ast
            ? {
                nodes: ast,
            }
            : undefined);
    }
    return account;
};
export const GraphQLAccountNumberConfig = {
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
        if (ast.kind === Kind.STRING) {
            return validate(ast.value, ast);
        }
        throw createGraphQLError(`Account Number can only parse String but got '${ast.kind}'`, {
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
export const GraphQLAccountNumber = /*#__PURE__*/ new GraphQLScalarType(GraphQLAccountNumberConfig);
