"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLVoid = void 0;
const graphql_1 = require("graphql");
exports.GraphQLVoid = new graphql_1.GraphQLScalarType({
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
