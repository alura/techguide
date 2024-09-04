import { invariant as originalInvariant, InvariantError } from "ts-invariant";
import { version } from "../../version.js";
import global from "./global.js";
import { stringifyForDisplay } from "../common/stringifyForDisplay.js";
function wrap(fn) {
    return function (message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (typeof message === "number") {
            var arg0 = message;
            message = getHandledErrorMsg(arg0);
            if (!message) {
                message = getFallbackErrorMsg(arg0, args);
                args = [];
            }
        }
        fn.apply(void 0, [message].concat(args));
    };
}
var invariant = Object.assign(function invariant(condition, message) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    if (!condition) {
        originalInvariant(condition, getHandledErrorMsg(message, args) || getFallbackErrorMsg(message, args));
    }
}, {
    debug: wrap(originalInvariant.debug),
    log: wrap(originalInvariant.log),
    warn: wrap(originalInvariant.warn),
    error: wrap(originalInvariant.error),
});
/**
 * Returns an InvariantError.
 *
 * `message` can only be a string, a concatenation of strings, or a ternary statement
 * that results in a string. This will be enforced on build, where the message will
 * be replaced with a message number.
 * String substitutions with %s are supported and will also return
 * pretty-stringified objects.
 * Excess `optionalParams` will be swallowed.
 */
function newInvariantError(message) {
    var optionalParams = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        optionalParams[_i - 1] = arguments[_i];
    }
    return new InvariantError(getHandledErrorMsg(message, optionalParams) ||
        getFallbackErrorMsg(message, optionalParams));
}
var ApolloErrorMessageHandler = Symbol.for("ApolloErrorMessageHandler_" + version);
function stringify(arg) {
    if (typeof arg == "string") {
        return arg;
    }
    try {
        return stringifyForDisplay(arg, 2).slice(0, 1000);
    }
    catch (_a) {
        return "<non-serializable>";
    }
}
function getHandledErrorMsg(message, messageArgs) {
    if (messageArgs === void 0) { messageArgs = []; }
    if (!message)
        return;
    return (global[ApolloErrorMessageHandler] &&
        global[ApolloErrorMessageHandler](message, messageArgs.map(stringify)));
}
function getFallbackErrorMsg(message, messageArgs) {
    if (messageArgs === void 0) { messageArgs = []; }
    if (!message)
        return;
    return "An error occurred! For more details, see the full error text at https://go.apollo.dev/c/err#".concat(encodeURIComponent(JSON.stringify({
        version: version,
        message: message,
        args: messageArgs.map(stringify),
    })));
}
export { invariant, InvariantError, newInvariantError, ApolloErrorMessageHandler, };
//# sourceMappingURL=invariantWrappers.js.map