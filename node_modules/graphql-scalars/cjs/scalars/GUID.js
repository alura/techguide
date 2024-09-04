"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLGUID = exports.GraphQLGUIDConfig = void 0;
const graphql_1 = require("graphql");
const UUID_js_1 = require("./UUID.js");
exports.GraphQLGUIDConfig = Object.assign({}, UUID_js_1.GraphQLUUIDConfig, {
    name: 'GUID',
});
exports.GraphQLGUID = new graphql_1.GraphQLScalarType(exports.GraphQLGUIDConfig);
