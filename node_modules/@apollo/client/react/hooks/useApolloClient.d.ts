import type { ApolloClient } from "../../core/index.js";
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
export declare function useApolloClient(override?: ApolloClient<object>): ApolloClient<object>;
//# sourceMappingURL=useApolloClient.d.ts.map