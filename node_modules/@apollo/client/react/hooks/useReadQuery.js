import * as React from "rehackt";
import { assertWrappedQueryRef, getWrappedPromise, unwrapQueryRef, updateWrappedQueryRef, } from "../internal/index.js";
import { __use, wrapHook } from "./internal/index.js";
import { toApolloError } from "./useSuspenseQuery.js";
import { useSyncExternalStore } from "./useSyncExternalStore.js";
import { useApolloClient } from "./useApolloClient.js";
export function useReadQuery(queryRef) {
    var unwrapped = unwrapQueryRef(queryRef);
    return wrapHook("useReadQuery", _useReadQuery, unwrapped ?
        unwrapped["observable"]
        // in the case of a "transported" queryRef object, we need to use the
        // client that's available to us at the current position in the React tree
        // that ApolloClient will then have the job to recreate a real queryRef from
        // the transported object
        // This is just a context read - it's fine to do this conditionally.
        // This hook wrapper also shouldn't be optimized by React Compiler.
        // eslint-disable-next-line react-compiler/react-compiler
        // eslint-disable-next-line react-hooks/rules-of-hooks
        : useApolloClient())(queryRef);
}
function _useReadQuery(queryRef) {
    assertWrappedQueryRef(queryRef);
    var internalQueryRef = React.useMemo(function () { return unwrapQueryRef(queryRef); }, [queryRef]);
    var getPromise = React.useCallback(function () { return getWrappedPromise(queryRef); }, [queryRef]);
    if (internalQueryRef.disposed) {
        internalQueryRef.reinitialize();
        updateWrappedQueryRef(queryRef, internalQueryRef.promise);
    }
    React.useEffect(function () { return internalQueryRef.retain(); }, [internalQueryRef]);
    var promise = useSyncExternalStore(React.useCallback(function (forceUpdate) {
        return internalQueryRef.listen(function (promise) {
            updateWrappedQueryRef(queryRef, promise);
            forceUpdate();
        });
    }, [internalQueryRef, queryRef]), getPromise, getPromise);
    var result = __use(promise);
    return React.useMemo(function () {
        return {
            data: result.data,
            networkStatus: result.networkStatus,
            error: toApolloError(result),
        };
    }, [result]);
}
//# sourceMappingURL=useReadQuery.js.map