import { __spreadArray } from "tslib";
import { ApolloClient } from "../../core/index.js";
import { canonicalStringify } from "../../cache/index.js";
import { getSuspenseCache } from "../../react/internal/index.js";
export var toHaveSuspenseCacheEntryUsing = function (client, query, _a) {
    var _b;
    var _c = _a === void 0 ? Object.create(null) : _a, variables = _c.variables, _d = _c.queryKey, queryKey = _d === void 0 ? [] : _d;
    if (!(client instanceof ApolloClient)) {
        throw new Error("Actual must be an instance of `ApolloClient`");
    }
    var suspenseCache = getSuspenseCache(client);
    var cacheKey = __spreadArray([
        query,
        canonicalStringify(variables)
    ], [].concat(queryKey), true);
    var queryRef = (_b = suspenseCache["queryRefs"].lookupArray(cacheKey)) === null || _b === void 0 ? void 0 : _b.current;
    return {
        pass: !!queryRef,
        message: function () {
            return "Expected suspense cache ".concat(queryRef ? "not " : "", "to have cache entry using key");
        },
    };
};
//# sourceMappingURL=toHaveSuspenseCacheEntryUsing.js.map