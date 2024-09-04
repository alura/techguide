"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLDate = exports.GraphQLDateConfig = void 0;
/**
 * Copyright (c) 2017, Dirk-Jan Rutten
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
const graphql_1 = require("graphql");
const error_js_1 = require("../../error.js");
const formatter_js_1 = require("./formatter.js");
const validator_js_1 = require("./validator.js");
exports.GraphQLDateConfig = {
    name: 'Date',
    description: 'A date string, such as 2007-12-03, compliant with the `full-date` ' +
        'format outlined in section 5.6 of the RFC 3339 profile of the ' +
        'ISO 8601 standard for representation of dates and times using ' +
        'the Gregorian calendar.',
    serialize(value) {
        if (value instanceof Date) {
            if ((0, validator_js_1.validateJSDate)(value)) {
                return (0, formatter_js_1.serializeDate)(value);
            }
            throw (0, error_js_1.createGraphQLError)('Date cannot represent an invalid Date instance');
        }
        else if (typeof value === 'string') {
            if ((0, validator_js_1.validateDate)(value)) {
                return value;
            }
            throw (0, error_js_1.createGraphQLError)(`Date cannot represent an invalid date-string ${value}.`);
        }
        else {
            throw (0, error_js_1.createGraphQLError)('Date cannot represent a non string, or non Date type ' + JSON.stringify(value));
        }
    },
    parseValue(value) {
        if (!(typeof value === 'string')) {
            throw (0, error_js_1.createGraphQLError)(`Date cannot represent non string type ${JSON.stringify(value)}`);
        }
        if ((0, validator_js_1.validateDate)(value)) {
            return (0, formatter_js_1.parseDate)(value);
        }
        throw (0, error_js_1.createGraphQLError)(`Date cannot represent an invalid date-string ${value}.`);
    },
    parseLiteral(ast) {
        if (ast.kind !== graphql_1.Kind.STRING) {
            throw (0, error_js_1.createGraphQLError)(`Date cannot represent non string type ${'value' in ast && ast.value}`, { nodes: ast });
        }
        const { value } = ast;
        if ((0, validator_js_1.validateDate)(value)) {
            return (0, formatter_js_1.parseDate)(value);
        }
        throw (0, error_js_1.createGraphQLError)(`Date cannot represent an invalid date-string ${String(value)}.`, {
            nodes: ast,
        });
    },
    extensions: {
        codegenScalarType: 'Date | string',
        jsonSchema: {
            type: 'string',
            format: 'date',
        },
    },
};
/**
 * An RFC 3339 compliant date scalar.
 *
 * Input:
 *    This scalar takes an RFC 3339 date string as input and
 *    parses it to a javascript Date.
 *
 * Output:
 *    This scalar serializes javascript Dates and
 *    RFC 3339 date strings to RFC 3339 date strings.
 */
exports.GraphQLDate = new graphql_1.GraphQLScalarType(exports.GraphQLDateConfig);
