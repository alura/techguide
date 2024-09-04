import * as React from "rehackt";
import { canUseSymbol } from "../../utilities/index.js";
import { invariant } from "../../utilities/globals/index.js";
// To make sure Apollo Client doesn't create more than one React context
// (which can lead to problems like having an Apollo Client instance added
// in one context, then attempting to retrieve it from another different
// context), a single Apollo context is created and tracked in global state.
var contextKey = canUseSymbol ? Symbol.for("__APOLLO_CONTEXT__") : "__APOLLO_CONTEXT__";
export function getApolloContext() {
    invariant("createContext" in React, 45);
    var context = React.createContext[contextKey];
    if (!context) {
        Object.defineProperty(React.createContext, contextKey, {
            value: (context = React.createContext({})),
            enumerable: false,
            writable: false,
            configurable: true,
        });
        context.displayName = "ApolloContext";
    }
    return context;
}
/**
 * @deprecated This function has no "resetting" effect since Apollo Client 3.4.12,
 * and will be removed in the next major version of Apollo Client.
 * If you want to get the Apollo Context, use `getApolloContext` instead.
 */
export var resetApolloContext = getApolloContext;
//# sourceMappingURL=ApolloContext.js.map