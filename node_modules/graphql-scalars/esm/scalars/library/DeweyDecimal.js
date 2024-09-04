import { GraphQLScalarType, Kind } from 'graphql';
import { createGraphQLError } from '../../error.js';
const DEWEY_DECIMAL_REGEX = /^[0-9]{1,3}(?:\.[0-9]+)?$/;
const validate = (value, ast) => {
    if (typeof value !== 'string') {
        throw createGraphQLError(`Value is not string: ${value}`, { nodes: ast });
    }
    if (!DEWEY_DECIMAL_REGEX.test(value)) {
        throw createGraphQLError(`Value is not a valid Dewey Decimal Number: ${value}`, { nodes: ast });
    }
    return value;
};
const specifiedByURL = 'https://www.oclc.org/content/dam/oclc/dewey/resources/summaries/deweysummaries.pdf';
export const GraphQLDeweyDecimalConfig = {
    name: 'DeweyDecimal',
    description: `A field whose value conforms to the standard DeweyDecimal format as specified by the OCLC https://www.oclc.org/content/dam/oclc/dewey/resources/summaries/deweysummaries.pdf`,
    serialize: validate,
    parseValue: validate,
    parseLiteral(ast) {
        if (ast.kind !== Kind.STRING) {
            throw createGraphQLError(`Can only validate strings as DeweyDecimal but got a: ${ast.kind}`, {
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
export const GraphQLDeweyDecimal = /*#__PURE__*/ new GraphQLScalarType(GraphQLDeweyDecimalConfig);
