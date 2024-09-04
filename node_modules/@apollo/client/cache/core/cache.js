import { __assign, __rest } from "tslib";
import { wrap } from "optimism";
import { Observable, cacheSizes, getFragmentQueryDocument, mergeDeepArray, } from "../../utilities/index.js";
import { WeakCache } from "@wry/caches";
import { getApolloCacheMemoryInternals } from "../../utilities/caching/getMemoryInternals.js";
import { equalByQuery } from "../../core/equalByQuery.js";
var ApolloCache = /** @class */ (function () {
    function ApolloCache() {
        this.assumeImmutableResults = false;
        // Make sure we compute the same (===) fragment query document every
        // time we receive the same fragment in readFragment.
        this.getFragmentDoc = wrap(getFragmentQueryDocument, {
            max: cacheSizes["cache.fragmentQueryDocuments"] ||
                1000 /* defaultCacheSizes["cache.fragmentQueryDocuments"] */,
            cache: WeakCache,
        });
    }
    // Transactional API
    // The batch method is intended to replace/subsume both performTransaction
    // and recordOptimisticTransaction, but performTransaction came first, so we
    // provide a default batch implementation that's just another way of calling
    // performTransaction. Subclasses of ApolloCache (such as InMemoryCache) can
    // override the batch method to do more interesting things with its options.
    ApolloCache.prototype.batch = function (options) {
        var _this = this;
        var optimisticId = typeof options.optimistic === "string" ? options.optimistic
            : options.optimistic === false ? null
                : void 0;
        var updateResult;
        this.performTransaction(function () { return (updateResult = options.update(_this)); }, optimisticId);
        return updateResult;
    };
    ApolloCache.prototype.recordOptimisticTransaction = function (transaction, optimisticId) {
        this.performTransaction(transaction, optimisticId);
    };
    // Optional API
    // Called once per input document, allowing the cache to make static changes
    // to the query, such as adding __typename fields.
    ApolloCache.prototype.transformDocument = function (document) {
        return document;
    };
    // Called before each ApolloLink request, allowing the cache to make dynamic
    // changes to the query, such as filling in missing fragment definitions.
    ApolloCache.prototype.transformForLink = function (document) {
        return document;
    };
    ApolloCache.prototype.identify = function (object) {
        return;
    };
    ApolloCache.prototype.gc = function () {
        return [];
    };
    ApolloCache.prototype.modify = function (options) {
        return false;
    };
    // DataProxy API
    ApolloCache.prototype.readQuery = function (options, optimistic) {
        if (optimistic === void 0) { optimistic = !!options.optimistic; }
        return this.read(__assign(__assign({}, options), { rootId: options.id || "ROOT_QUERY", optimistic: optimistic }));
    };
    /** {@inheritDoc @apollo/client!ApolloClient#watchFragment:member(1)} */
    ApolloCache.prototype.watchFragment = function (options) {
        var _this = this;
        var fragment = options.fragment, fragmentName = options.fragmentName, from = options.from, _a = options.optimistic, optimistic = _a === void 0 ? true : _a;
        var query = this.getFragmentDoc(fragment, fragmentName);
        var diffOptions = {
            returnPartialData: true,
            id: typeof from === "string" ? from : this.identify(from),
            query: query,
            optimistic: optimistic,
        };
        var latestDiff;
        return new Observable(function (observer) {
            return _this.watch(__assign(__assign({}, diffOptions), { immediate: true, callback: function (diff) {
                    if (
                    // Always ensure we deliver the first result
                    latestDiff &&
                        equalByQuery(query, { data: latestDiff === null || latestDiff === void 0 ? void 0 : latestDiff.result }, { data: diff.result })) {
                        return;
                    }
                    var result = {
                        data: diff.result,
                        complete: !!diff.complete,
                    };
                    if (diff.missing) {
                        result.missing = mergeDeepArray(diff.missing.map(function (error) { return error.missing; }));
                    }
                    latestDiff = diff;
                    observer.next(result);
                } }));
        });
    };
    ApolloCache.prototype.readFragment = function (options, optimistic) {
        if (optimistic === void 0) { optimistic = !!options.optimistic; }
        return this.read(__assign(__assign({}, options), { query: this.getFragmentDoc(options.fragment, options.fragmentName), rootId: options.id, optimistic: optimistic }));
    };
    ApolloCache.prototype.writeQuery = function (_a) {
        var id = _a.id, data = _a.data, options = __rest(_a, ["id", "data"]);
        return this.write(Object.assign(options, {
            dataId: id || "ROOT_QUERY",
            result: data,
        }));
    };
    ApolloCache.prototype.writeFragment = function (_a) {
        var id = _a.id, data = _a.data, fragment = _a.fragment, fragmentName = _a.fragmentName, options = __rest(_a, ["id", "data", "fragment", "fragmentName"]);
        return this.write(Object.assign(options, {
            query: this.getFragmentDoc(fragment, fragmentName),
            dataId: id,
            result: data,
        }));
    };
    ApolloCache.prototype.updateQuery = function (options, update) {
        return this.batch({
            update: function (cache) {
                var value = cache.readQuery(options);
                var data = update(value);
                if (data === void 0 || data === null)
                    return value;
                cache.writeQuery(__assign(__assign({}, options), { data: data }));
                return data;
            },
        });
    };
    ApolloCache.prototype.updateFragment = function (options, update) {
        return this.batch({
            update: function (cache) {
                var value = cache.readFragment(options);
                var data = update(value);
                if (data === void 0 || data === null)
                    return value;
                cache.writeFragment(__assign(__assign({}, options), { data: data }));
                return data;
            },
        });
    };
    return ApolloCache;
}());
export { ApolloCache };
if (globalThis.__DEV__ !== false) {
    ApolloCache.prototype.getMemoryInternals = getApolloCacheMemoryInternals;
}
//# sourceMappingURL=cache.js.map