"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.printWithReducedWhitespace = void 0;
const graphql_1 = require("graphql");
function printWithReducedWhitespace(ast) {
    const sanitizedAST = (0, graphql_1.visit)(ast, {
        StringValue(node) {
            return {
                ...node,
                value: Buffer.from(node.value, "utf8").toString("hex"),
                block: false,
            };
        },
    });
    const withWhitespace = (0, graphql_1.print)(sanitizedAST);
    const minimizedButStillHex = withWhitespace
        .replace(/\s+/g, " ")
        .replace(/([^_a-zA-Z0-9]) /g, (_, c) => c)
        .replace(/ ([^_a-zA-Z0-9])/g, (_, c) => c);
    return minimizedButStillHex.replace(/"([a-f0-9]+)"/g, (_, hex) => JSON.stringify(Buffer.from(hex, "hex").toString("utf8")));
}
exports.printWithReducedWhitespace = printWithReducedWhitespace;
//# sourceMappingURL=index.js.map