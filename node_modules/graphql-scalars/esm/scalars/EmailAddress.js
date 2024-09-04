import { GraphQLScalarType, Kind } from 'graphql';
import { createGraphQLError } from '../error.js';
const validate = (value, ast) => {
    const EMAIL_ADDRESS_REGEX = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (typeof value !== 'string') {
        throw createGraphQLError(`Value is not string: ${value}`, { nodes: ast });
    }
    if (!EMAIL_ADDRESS_REGEX.test(value)) {
        throw createGraphQLError(`Value is not a valid email address: ${value}`, { nodes: ast });
    }
    return value;
};
const specifiedByURL = 'https://html.spec.whatwg.org/multipage/input.html#valid-e-mail-address';
export const GraphQLEmailAddressConfig = /*#__PURE__*/ {
    name: 'EmailAddress',
    description: 'A field whose value conforms to the standard internet email address format as specified in HTML Spec: https://html.spec.whatwg.org/multipage/input.html#valid-e-mail-address.',
    serialize: validate,
    parseValue: validate,
    parseLiteral(ast) {
        if (ast.kind !== Kind.STRING) {
            throw createGraphQLError(`Can only validate strings as email addresses but got a: ${ast.kind}`, { nodes: ast });
        }
        return validate(ast.value, ast);
    },
    specifiedByURL,
    specifiedByUrl: specifiedByURL,
    extensions: {
        codegenScalarType: 'string',
        jsonSchema: {
            type: 'string',
            format: 'email',
        },
    },
};
export const GraphQLEmailAddress = /*#__PURE__*/ new GraphQLScalarType(GraphQLEmailAddressConfig);
