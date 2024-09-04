"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLiveQueryOperationDefinitionNode = void 0;
const utils_1 = require("@graphql-tools/utils");
exports.isLiveQueryOperationDefinitionNode = (0, utils_1.memoize1)(function isLiveQueryOperationDefinitionNode(node) {
    var _a;
    return node.operation === 'query' && ((_a = node.directives) === null || _a === void 0 ? void 0 : _a.some(directive => directive.name.value === 'live'));
});
