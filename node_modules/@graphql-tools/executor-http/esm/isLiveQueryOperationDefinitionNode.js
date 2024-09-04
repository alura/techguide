import { memoize1 } from '@graphql-tools/utils';
export const isLiveQueryOperationDefinitionNode = memoize1(function isLiveQueryOperationDefinitionNode(node) {
    var _a;
    return node.operation === 'query' && ((_a = node.directives) === null || _a === void 0 ? void 0 : _a.some(directive => directive.name.value === 'live'));
});
