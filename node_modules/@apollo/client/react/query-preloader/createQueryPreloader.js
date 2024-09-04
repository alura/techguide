import { __assign } from "tslib";
import { InternalQueryReference, wrapQueryRef } from "../internal/index.js";
/**
 * A higher order function that returns a `preloadQuery` function which
 * can be used to begin loading a query with the given `client`. This is useful
 * when you want to start loading a query as early as possible outside of a
 * React component.
 *
 * > Refer to the [Suspense - Initiating queries outside React](https://www.apollographql.com/docs/react/data/suspense#initiating-queries-outside-react) section for a more in-depth overview.
 *
 * @param client - The `ApolloClient` instance that will be used to load queries
 * from the returned `preloadQuery` function.
 * @returns The `preloadQuery` function.
 *
 * @example
 * ```js
 * const preloadQuery = createQueryPreloader(client);
 * ```
 * @since 3.9.0
 */
export function createQueryPreloader(client) {
    return function preloadQuery(query, options) {
        var _a, _b;
        if (options === void 0) { options = Object.create(null); }
        var queryRef = new InternalQueryReference(client.watchQuery(__assign(__assign({}, options), { query: query })), {
            autoDisposeTimeoutMs: (_b = (_a = client.defaultOptions.react) === null || _a === void 0 ? void 0 : _a.suspense) === null || _b === void 0 ? void 0 : _b.autoDisposeTimeoutMs,
        });
        return wrapQueryRef(queryRef);
    };
}
//# sourceMappingURL=createQueryPreloader.js.map