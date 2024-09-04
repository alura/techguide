"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLUnsignedInt = void 0;
const graphql_1 = require("graphql");
const NonNegativeInt_js_1 = require("./NonNegativeInt.js");
const GraphQLUnsignedIntConfig = /*#__PURE__*/ Object.assign({}, NonNegativeInt_js_1.GraphQLNonNegativeIntConfig, {
    name: 'UnsignedInt',
});
exports.GraphQLUnsignedInt = new graphql_1.GraphQLScalarType(GraphQLUnsignedIntConfig);
