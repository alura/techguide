import { __spreadArray } from "tslib";
import * as React from "rehackt";
import { useApolloClient } from "./useApolloClient.js";
import { getSuspenseCache, unwrapQueryRef, updateWrappedQueryRef, wrapQueryRef, } from "../internal/index.js";
import { wrapHook } from "./internal/index.js";
import { useWatchQueryOptions } from "./useSuspenseQuery.js";
import { canonicalStringify } from "../../cache/index.js";
export function useBackgroundQuery(query, options) {
    if (options === void 0) { options = Object.create(null); }
    return wrapHook("useBackgroundQuery", _useBackgroundQuery, useApolloClient(typeof options === "object" ? options.client : undefined))(query, options);
}
function _useBackgroundQuery(query, options) {
    var client = useApolloClient(options.client);
    var suspenseCache = getSuspenseCache(client);
    var watchQueryOptions = useWatchQueryOptions({ client: client, query: query, options: options });
    var fetchPolicy = watchQueryOptions.fetchPolicy, variables = watchQueryOptions.variables;
    var _a = options.queryKey, queryKey = _a === void 0 ? [] : _a;
    // This ref tracks the first time query execution is enabled to determine
    // whether to return a query ref or `undefined`. When initialized
    // in a skipped state (either via `skip: true` or `skipToken`) we return
    // `undefined` for the `queryRef` until the query has been enabled. Once
    // enabled, a query ref is always returned regardless of whether the query is
    // skipped again later.
    var didFetchResult = React.useRef(fetchPolicy !== "standby");
    didFetchResult.current || (didFetchResult.current = fetchPolicy !== "standby");
    var cacheKey = __spreadArray([
        query,
        canonicalStringify(variables)
    ], [].concat(queryKey), true);
    var queryRef = suspenseCache.getQueryRef(cacheKey, function () {
        return client.watchQuery(watchQueryOptions);
    });
    var _b = React.useState(wrapQueryRef(queryRef)), wrappedQueryRef = _b[0], setWrappedQueryRef = _b[1];
    if (unwrapQueryRef(wrappedQueryRef) !== queryRef) {
        setWrappedQueryRef(wrapQueryRef(queryRef));
    }
    if (queryRef.didChangeOptions(watchQueryOptions)) {
        var promise = queryRef.applyOptions(watchQueryOptions);
        updateWrappedQueryRef(wrappedQueryRef, promise);
    }
    // This prevents issues where rerendering useBackgroundQuery after the
    // queryRef has been disposed would cause the hook to return a new queryRef
    // instance since disposal also removes it from the suspense cache. We add
    // the queryRef back in the suspense cache so that the next render will reuse
    // this queryRef rather than initializing a new instance.
    React.useEffect(function () {
        // Since the queryRef is disposed async via `setTimeout`, we have to wait a
        // tick before checking it and adding back to the suspense cache.
        var id = setTimeout(function () {
            if (queryRef.disposed) {
                suspenseCache.add(cacheKey, queryRef);
            }
        });
        return function () { return clearTimeout(id); };
        // Omitting the deps is intentional. This avoids stale closures and the
        // conditional ensures we aren't running the logic on each render.
    });
    var fetchMore = React.useCallback(function (options) {
        var promise = queryRef.fetchMore(options);
        setWrappedQueryRef(wrapQueryRef(queryRef));
        return promise;
    }, [queryRef]);
    var refetch = React.useCallback(function (variables) {
        var promise = queryRef.refetch(variables);
        setWrappedQueryRef(wrapQueryRef(queryRef));
        return promise;
    }, [queryRef]);
    React.useEffect(function () { return queryRef.softRetain(); }, [queryRef]);
    return [
        didFetchResult.current ? wrappedQueryRef : void 0,
        { fetchMore: fetchMore, refetch: refetch },
    ];
}
//# sourceMappingURL=useBackgroundQuery.js.map