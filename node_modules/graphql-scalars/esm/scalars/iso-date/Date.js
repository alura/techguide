/**
 * Copyright (c) 2017, Dirk-Jan Rutten
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { GraphQLScalarType, Kind } from 'graphql';
import { createGraphQLError } from '../../error.js';
import { parseDate, serializeDate } from './formatter.js';
import { validateDate, validateJSDate } from './validator.js';
export const GraphQLDateConfig = /*#__PURE__*/ {
    name: 'Date',
    description: 'A date string, such as 2007-12-03, compliant with the `full-date` ' +
        'format outlined in section 5.6 of the RFC 3339 profile of the ' +
        'ISO 8601 standard for representation of dates and times using ' +
        'the Gregorian calendar.',
    serialize(value) {
        if (value instanceof Date) {
            if (validateJSDate(value)) {
                return serializeDate(value);
            }
            throw createGraphQLError('Date cannot represent an invalid Date instance');
        }
        else if (typeof value === 'string') {
            if (validateDate(value)) {
                return value;
            }
            throw createGraphQLError(`Date cannot represent an invalid date-string ${value}.`);
        }
        else {
            throw createGraphQLError('Date cannot represent a non string, or non Date type ' + JSON.stringify(value));
        }
    },
    parseValue(value) {
        if (!(typeof value === 'string')) {
            throw createGraphQLError(`Date cannot represent non string type ${JSON.stringify(value)}`);
        }
        if (validateDate(value)) {
            return parseDate(value);
        }
        throw createGraphQLError(`Date cannot represent an invalid date-string ${value}.`);
    },
    parseLiteral(ast) {
        if (ast.kind !== Kind.STRING) {
            throw createGraphQLError(`Date cannot represent non string type ${'value' in ast && ast.value}`, { nodes: ast });
        }
        const { value } = ast;
        if (validateDate(value)) {
            return parseDate(value);
        }
        throw createGraphQLError(`Date cannot represent an invalid date-string ${String(value)}.`, {
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
export const GraphQLDate = /*#__PURE__*/ new GraphQLScalarType(GraphQLDateConfig);
