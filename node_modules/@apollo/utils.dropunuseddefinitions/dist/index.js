"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dropUnusedDefinitions = void 0;
const graphql_1 = require("graphql");
function dropUnusedDefinitions(ast, operationName) {
    const separated = (0, graphql_1.separateOperations)(ast)[operationName];
    if (!separated) {
        return ast;
    }
    return separated;
}
exports.dropUnusedDefinitions = dropUnusedDefinitions;
//# sourceMappingURL=index.js.map