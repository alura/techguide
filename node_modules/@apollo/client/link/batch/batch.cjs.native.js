'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var core = require('../core');
var utilities = require('../../utilities');

var OperationBatcher =  (function () {
    function OperationBatcher(_a) {
        var batchDebounce = _a.batchDebounce, batchInterval = _a.batchInterval, batchMax = _a.batchMax, batchHandler = _a.batchHandler, batchKey = _a.batchKey;
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
        var requestCopy = tslib.__assign(tslib.__assign({}, request), { next: [], error: [], complete: [], subscribers: new Set() });
        var key = this.batchKey(request.operation);
        if (!requestCopy.observable) {
            requestCopy.observable = new utilities.Observable(function (observer) {
                var batch = _this.batchesByKey.get(key);
                if (!batch)
                    _this.batchesByKey.set(key, (batch = new Set()));
                var isFirstEnqueuedRequest = batch.size === 0;
                var isFirstSubscriber = requestCopy.subscribers.size === 0;
                requestCopy.subscribers.add(observer);
                if (isFirstSubscriber) {
                    batch.add(requestCopy);
                }
                if (observer.next) {
                    requestCopy.next.push(observer.next.bind(observer));
                }
                if (observer.error) {
                    requestCopy.error.push(observer.error.bind(observer));
                }
                if (observer.complete) {
                    requestCopy.complete.push(observer.complete.bind(observer));
                }
                if (isFirstEnqueuedRequest || _this.batchDebounce) {
                    _this.scheduleQueueConsumption(key);
                }
                if (batch.size === _this.batchMax) {
                    _this.consumeQueue(key);
                }
                return function () {
                    var _a;
                    if (requestCopy.subscribers.delete(observer) &&
                        requestCopy.subscribers.size < 1) {
                        if (batch.delete(requestCopy) && batch.size < 1) {
                            _this.consumeQueue(key);
                            (_a = batch.subscription) === null || _a === void 0 ? void 0 : _a.unsubscribe();
                        }
                    }
                };
            });
        }
        return requestCopy.observable;
    };
    OperationBatcher.prototype.consumeQueue = function (key) {
        if (key === void 0) { key = ""; }
        var batch = this.batchesByKey.get(key);
        this.batchesByKey.delete(key);
        if (!batch || !batch.size) {
            return;
        }
        var operations = [];
        var forwards = [];
        var observables = [];
        var nexts = [];
        var errors = [];
        var completes = [];
        batch.forEach(function (request) {
            operations.push(request.operation);
            forwards.push(request.forward);
            observables.push(request.observable);
            nexts.push(request.next);
            errors.push(request.error);
            completes.push(request.complete);
        });
        var batchedObservable = this.batchHandler(operations, forwards) || utilities.Observable.of();
        var onError = function (error) {
            errors.forEach(function (rejecters) {
                if (rejecters) {
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

var BatchLink =  (function (_super) {
    tslib.__extends(BatchLink, _super);
    function BatchLink(fetchParams) {
        var _this = _super.call(this) || this;
        var _a = fetchParams || {}, batchDebounce = _a.batchDebounce, _b = _a.batchInterval, batchInterval = _b === void 0 ? 10 : _b, _c = _a.batchMax, batchMax = _c === void 0 ? 0 : _c, _d = _a.batchHandler, batchHandler = _d === void 0 ? function () { return null; } : _d, _e = _a.batchKey, batchKey = _e === void 0 ? function () { return ""; } : _e;
        _this.batcher = new OperationBatcher({
            batchDebounce: batchDebounce,
            batchInterval: batchInterval,
            batchMax: batchMax,
            batchHandler: batchHandler,
            batchKey: batchKey,
        });
        if (fetchParams.batchHandler.length <= 1) {
            _this.request = function (operation) { return _this.batcher.enqueueRequest({ operation: operation }); };
        }
        return _this;
    }
    BatchLink.prototype.request = function (operation, forward) {
        return this.batcher.enqueueRequest({
            operation: operation,
            forward: forward,
        });
    };
    return BatchLink;
}(core.ApolloLink));

exports.BatchLink = BatchLink;
exports.OperationBatcher = OperationBatcher;
//# sourceMappingURL=batch.cjs.map
