import { __assign } from "tslib";
import { compact } from "./compact.js";
export function mergeOptions(defaults, options) {
    return compact(defaults, options, options.variables && {
        variables: compact(__assign(__assign({}, (defaults && defaults.variables)), options.variables)),
    });
}
//# sourceMappingURL=mergeOptions.js.map