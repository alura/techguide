"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLSafeInt = exports.GraphQLSafeIntConfig = void 0;
// Based on https://github.com/stems/graphql-bigint/
const graphql_1 = require("graphql");
const error_js_1 = require("../error.js");
const utilities_js_1 = require("./utilities.js");
const specifiedByURL = 'https://www.ecma-international.org/ecma-262/#sec-number.issafeinteger';
exports.GraphQLSafeIntConfig = {
    name: 'SafeInt',
    description: 'The `SafeInt` scalar type represents non-fractional signed whole numeric values that are ' +
        'considered safe as defined by the ECMAScript specification.',
    specifiedByURL,
    specifiedByUrl: specifiedByURL,
    serialize(outputValue) {
        const coercedValue = (0, utilities_js_1.serializeObject)(outputValue);
        if (typeof coercedValue === 'boolean') {
            return coercedValue ? 1 : 0;
        }
        let num = coercedValue;
        if (typeof coercedValue === 'string' && coercedValue !== '') {
            num = Number(coercedValue);
        }
        if (typeof num !== 'number' || !Number.isInteger(num)) {
            throw (0, error_js_1.createGraphQLError)(`SafeInt cannot represent non-integer value: ${coercedValue}`);
        }
        if (!Number.isSafeInteger(num)) {
            throw (0, error_js_1.createGraphQLError)('SafeInt cannot represent unsafe integer value: ' + coercedValue);
        }
        return num;
    },
    parseValue(inputValue) {
        if (typeof inputValue !== 'number' || !Number.isInteger(inputValue)) {
            throw (0, error_js_1.createGraphQLError)(`SafeInt cannot represent non-integer value: ${inputValue}`);
        }
        if (!Number.isSafeInteger(inputValue)) {
            throw (0, error_js_1.createGraphQLError)(`SafeInt cannot represent unsafe integer value: ${inputValue}`);
        }
        return inputValue;
    },
    parseLiteral(valueNode) {
        if (valueNode.kind !== graphql_1.Kind.INT) {
            throw (0, error_js_1.createGraphQLError)(`SafeInt cannot represent non-integer value: ${(0, graphql_1.print)(valueNode)}`, {
                nodes: valueNode,
            });
        }
        const num = parseInt(valueNode.value, 10);
        if (!Number.isSafeInteger(num)) {
            throw (0, error_js_1.createGraphQLError)(`SafeInt cannot represent unsafe integer value: ${valueNode.value}`, {
                nodes: valueNode,
            });
        }
        return num;
    },
    extensions: {
        codegenScalarType: 'number',
        jsonSchema: {
            title: 'SafeInt',
            type: 'integer',
            minimum: Number.MIN_SAFE_INTEGER,
            maximum: Number.MAX_SAFE_INTEGER,
        },
    },
};
exports.GraphQLSafeInt = new graphql_1.GraphQLScalarType(exports.GraphQLSafeIntConfig);
