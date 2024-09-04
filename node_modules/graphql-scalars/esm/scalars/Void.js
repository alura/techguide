import { GraphQLScalarType } from 'graphql';
export const GraphQLVoid = /*#__PURE__*/ new GraphQLScalarType({
    name: 'Void',
    description: 'Represents NULL values',
    serialize() {
        return '';
    },
    parseValue() {
        return null;
    },
    parseLiteral() {
        return null;
    },
    extensions: {
        codegenScalarType: 'void',
    },
});
