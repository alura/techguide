"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeAliases = void 0;
const graphql_1 = require("graphql");
function removeAliases(ast) {
    return (0, graphql_1.visit)(ast, {
        Field(node) {
            const { alias, ...rest } = node;
            return rest;
        },
    });
}
exports.removeAliases = removeAliases;
//# sourceMappingURL=index.js.map