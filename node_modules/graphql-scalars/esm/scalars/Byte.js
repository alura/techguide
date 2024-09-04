import { GraphQLScalarType, Kind, print, } from 'graphql';
import { createGraphQLError } from '../error.js';
const base64Validator = /^(?:[A-Za-z0-9+\/]{4})*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=)?$/;
function hexValidator(value) {
    // Ensure that any leading 0 is removed from the hex string to avoid false negatives.
    const sanitizedValue = value.charAt(0) === '0' ? value.slice(1) : value;
    // For larger strings, we run into issues with MAX_SAFE_INTEGER, so split the string
    // into smaller pieces to avoid this issue.
    if (value.length > 8) {
        let parsedString = '';
        for (let startIndex = 0, endIndex = 8; startIndex < value.length; startIndex += 8, endIndex += 8) {
            parsedString += parseInt(value.slice(startIndex, endIndex), 16).toString(16);
        }
        return parsedString === sanitizedValue;
    }
    return parseInt(value, 16).toString(16) === sanitizedValue;
}
function validate(value, ast) {
    if (typeof value !== 'string' && !(value instanceof global.Buffer)) {
        throw createGraphQLError(`Value is not an instance of Buffer: ${JSON.stringify(value)}`, ast
            ? {
                nodes: ast,
            }
            : undefined);
    }
    if (typeof value === 'string') {
        const isBase64 = base64Validator.test(value);
        const isHex = hexValidator(value);
        if (!isBase64 && !isHex) {
            throw createGraphQLError(`Value is not a valid base64 or hex encoded string: ${JSON.stringify(value)}`, ast
                ? {
                    nodes: ast,
                }
                : undefined);
        }
        return global.Buffer.from(value, isHex ? 'hex' : 'base64');
    }
    return value;
}
function parseObject(ast) {
    const key = ast.fields[0].value;
    const value = ast.fields[1].value;
    if (ast.fields.length === 2 &&
        key.kind === Kind.STRING &&
        key.value === 'Buffer' &&
        value.kind === Kind.LIST) {
        return global.Buffer.from(value.values.map((astValue) => parseInt(astValue.value)));
    }
    throw createGraphQLError(`Value is not a JSON representation of Buffer: ${print(ast)}`, {
        nodes: [ast],
    });
}
export const GraphQLByteConfig = 
/*#__PURE__*/ {
    name: 'Byte',
    description: 'The `Byte` scalar type represents byte value as a Buffer',
    serialize: validate,
    parseValue: validate,
    parseLiteral(ast) {
        switch (ast.kind) {
            case Kind.STRING:
                return validate(ast.value, ast);
            case Kind.OBJECT:
                return parseObject(ast);
            default:
                throw createGraphQLError(`Can only parse base64 or hex encoded strings as Byte, but got a: ${ast.kind}`, {
                    nodes: [ast],
                });
        }
    },
    extensions: {
        codegenScalarType: 'Buffer | string',
        jsonSchema: {
            type: 'string',
            format: 'byte',
        },
    },
};
export const GraphQLByte = /*#__PURE__*/ new GraphQLScalarType(GraphQLByteConfig);
