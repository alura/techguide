import { global } from "../utilities/globals/index.js";
import { ApolloErrorMessageHandler } from "../utilities/globals/invariantWrappers.js";
import { setErrorMessageHandler } from "./setErrorMessageHandler.js";
/**
 * Injects Apollo Client's default error message handler into the application and
 * also loads the error codes that are passed in as arguments.
 */
export function loadErrorMessageHandler() {
    var errorCodes = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        errorCodes[_i] = arguments[_i];
    }
    setErrorMessageHandler(handler);
    for (var _a = 0, errorCodes_1 = errorCodes; _a < errorCodes_1.length; _a++) {
        var codes = errorCodes_1[_a];
        Object.assign(handler, codes);
    }
    return handler;
}
var handler = (function (message, args) {
    if (typeof message === "number") {
        var definition = global[ApolloErrorMessageHandler][message];
        if (!message || !(definition === null || definition === void 0 ? void 0 : definition.message))
            return;
        message = definition.message;
    }
    return args.reduce(function (msg, arg) { return msg.replace(/%[sdfo]/, String(arg)); }, String(message));
});
//# sourceMappingURL=loadErrorMessageHandler.js.map