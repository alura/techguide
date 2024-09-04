import { invariant } from "../../utilities/globals/index.js";
import * as React from "rehackt";
import { getApolloContext } from "../context/index.js";
/**
 * @example
 * ```jsx
 * import { useApolloClient } from '@apollo/client';
 *
 * function SomeComponent() {
 *   const client = useApolloClient();
 *   // `client` is now set to the `ApolloClient` instance being used by the
 *   // application (that was configured using something like `ApolloProvider`)
 * }
 * ```
 *
 * @since 3.0.0
 * @returns The `ApolloClient` instance being used by the application.
 */
export function useApolloClient(override) {
    var context = React.useContext(getApolloContext());
    var client = override || context.client;
    invariant(!!client, 49);
    return client;
}
//# sourceMappingURL=useApolloClient.js.map