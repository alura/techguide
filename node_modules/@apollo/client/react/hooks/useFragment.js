import { __assign, __rest } from "tslib";
import * as React from "rehackt";
import { mergeDeepArray } from "../../utilities/index.js";
import { useApolloClient } from "./useApolloClient.js";
import { useSyncExternalStore } from "./useSyncExternalStore.js";
import { useDeepMemo, useLazyRef, wrapHook } from "./internal/index.js";
import equal from "@wry/equality";
export function useFragment(options) {
    return wrapHook("useFragment", _useFragment, useApolloClient(options.client))(options);
}
function _useFragment(options) {
    var cache = useApolloClient(options.client).cache;
    var diffOptions = useDeepMemo(function () {
        var fragment = options.fragment, fragmentName = options.fragmentName, from = options.from, _a = options.optimistic, optimistic = _a === void 0 ? true : _a, rest = __rest(options, ["fragment", "fragmentName", "from", "optimistic"]);
        return __assign(__assign({}, rest), { returnPartialData: true, id: typeof from === "string" ? from : cache.identify(from), query: cache["getFragmentDoc"](fragment, fragmentName), optimistic: optimistic });
    }, [options]);
    var resultRef = useLazyRef(function () {
        return diffToResult(cache.diff(diffOptions));
    });
    var stableOptions = useDeepMemo(function () { return options; }, [options]);
    // Since .next is async, we need to make sure that we
    // get the correct diff on the next render given new diffOptions
    React.useMemo(function () {
        resultRef.current = diffToResult(cache.diff(diffOptions));
    }, [diffOptions, cache]);
    // Used for both getSnapshot and getServerSnapshot
    var getSnapshot = React.useCallback(function () { return resultRef.current; }, []);
    return useSyncExternalStore(React.useCallback(function (forceUpdate) {
        var lastTimeout = 0;
        var subscription = cache.watchFragment(stableOptions).subscribe({
            next: function (result) {
                if (equal(result, resultRef.current))
                    return;
                resultRef.current = result;
                // If we get another update before we've re-rendered, bail out of
                // the update and try again. This ensures that the relative timing
                // between useQuery and useFragment stays roughly the same as
                // fixed in https://github.com/apollographql/apollo-client/pull/11083
                clearTimeout(lastTimeout);
                lastTimeout = setTimeout(forceUpdate);
            },
        });
        return function () {
            subscription.unsubscribe();
            clearTimeout(lastTimeout);
        };
    }, [cache, stableOptions]), getSnapshot, getSnapshot);
}
function diffToResult(diff) {
    var result = {
        data: diff.result,
        complete: !!diff.complete,
    };
    if (diff.missing) {
        result.missing = mergeDeepArray(diff.missing.map(function (error) { return error.missing; }));
    }
    return result;
}
//# sourceMappingURL=useFragment.js.map