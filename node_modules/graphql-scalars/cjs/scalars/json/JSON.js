"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLJSON = exports.GraphQLJSONConfig = void 0;
// This named export is intended for users of CommonJS. Users of ES modules
const graphql_1 = require("graphql");
const utils_js_1 = require("./utils.js");
const specifiedByURL = 'http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf';
exports.GraphQLJSONConfig = {
    name: 'JSON',
    description: 'The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf).',
    serialize: utils_js_1.identity,
    parseValue: utils_js_1.identity,
    parseLiteral: utils_js_1.parseLiteral,
    specifiedByURL,
    specifiedByUrl: specifiedByURL,
    extensions: {
        codegenScalarType: 'any',
    },
};
exports.GraphQLJSON = new graphql_1.GraphQLScalarType(exports.GraphQLJSONConfig);
