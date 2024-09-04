"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortAST = void 0;
const graphql_1 = require("graphql");
const lodash_sortby_1 = __importDefault(require("lodash.sortby"));
function sortAST(ast) {
    return (0, graphql_1.visit)(ast, {
        Document(node) {
            return {
                ...node,
                definitions: (0, lodash_sortby_1.default)(node.definitions, "kind", "name.value"),
            };
        },
        OperationDefinition(node) {
            return sortVariableDefinitions(node);
        },
        SelectionSet(node) {
            return {
                ...node,
                selections: (0, lodash_sortby_1.default)(node.selections, "kind", "name.value"),
            };
        },
        Field(node) {
            return sortArguments(node);
        },
        FragmentSpread(node) {
            return sortDirectives(node);
        },
        InlineFragment(node) {
            return sortDirectives(node);
        },
        FragmentDefinition(node) {
            return sortDirectives(sortVariableDefinitions(node));
        },
        Directive(node) {
            return sortArguments(node);
        },
    });
}
exports.sortAST = sortAST;
function sortDirectives(node) {
    return "directives" in node
        ? { ...node, directives: (0, lodash_sortby_1.default)(node.directives, "name.value") }
        : node;
}
function sortArguments(node) {
    return "arguments" in node
        ? { ...node, arguments: (0, lodash_sortby_1.default)(node.arguments, "name.value") }
        : node;
}
function sortVariableDefinitions(node) {
    return "variableDefinitions" in node
        ? {
            ...node,
            variableDefinitions: (0, lodash_sortby_1.default)(node.variableDefinitions, "variable.name.value"),
        }
        : node;
}
//# sourceMappingURL=index.js.map