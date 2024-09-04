import { withCleanup } from "./withCleanup.js";
/**
 * Temporarily disable act warnings.
 *
 * https://github.com/reactwg/react-18/discussions/102
 */
export function disableActWarnings() {
    var prev = { prevActEnv: globalThis.IS_REACT_ACT_ENVIRONMENT };
    globalThis.IS_REACT_ACT_ENVIRONMENT = false;
    return withCleanup(prev, function (_a) {
        var prevActEnv = _a.prevActEnv;
        globalThis.IS_REACT_ACT_ENVIRONMENT = prevActEnv;
    });
}
//# sourceMappingURL=disableActWarnings.js.map