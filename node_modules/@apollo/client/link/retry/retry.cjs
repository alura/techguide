'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var core = require('../core');
var utilities = require('../../utilities');

function buildDelayFunction(delayOptions) {
    var _a = delayOptions || {}, _b = _a.initial, initial = _b === void 0 ? 300 : _b, _c = _a.jitter, jitter = _c === void 0 ? true : _c, _d = _a.max, max = _d === void 0 ? Infinity : _d;
    var baseDelay = jitter ? initial : initial / 2;
    return function delayFunction(count) {
        var delay = Math.min(max, baseDelay * Math.pow(2, count));
        if (jitter) {
            delay = Math.random() * delay;
        }
        return delay;
    };
}

function buildRetryFunction(retryOptions) {
    var _a = retryOptions || {}, retryIf = _a.retryIf, _b = _a.max, max = _b === void 0 ? 5 : _b;
    return function retryFunction(count, operation, error) {
        if (count >= max)
            return false;
        return retryIf ? retryIf(error, operation) : !!error;
    };
}

var RetryableOperation =  (function () {
    function RetryableOperation(observer, operation, forward, delayFor, retryIf) {
        var _this = this;
        this.observer = observer;
        this.operation = operation;
        this.forward = forward;
        this.delayFor = delayFor;
        this.retryIf = retryIf;
        this.retryCount = 0;
        this.currentSubscription = null;
        this.onError = function (error) { return tslib.__awaiter(_this, void 0, void 0, function () {
            var shouldRetry;
            return tslib.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.retryCount += 1;
                        return [4 , this.retryIf(this.retryCount, this.operation, error)];
                    case 1:
                        shouldRetry = _a.sent();
                        if (shouldRetry) {
                            this.scheduleRetry(this.delayFor(this.retryCount, this.operation, error));
                            return [2 ];
                        }
                        this.observer.error(error);
                        return [2 ];
                }
            });
        }); };
        this.try();
    }
    RetryableOperation.prototype.cancel = function () {
        if (this.currentSubscription) {
            this.currentSubscription.unsubscribe();
        }
        clearTimeout(this.timerId);
        this.timerId = undefined;
        this.currentSubscription = null;
    };
    RetryableOperation.prototype.try = function () {
        this.currentSubscription = this.forward(this.operation).subscribe({
            next: this.observer.next.bind(this.observer),
            error: this.onError,
            complete: this.observer.complete.bind(this.observer),
        });
    };
    RetryableOperation.prototype.scheduleRetry = function (delay) {
        var _this = this;
        if (this.timerId) {
            throw new Error("RetryLink BUG! Encountered overlapping retries");
        }
        this.timerId = setTimeout(function () {
            _this.timerId = undefined;
            _this.try();
        }, delay);
    };
    return RetryableOperation;
}());
var RetryLink =  (function (_super) {
    tslib.__extends(RetryLink, _super);
    function RetryLink(options) {
        var _this = _super.call(this) || this;
        var _a = options || {}, attempts = _a.attempts, delay = _a.delay;
        _this.delayFor =
            typeof delay === "function" ? delay : buildDelayFunction(delay);
        _this.retryIf =
            typeof attempts === "function" ? attempts : buildRetryFunction(attempts);
        return _this;
    }
    RetryLink.prototype.request = function (operation, nextLink) {
        var _this = this;
        return new utilities.Observable(function (observer) {
            var retryable = new RetryableOperation(observer, operation, nextLink, _this.delayFor, _this.retryIf);
            return function () {
                retryable.cancel();
            };
        });
    };
    return RetryLink;
}(core.ApolloLink));

exports.RetryLink = RetryLink;
//# sourceMappingURL=retry.cjs.map
