import { __assign } from "tslib";
import { equal } from "@wry/equality";
import { createFulfilledPromise, createRejectedPromise, } from "../../../utilities/index.js";
import { wrapPromiseWithState } from "../../../utilities/index.js";
import { invariant } from "../../../utilities/globals/invariantWrappers.js";
var QUERY_REFERENCE_SYMBOL = Symbol();
var PROMISE_SYMBOL = Symbol();
export function wrapQueryRef(internalQueryRef) {
    var _a;
    var ref = (_a = {
            toPromise: function () {
                // We avoid resolving this promise with the query data because we want to
                // discourage using the server data directly from the queryRef. Instead,
                // the data should be accessed through `useReadQuery`. When the server
                // data is needed, its better to use `client.query()` directly.
                //
                // Here we resolve with the ref itself to make using this in React Router
                // or TanStack Router `loader` functions a bit more ergonomic e.g.
                //
                // function loader() {
                //   return { queryRef: await preloadQuery(query).toPromise() }
                // }
                return getWrappedPromise(ref).then(function () { return ref; });
            }
        },
        _a[QUERY_REFERENCE_SYMBOL] = internalQueryRef,
        _a[PROMISE_SYMBOL] = internalQueryRef.promise,
        _a);
    return ref;
}
export function assertWrappedQueryRef(queryRef) {
    invariant(!queryRef || QUERY_REFERENCE_SYMBOL in queryRef, 59);
}
export function getWrappedPromise(queryRef) {
    var internalQueryRef = unwrapQueryRef(queryRef);
    return internalQueryRef.promise.status === "fulfilled" ?
        internalQueryRef.promise
        : queryRef[PROMISE_SYMBOL];
}
export function unwrapQueryRef(queryRef) {
    return queryRef[QUERY_REFERENCE_SYMBOL];
}
export function updateWrappedQueryRef(queryRef, promise) {
    queryRef[PROMISE_SYMBOL] = promise;
}
var OBSERVED_CHANGED_OPTIONS = [
    "canonizeResults",
    "context",
    "errorPolicy",
    "fetchPolicy",
    "refetchWritePolicy",
    "returnPartialData",
];
var InternalQueryReference = /** @class */ (function () {
    function InternalQueryReference(observable, options) {
        var _this = this;
        this.key = {};
        this.listeners = new Set();
        this.references = 0;
        this.softReferences = 0;
        this.handleNext = this.handleNext.bind(this);
        this.handleError = this.handleError.bind(this);
        this.dispose = this.dispose.bind(this);
        this.observable = observable;
        if (options.onDispose) {
            this.onDispose = options.onDispose;
        }
        this.setResult();
        this.subscribeToQuery();
        // Start a timer that will automatically dispose of the query if the
        // suspended resource does not use this queryRef in the given time. This
        // helps prevent memory leaks when a component has unmounted before the
        // query has finished loading.
        var startDisposeTimer = function () {
            var _a;
            if (!_this.references) {
                _this.autoDisposeTimeoutId = setTimeout(_this.dispose, (_a = options.autoDisposeTimeoutMs) !== null && _a !== void 0 ? _a : 30000);
            }
        };
        // We wait until the request has settled to ensure we don't dispose of the
        // query ref before the request finishes, otherwise we would leave the
        // promise in a pending state rendering the suspense boundary indefinitely.
        this.promise.then(startDisposeTimer, startDisposeTimer);
    }
    Object.defineProperty(InternalQueryReference.prototype, "disposed", {
        get: function () {
            return this.subscription.closed;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(InternalQueryReference.prototype, "watchQueryOptions", {
        get: function () {
            return this.observable.options;
        },
        enumerable: false,
        configurable: true
    });
    InternalQueryReference.prototype.reinitialize = function () {
        var observable = this.observable;
        var originalFetchPolicy = this.watchQueryOptions.fetchPolicy;
        var avoidNetworkRequests = originalFetchPolicy === "no-cache" || originalFetchPolicy === "standby";
        try {
            if (avoidNetworkRequests) {
                observable.silentSetOptions({ fetchPolicy: "standby" });
            }
            else {
                observable.resetLastResults();
                observable.silentSetOptions({ fetchPolicy: "cache-first" });
            }
            this.subscribeToQuery();
            if (avoidNetworkRequests) {
                return;
            }
            observable.resetDiff();
            this.setResult();
        }
        finally {
            observable.silentSetOptions({ fetchPolicy: originalFetchPolicy });
        }
    };
    InternalQueryReference.prototype.retain = function () {
        var _this = this;
        this.references++;
        clearTimeout(this.autoDisposeTimeoutId);
        var disposed = false;
        return function () {
            if (disposed) {
                return;
            }
            disposed = true;
            _this.references--;
            setTimeout(function () {
                if (!_this.references) {
                    _this.dispose();
                }
            });
        };
    };
    InternalQueryReference.prototype.softRetain = function () {
        var _this = this;
        this.softReferences++;
        var disposed = false;
        return function () {
            // Tracking if this has already been called helps ensure that
            // multiple calls to this function won't decrement the reference
            // counter more than it should. Subsequent calls just result in a noop.
            if (disposed) {
                return;
            }
            disposed = true;
            _this.softReferences--;
            setTimeout(function () {
                if (!_this.softReferences && !_this.references) {
                    _this.dispose();
                }
            });
        };
    };
    InternalQueryReference.prototype.didChangeOptions = function (watchQueryOptions) {
        var _this = this;
        return OBSERVED_CHANGED_OPTIONS.some(function (option) {
            return option in watchQueryOptions &&
                !equal(_this.watchQueryOptions[option], watchQueryOptions[option]);
        });
    };
    InternalQueryReference.prototype.applyOptions = function (watchQueryOptions) {
        var _a = this.watchQueryOptions, currentFetchPolicy = _a.fetchPolicy, currentCanonizeResults = _a.canonizeResults;
        // "standby" is used when `skip` is set to `true`. Detect when we've
        // enabled the query (i.e. `skip` is `false`) to execute a network request.
        if (currentFetchPolicy === "standby" &&
            currentFetchPolicy !== watchQueryOptions.fetchPolicy) {
            this.initiateFetch(this.observable.reobserve(watchQueryOptions));
        }
        else {
            this.observable.silentSetOptions(watchQueryOptions);
            if (currentCanonizeResults !== watchQueryOptions.canonizeResults) {
                this.result = __assign(__assign({}, this.result), this.observable.getCurrentResult());
                this.promise = createFulfilledPromise(this.result);
            }
        }
        return this.promise;
    };
    InternalQueryReference.prototype.listen = function (listener) {
        var _this = this;
        this.listeners.add(listener);
        return function () {
            _this.listeners.delete(listener);
        };
    };
    InternalQueryReference.prototype.refetch = function (variables) {
        return this.initiateFetch(this.observable.refetch(variables));
    };
    InternalQueryReference.prototype.fetchMore = function (options) {
        return this.initiateFetch(this.observable.fetchMore(options));
    };
    InternalQueryReference.prototype.dispose = function () {
        this.subscription.unsubscribe();
        this.onDispose();
    };
    InternalQueryReference.prototype.onDispose = function () {
        // noop. overridable by options
    };
    InternalQueryReference.prototype.handleNext = function (result) {
        var _a;
        switch (this.promise.status) {
            case "pending": {
                // Maintain the last successful `data` value if the next result does not
                // have one.
                if (result.data === void 0) {
                    result.data = this.result.data;
                }
                this.result = result;
                (_a = this.resolve) === null || _a === void 0 ? void 0 : _a.call(this, result);
                break;
            }
            default: {
                // This occurs when switching to a result that is fully cached when this
                // class is instantiated. ObservableQuery will run reobserve when
                // subscribing, which delivers a result from the cache.
                if (result.data === this.result.data &&
                    result.networkStatus === this.result.networkStatus) {
                    return;
                }
                // Maintain the last successful `data` value if the next result does not
                // have one.
                if (result.data === void 0) {
                    result.data = this.result.data;
                }
                this.result = result;
                this.promise = createFulfilledPromise(result);
                this.deliver(this.promise);
                break;
            }
        }
    };
    InternalQueryReference.prototype.handleError = function (error) {
        var _a;
        this.subscription.unsubscribe();
        this.subscription = this.observable.resubscribeAfterError(this.handleNext, this.handleError);
        switch (this.promise.status) {
            case "pending": {
                (_a = this.reject) === null || _a === void 0 ? void 0 : _a.call(this, error);
                break;
            }
            default: {
                this.promise = createRejectedPromise(error);
                this.deliver(this.promise);
            }
        }
    };
    InternalQueryReference.prototype.deliver = function (promise) {
        this.listeners.forEach(function (listener) { return listener(promise); });
    };
    InternalQueryReference.prototype.initiateFetch = function (returnedPromise) {
        var _this = this;
        this.promise = this.createPendingPromise();
        this.promise.catch(function () { });
        // If the data returned from the fetch is deeply equal to the data already
        // in the cache, `handleNext` will not be triggered leaving the promise we
        // created in a pending state forever. To avoid this situtation, we attempt
        // to resolve the promise if `handleNext` hasn't been run to ensure the
        // promise is resolved correctly.
        returnedPromise
            .then(function () {
            // In the case of `fetchMore`, this promise is resolved before a cache
            // result is emitted due to the fact that `fetchMore` sets a `no-cache`
            // fetch policy and runs `cache.batch` in its `.then` handler. Because
            // the timing is different, we accidentally run this update twice
            // causing an additional re-render with the `fetchMore` result by
            // itself. By wrapping in `setTimeout`, this should provide a short
            // delay to allow the `QueryInfo.notify` handler to run before this
            // promise is checked.
            // See https://github.com/apollographql/apollo-client/issues/11315 for
            // more information
            setTimeout(function () {
                var _a;
                if (_this.promise.status === "pending") {
                    // Use the current result from the observable instead of the value
                    // resolved from the promise. This avoids issues in some cases where
                    // the raw resolved value should not be the emitted value, such as
                    // when a `fetchMore` call returns an empty array after it has
                    // reached the end of the list.
                    //
                    // See the following for more information:
                    // https://github.com/apollographql/apollo-client/issues/11642
                    _this.result = _this.observable.getCurrentResult();
                    (_a = _this.resolve) === null || _a === void 0 ? void 0 : _a.call(_this, _this.result);
                }
            });
        })
            .catch(function () { });
        return returnedPromise;
    };
    InternalQueryReference.prototype.subscribeToQuery = function () {
        var _this = this;
        this.subscription = this.observable
            .filter(function (result) { return !equal(result.data, {}) && !equal(result, _this.result); })
            .subscribe(this.handleNext, this.handleError);
    };
    InternalQueryReference.prototype.setResult = function () {
        // Don't save this result as last result to prevent delivery of last result
        // when first subscribing
        var result = this.observable.getCurrentResult(false);
        if (equal(result, this.result)) {
            return;
        }
        this.result = result;
        this.promise =
            (result.data &&
                (!result.partial || this.watchQueryOptions.returnPartialData)) ?
                createFulfilledPromise(result)
                : this.createPendingPromise();
    };
    InternalQueryReference.prototype.createPendingPromise = function () {
        var _this = this;
        return wrapPromiseWithState(new Promise(function (resolve, reject) {
            _this.resolve = resolve;
            _this.reject = reject;
        }));
    };
    return InternalQueryReference;
}());
export { InternalQueryReference };
//# sourceMappingURL=QueryReference.js.map