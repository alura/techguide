"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripSensitiveLiterals = void 0;
const graphql_1 = require("graphql");
function stripSensitiveLiterals(ast, options = {
    hideListAndObjectLiterals: false,
}) {
    const listAndObjectVisitorIfEnabled = options.hideListAndObjectLiterals
        ? {
            ListValue(node) {
                return { ...node, values: [] };
            },
            ObjectValue(node) {
                return { ...node, fields: [] };
            },
        }
        : {};
    return (0, graphql_1.visit)(ast, {
        IntValue(node) {
            return { ...node, value: "0" };
        },
        FloatValue(node) {
            return { ...node, value: "0" };
        },
        StringValue(node) {
            return { ...node, value: "", block: false };
        },
        ...listAndObjectVisitorIfEnabled,
    });
}
exports.stripSensitiveLiterals = stripSensitiveLiterals;
//# sourceMappingURL=index.js.map