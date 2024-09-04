import { __assign } from "tslib";
/** @internal */
export function withCleanup(item, cleanup) {
    var _a;
    return __assign(__assign({}, item), (_a = {}, _a[Symbol.dispose] = function () {
        cleanup(item);
        // if `item` already has a cleanup function, we also need to call the original cleanup function
        // (e.g. if something is wrapped in `withCleanup` twice)
        if (Symbol.dispose in item) {
            item[Symbol.dispose]();
        }
    }, _a));
}
//# sourceMappingURL=withCleanup.js.map