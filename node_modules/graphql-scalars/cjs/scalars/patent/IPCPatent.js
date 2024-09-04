"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLIPCPatent = exports.GraphQLIPCPatentConfig = void 0;
const graphql_1 = require("graphql");
const error_js_1 = require("../../error.js");
/* 1. [A-H] represents the Section Level of the Classification
   2. \d{2} represents the class level
   3. [A-Z] represents the subclass level
   4. \/ separates the subclass from the subgroup
   5. \d{2,4} represents the subgroup level
      (Only four levels of subgroup, as far as I know)
*/
const IPC_PATENT_REGEX = /^[A-H]\d{2}[A-Z] \d{1,2}\/\d{2,4}$/;
const validate = (value, ast) => {
    if (typeof value !== 'string') {
        throw (0, error_js_1.createGraphQLError)(`Value is not string: ${value}`, { nodes: ast });
    }
    if (!IPC_PATENT_REGEX.test(value)) {
        throw (0, error_js_1.createGraphQLError)(`Value is not a valid IPC Class Symbol: ${value}`, { nodes: ast });
    }
    return value;
};
const specifiedByURL = 'https://www.wipo.int/classifications/ipc/en/';
exports.GraphQLIPCPatentConfig = {
    name: 'IPCPatent',
    description: `A field whose value is an IPC Class Symbol within the International Patent Classification System: https://www.wipo.int/classifications/ipc/en/`,
    serialize: validate,
    parseValue: validate,
    parseLiteral(ast) {
        if (ast.kind !== graphql_1.Kind.STRING) {
            throw (0, error_js_1.createGraphQLError)(`Can only validate strings as an IPC Class Symbol but got a: ${ast.kind}`, {
                nodes: ast,
            });
        }
        return validate(ast.value, ast);
    },
    specifiedByURL,
    specifiedByUrl: specifiedByURL,
    extensions: {
        codegenScalarType: 'string',
        jsonSchema: {
            title: 'DeweyDecimal',
            type: 'string',
            pattern: IPC_PATENT_REGEX.source,
        },
    },
};
exports.GraphQLIPCPatent = new graphql_1.GraphQLScalarType(exports.GraphQLIPCPatentConfig);
