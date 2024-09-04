"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLJSONObject = exports.GraphQLJSONObjectConfig = void 0;
/* eslint-disable @typescript-eslint/ban-types */
const graphql_1 = require("graphql");
const utils_js_1 = require("./utils.js");
const specifiedByURL = 'http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf';
exports.GraphQLJSONObjectConfig = {
    name: 'JSONObject',
    description: 'The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf).',
    serialize: utils_js_1.ensureObject,
    parseValue: utils_js_1.ensureObject,
    parseLiteral: utils_js_1.parseObject,
    specifiedByURL,
    specifiedByUrl: specifiedByURL,
    extensions: {
        codegenScalarType: 'Record<string, any>',
        jsonSchema: {
            type: 'object',
            additionalProperties: true,
        },
    },
};
exports.GraphQLJSONObject = new graphql_1.GraphQLScalarType(exports.GraphQLJSONObjectConfig);
