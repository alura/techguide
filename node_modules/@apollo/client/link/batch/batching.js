import { __assign } from "tslib";
import { Observable } from "../../utilities/index.js";
// QueryBatcher doesn't fire requests immediately. Requests that were enqueued within
// a certain amount of time (configurable through `batchInterval`) will be batched together
// into one query.
var OperationBatcher = /** @class */ (function () {
    function OperationBatcher(_a) {
        var batchDebounce = _a.batchDebounce, batchInterval = _a.batchInterval, batchMax = _a.batchMax, batchHandler = _a.batchHandler, batchKey = _a.batchKey;
        // Queue on which the QueryBatcher will operate on a per-tick basis.
        this.batchesByKey = new Map();
        this.scheduledBatchTimerByKey = new Map();
        this.batchDebounce = batchDebounce;
        this.batchInterval = batchInterval;
        this.batchMax = batchMax || 0;
        this.batchHandler = batchHandler;
        this.batchKey = batchKey || (function () { return ""; });
    }
    OperationBatcher.prototype.enqueueRequest = function (request) {
        var _this = this;
        var requestCopy = __assign(__assign({}, request), { next: [], error: [], complete: [], subscribers: new Set() });
        var key = this.batchKey(request.operation);
        if (!requestCopy.observable) {
            requestCopy.observable = new Observable(function (observer) {
                var batch = _this.batchesByKey.get(key);
                if (!batch)
                    _this.batchesByKey.set(key, (batch = new Set()));
                // These booleans seem to me (@benjamn) like they might always be the
                // same (and thus we could do with only one of them), but I'm not 100%
                // sure about that.
                var isFirstEnqueuedRequest = batch.size === 0;
                var isFirstSubscriber = requestCopy.subscribers.size === 0;
                requestCopy.subscribers.add(observer);
                if (isFirstSubscriber) {
                    batch.add(requestCopy);
                }
                // called for each subscriber, so need to save all listeners (next, error, complete)
                if (observer.next) {
                    requestCopy.next.push(observer.next.bind(observer));
                }
                if (observer.error) {
                    requestCopy.error.push(observer.error.bind(observer));
                }
                if (observer.complete) {
                    requestCopy.complete.push(observer.complete.bind(observer));
                }
                // The first enqueued request triggers the queue consumption after `batchInterval` milliseconds.
                if (isFirstEnqueuedRequest || _this.batchDebounce) {
                    _this.scheduleQueueConsumption(key);
                }
                // When amount of requests reaches `batchMax`, trigger the queue consumption without waiting on the `batchInterval`.
                if (batch.size === _this.batchMax) {
                    _this.consumeQueue(key);
                }
                return function () {
                    var _a;
                    // If this is last subscriber for this request, remove request from queue
                    if (requestCopy.subscribers.delete(observer) &&
                        requestCopy.subscribers.size < 1) {
                        // If this is last request from queue, remove queue entirely
                        if (batch.delete(requestCopy) && batch.size < 1) {
                            _this.consumeQueue(key);
                            // If queue was in flight, cancel it
                            (_a = batch.subscription) === null || _a === void 0 ? void 0 : _a.unsubscribe();
                        }
                    }
                };
            });
        }
        return requestCopy.observable;
    };
    // Consumes the queue.
    // Returns a list of promises (one for each query).
    OperationBatcher.prototype.consumeQueue = function (key) {
        if (key === void 0) { key = ""; }
        var batch = this.batchesByKey.get(key);
        // Delete this batch and process it below.
        this.batchesByKey.delete(key);
        if (!batch || !batch.size) {
            // No requests to be processed.
            return;
        }
        var operations = [];
        var forwards = [];
        var observables = [];
        var nexts = [];
        var errors = [];
        var completes = [];
        // Even though batch is a Set, it preserves the order of first insertion
        // when iterating (per ECMAScript specification), so these requests will be
        // handled in the order they were enqueued (minus any deleted ones).
        batch.forEach(function (request) {
            operations.push(request.operation);
            forwards.push(request.forward);
            observables.push(request.observable);
            nexts.push(request.next);
            errors.push(request.error);
            completes.push(request.complete);
        });
        var batchedObservable = this.batchHandler(operations, forwards) || Observable.of();
        var onError = function (error) {
            //each callback list in batch
            errors.forEach(function (rejecters) {
                if (rejecters) {
                    //each subscriber to request
                    rejecters.forEach(function (e) { return e(error); });
                }
            });
        };
        batch.subscription = batchedObservable.subscribe({
            next: function (results) {
                if (!Array.isArray(results)) {
                    results = [results];
                }
                if (nexts.length !== results.length) {
                    var error = new Error("server returned results with length ".concat(results.length, ", expected length of ").concat(nexts.length));
                    error.result = results;
                    return onError(error);
                }
                results.forEach(function (result, index) {
                    if (nexts[index]) {
                        nexts[index].forEach(function (next) { return next(result); });
                    }
                });
            },
            error: onError,
            complete: function () {
                completes.forEach(function (complete) {
                    if (complete) {
                        //each subscriber to request
                        complete.forEach(function (c) { return c(); });
                    }
                });
            },
        });
        return observables;
    };
    OperationBatcher.prototype.scheduleQueueConsumption = function (key) {
        var _this = this;
        clearTimeout(this.scheduledBatchTimerByKey.get(key));
        this.scheduledBatchTimerByKey.set(key, setTimeout(function () {
            _this.consumeQueue(key);
            _this.scheduledBatchTimerByKey.delete(key);
        }, this.batchInterval));
    };
    return OperationBatcher;
}());
export { OperationBatcher };
//# sourceMappingURL=batching.js.map