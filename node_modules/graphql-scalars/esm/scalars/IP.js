import { GraphQLScalarType, Kind } from 'graphql';
import { createGraphQLError } from '../error.js';
import { IPV4_REGEX } from './IPv4.js';
import { IPV6_REGEX } from './IPv6.js';
const validate = (value, ast) => {
    if (typeof value !== 'string') {
        throw createGraphQLError(`Value is not string: ${value}`, ast ? { nodes: ast } : undefined);
    }
    if (!IPV4_REGEX.test(value) && !IPV6_REGEX.test(value)) {
        throw createGraphQLError(`Value is not a valid IPv4 or IPv6 address: ${value}`, ast ? { nodes: ast } : undefined);
    }
    return value;
};
export const GraphQLIP = /*#__PURE__*/ new GraphQLScalarType({
    name: `IP`,
    description: `A field whose value is either an IPv4 or IPv6 address: https://en.wikipedia.org/wiki/IP_address.`,
    serialize(value) {
        return validate(value);
    },
    parseValue(value) {
        return validate(value);
    },
    parseLiteral(ast) {
        if (ast.kind !== Kind.STRING) {
            throw createGraphQLError(`Can only validate strings as IP addresses but got a: ${ast.kind}`, {
                nodes: ast,
            });
        }
        return validate(ast.value, ast);
    },
    extensions: {
        codegenScalarType: 'string',
        jsonSchema: {
            title: 'IP',
            oneOf: [
                {
                    type: 'string',
                    format: 'ipv4',
                },
                {
                    type: 'string',
                    format: 'ipv6',
                },
            ],
        },
    },
});
