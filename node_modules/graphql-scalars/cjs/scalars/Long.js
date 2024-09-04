"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLLong = exports.GraphQLLongConfig = void 0;
const graphql_1 = require("graphql");
const BigInt_js_1 = require("./BigInt.js");
exports.GraphQLLongConfig = Object.assign({}, BigInt_js_1.GraphQLBigIntConfig, {
    name: 'Long',
});
exports.GraphQLLong = new graphql_1.GraphQLScalarType(exports.GraphQLLongConfig);
