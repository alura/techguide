import { __assign } from "tslib";
export function createOperation(starting, operation) {
    var context = __assign({}, starting);
    var setContext = function (next) {
        if (typeof next === "function") {
            context = __assign(__assign({}, context), next(context));
        }
        else {
            context = __assign(__assign({}, context), next);
        }
    };
    var getContext = function () { return (__assign({}, context)); };
    Object.defineProperty(operation, "setContext", {
        enumerable: false,
        value: setContext,
    });
    Object.defineProperty(operation, "getContext", {
        enumerable: false,
        value: getContext,
    });
    return operation;
}
//# sourceMappingURL=createOperation.js.map