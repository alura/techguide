import { __awaiter, __extends, __generator } from "tslib";
import { ApolloLink } from "../core/index.js";
import { Observable } from "../../utilities/index.js";
import { buildDelayFunction } from "./delayFunction.js";
import { buildRetryFunction } from "./retryFunction.js";
/**
 * Tracking and management of operations that may be (or currently are) retried.
 */
var RetryableOperation = /** @class */ (function () {
    function RetryableOperation(observer, operation, forward, delayFor, retryIf) {
        var _this = this;
        this.observer = observer;
        this.operation = operation;
        this.forward = forward;
        this.delayFor = delayFor;
        this.retryIf = retryIf;
        this.retryCount = 0;
        this.currentSubscription = null;
        this.onError = function (error) { return __awaiter(_this, void 0, void 0, function () {
            var shouldRetry;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.retryCount += 1;
                        return [4 /*yield*/, this.retryIf(this.retryCount, this.operation, error)];
                    case 1:
                        shouldRetry = _a.sent();
                        if (shouldRetry) {
                            this.scheduleRetry(this.delayFor(this.retryCount, this.operation, error));
                            return [2 /*return*/];
                        }
                        this.observer.error(error);
                        return [2 /*return*/];
                }
            });
        }); };
        this.try();
    }
    /**
     * Stop retrying for the operation, and cancel any in-progress requests.
     */
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
var RetryLink = /** @class */ (function (_super) {
    __extends(RetryLink, _super);
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
        return new Observable(function (observer) {
            var retryable = new RetryableOperation(observer, operation, nextLink, _this.delayFor, _this.retryIf);
            return function () {
                retryable.cancel();
            };
        });
    };
    return RetryLink;
}(ApolloLink));
export { RetryLink };
//# sourceMappingURL=retryLink.js.map