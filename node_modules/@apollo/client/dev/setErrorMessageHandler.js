import { global } from "../utilities/globals/index.js";
import { ApolloErrorMessageHandler } from "../utilities/globals/invariantWrappers.js";
/**
 * Overrides the global "Error Message Handler" with a custom implementation.
 */
export function setErrorMessageHandler(handler) {
    global[ApolloErrorMessageHandler] = handler;
}
//# sourceMappingURL=setErrorMessageHandler.js.map