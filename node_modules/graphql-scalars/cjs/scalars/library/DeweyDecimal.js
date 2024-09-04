"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLDeweyDecimal = exports.GraphQLDeweyDecimalConfig = void 0;
const graphql_1 = require("graphql");
const error_js_1 = require("../../error.js");
const DEWEY_DECIMAL_REGEX = /^[0-9]{1,3}(?:\.[0-9]+)?$/;
const validate = (value, ast) => {
    if (typeof value !== 'string') {
        throw (0, error_js_1.createGraphQLError)(`Value is not string: ${value}`, { nodes: ast });
    }
    if (!DEWEY_DECIMAL_REGEX.test(value)) {
        throw (0, error_js_1.createGraphQLError)(`Value is not a valid Dewey Decimal Number: ${value}`, { nodes: ast });
    }
    return value;
};
const specifiedByURL = 'https://www.oclc.org/content/dam/oclc/dewey/resources/summaries/deweysummaries.pdf';
exports.GraphQLDeweyDecimalConfig = {
    name: 'DeweyDecimal',
    description: `A field whose value conforms to the standard DeweyDecimal format as specified by the OCLC https://www.oclc.org/content/dam/oclc/dewey/resources/summaries/deweysummaries.pdf`,
    serialize: validate,
    parseValue: validate,
    parseLiteral(ast) {
        if (ast.kind !== graphql_1.Kind.STRING) {
            throw (0, error_js_1.createGraphQLError)(`Can only validate strings as DeweyDecimal but got a: ${ast.kind}`, {
                nodes: ast,
            });
        }
        return validate(ast.value, ast);
    },
    specifiedByURL,
    specifiedByUrl: specifiedByURL,
    extensions: {
        codegenScalarType: 'string',
        jsonSchema: {
            title: 'DeweyDecimal',
            type: 'string',
            pattern: DEWEY_DECIMAL_REGEX.source,
        },
    },
};
exports.GraphQLDeweyDecimal = new graphql_1.GraphQLScalarType(exports.GraphQLDeweyDecimalConfig);
