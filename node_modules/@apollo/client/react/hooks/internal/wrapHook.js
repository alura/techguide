var wrapperSymbol = Symbol.for("apollo.hook.wrappers");
/**
 * @internal
 *
 * Makes an Apollo Client hook "wrappable".
 * That means that the Apollo Client instance can expose a "wrapper" that will be
 * used to wrap the original hook implementation with additional logic.
 * @example
 * ```tsx
 * // this is already done in `@apollo/client` for all wrappable hooks (see `WrappableHooks`)
 * // following this pattern
 * function useQuery() {
 *   return wrapHook('useQuery', _useQuery, options.client)(query, options);
 * }
 * function _useQuery(query, options) {
 *   // original implementation
 * }
 *
 * // this is what a library like `@apollo/client-react-streaming` would do
 * class ApolloClientWithStreaming extends ApolloClient {
 *   constructor(options) {
 *     super(options);
 *     this.queryManager[Symbol.for("apollo.hook.wrappers")] = {
 *       useQuery: (original) => (query, options) => {
 *         console.log("useQuery was called with options", options);
 *         return original(query, options);
 *       }
 *     }
 *   }
 * }
 *
 * // this will now log the options and then call the original `useQuery`
 * const client = new ApolloClientWithStreaming({ ... });
 * useQuery(query, { client });
 * ```
 */
export function wrapHook(hookName, useHook, clientOrObsQuery) {
    var queryManager = clientOrObsQuery["queryManager"];
    var wrappers = queryManager && queryManager[wrapperSymbol];
    var wrapper = wrappers && wrappers[hookName];
    return wrapper ? wrapper(useHook) : useHook;
}
//# sourceMappingURL=wrapHook.js.map