"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLUnsignedFloat = void 0;
const graphql_1 = require("graphql");
const NonNegativeFloat_js_1 = require("./NonNegativeFloat.js");
const GraphQLUnsignedFloatConfig = /*#__PURE__*/ Object.assign({}, NonNegativeFloat_js_1.GraphQLNonNegativeFloatConfig, {
    name: 'UnsignedFloat',
});
exports.GraphQLUnsignedFloat = new graphql_1.GraphQLScalarType(GraphQLUnsignedFloatConfig);
