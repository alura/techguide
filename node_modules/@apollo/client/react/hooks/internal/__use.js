import { wrapPromiseWithState } from "../../../utilities/index.js";
import * as React from "rehackt";
// Prevent webpack from complaining about our feature detection of the
// use property of the React namespace, which is expected not
// to exist when using current stable versions, and that's fine.
var useKey = "use";
var realHook = React[useKey];
// This is named with two underscores to allow this hook to evade typical rules of
// hooks (i.e. it can be used conditionally)
export var __use = realHook ||
    function __use(promise) {
        var statefulPromise = wrapPromiseWithState(promise);
        switch (statefulPromise.status) {
            case "pending":
                throw statefulPromise;
            case "rejected":
                throw statefulPromise.reason;
            case "fulfilled":
                return statefulPromise.value;
        }
    };
//# sourceMappingURL=__use.js.map