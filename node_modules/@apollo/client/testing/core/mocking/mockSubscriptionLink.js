import { __extends } from "tslib";
import { Observable } from "../../../utilities/index.js";
import { ApolloLink } from "../../../link/core/index.js";
var MockSubscriptionLink = /** @class */ (function (_super) {
    __extends(MockSubscriptionLink, _super);
    function MockSubscriptionLink() {
        var _this = _super.call(this) || this;
        _this.unsubscribers = [];
        _this.setups = [];
        _this.observers = [];
        return _this;
    }
    MockSubscriptionLink.prototype.request = function (operation) {
        var _this = this;
        this.operation = operation;
        return new Observable(function (observer) {
            _this.setups.forEach(function (x) { return x(); });
            _this.observers.push(observer);
            return function () {
                _this.unsubscribers.forEach(function (x) { return x(); });
            };
        });
    };
    MockSubscriptionLink.prototype.simulateResult = function (result, complete) {
        var _this = this;
        if (complete === void 0) { complete = false; }
        setTimeout(function () {
            var observers = _this.observers;
            if (!observers.length)
                throw new Error("subscription torn down");
            observers.forEach(function (observer) {
                if (result.result && observer.next)
                    observer.next(result.result);
                if (result.error && observer.error)
                    observer.error(result.error);
                if (complete && observer.complete)
                    observer.complete();
            });
        }, result.delay || 0);
    };
    MockSubscriptionLink.prototype.simulateComplete = function () {
        var observers = this.observers;
        if (!observers.length)
            throw new Error("subscription torn down");
        observers.forEach(function (observer) {
            if (observer.complete)
                observer.complete();
        });
    };
    MockSubscriptionLink.prototype.onSetup = function (listener) {
        this.setups = this.setups.concat([listener]);
    };
    MockSubscriptionLink.prototype.onUnsubscribe = function (listener) {
        this.unsubscribers = this.unsubscribers.concat([listener]);
    };
    return MockSubscriptionLink;
}(ApolloLink));
export { MockSubscriptionLink };
export function mockObservableLink() {
    return new MockSubscriptionLink();
}
//# sourceMappingURL=mockSubscriptionLink.js.map