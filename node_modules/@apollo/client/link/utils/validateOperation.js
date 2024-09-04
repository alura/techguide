import { newInvariantError } from "../../utilities/globals/index.js";
export function validateOperation(operation) {
    var OPERATION_FIELDS = [
        "query",
        "operationName",
        "variables",
        "extensions",
        "context",
    ];
    for (var _i = 0, _a = Object.keys(operation); _i < _a.length; _i++) {
        var key = _a[_i];
        if (OPERATION_FIELDS.indexOf(key) < 0) {
            throw newInvariantError(43, key);
        }
    }
    return operation;
}
//# sourceMappingURL=validateOperation.js.map