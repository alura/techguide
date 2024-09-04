import { getOperationDefinition } from "./getFromAST.js";
function isOperation(document, operation) {
    var _a;
    return ((_a = getOperationDefinition(document)) === null || _a === void 0 ? void 0 : _a.operation) === operation;
}
export function isMutationOperation(document) {
    return isOperation(document, "mutation");
}
export function isQueryOperation(document) {
    return isOperation(document, "query");
}
export function isSubscriptionOperation(document) {
    return isOperation(document, "subscription");
}
//# sourceMappingURL=operations.js.map