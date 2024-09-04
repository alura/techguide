import { __extends } from "tslib";
import { Observable } from "./Observable.js";
import { iterateObserversSafely } from "./iteration.js";
import { fixObservableSubclass } from "./subclassing.js";
function isPromiseLike(value) {
    return value && typeof value.then === "function";
}
// A Concast<T> observable concatenates the given sources into a single
// non-overlapping sequence of Ts, automatically unwrapping any promises,
// and broadcasts the T elements of that sequence to any number of
// subscribers, all without creating a bunch of intermediary Observable
// wrapper objects.
//
// Even though any number of observers can subscribe to the Concast, each
// source observable is guaranteed to receive at most one subscribe call,
// and the results are multicast to all observers.
//
// In addition to broadcasting every next/error message to this.observers,
// the Concast stores the most recent message using this.latest, so any
// new observers can immediately receive the latest message, even if it
// was originally delivered in the past. This behavior means we can assume
// every active observer in this.observers has received the same most
// recent message.
//
// With the exception of this.latest replay, a Concast is a "hot"
// observable in the sense that it does not replay past results from the
// beginning of time for each new observer.
//
// Could we have used some existing RxJS class instead? Concast<T> is
// similar to a BehaviorSubject<T>, because it is multicast and redelivers
// the latest next/error message to new subscribers. Unlike Subject<T>,
// Concast<T> does not expose an Observer<T> interface (this.handlers is
// intentionally private), since Concast<T> gets its inputs from the
// concatenated sources. If we ever switch to RxJS, there may be some
// value in reusing their code, but for now we use zen-observable, which
// does not contain any Subject implementations.
var Concast = /** @class */ (function (_super) {
    __extends(Concast, _super);
    // Not only can the individual elements of the iterable be promises, but
    // also the iterable itself can be wrapped in a promise.
    function Concast(sources) {
        var _this = _super.call(this, function (observer) {
            _this.addObserver(observer);
            return function () { return _this.removeObserver(observer); };
        }) || this;
        // Active observers receiving broadcast messages. Thanks to this.latest,
        // we can assume all observers in this Set have received the same most
        // recent message, though possibly at different times in the past.
        _this.observers = new Set();
        _this.promise = new Promise(function (resolve, reject) {
            _this.resolve = resolve;
            _this.reject = reject;
        });
        // Bound handler functions that can be reused for every internal
        // subscription.
        _this.handlers = {
            next: function (result) {
                if (_this.sub !== null) {
                    _this.latest = ["next", result];
                    _this.notify("next", result);
                    iterateObserversSafely(_this.observers, "next", result);
                }
            },
            error: function (error) {
                var sub = _this.sub;
                if (sub !== null) {
                    // Delay unsubscribing from the underlying subscription slightly,
                    // so that immediately subscribing another observer can keep the
                    // subscription active.
                    if (sub)
                        setTimeout(function () { return sub.unsubscribe(); });
                    _this.sub = null;
                    _this.latest = ["error", error];
                    _this.reject(error);
                    _this.notify("error", error);
                    iterateObserversSafely(_this.observers, "error", error);
                }
            },
            complete: function () {
                var _a = _this, sub = _a.sub, _b = _a.sources, sources = _b === void 0 ? [] : _b;
                if (sub !== null) {
                    // If complete is called before concast.start, this.sources may be
                    // undefined, so we use a default value of [] for sources. That works
                    // here because it falls into the if (!value) {...} block, which
                    // appropriately terminates the Concast, even if this.sources might
                    // eventually have been initialized to a non-empty array.
                    var value = sources.shift();
                    if (!value) {
                        if (sub)
                            setTimeout(function () { return sub.unsubscribe(); });
                        _this.sub = null;
                        if (_this.latest && _this.latest[0] === "next") {
                            _this.resolve(_this.latest[1]);
                        }
                        else {
                            _this.resolve();
                        }
                        _this.notify("complete");
                        // We do not store this.latest = ["complete"], because doing so
                        // discards useful information about the previous next (or
                        // error) message. Instead, if new observers subscribe after
                        // this Concast has completed, they will receive the final
                        // 'next' message (unless there was an error) immediately
                        // followed by a 'complete' message (see addObserver).
                        iterateObserversSafely(_this.observers, "complete");
                    }
                    else if (isPromiseLike(value)) {
                        value.then(function (obs) { return (_this.sub = obs.subscribe(_this.handlers)); }, _this.handlers.error);
                    }
                    else {
                        _this.sub = value.subscribe(_this.handlers);
                    }
                }
            },
        };
        _this.nextResultListeners = new Set();
        // A public way to abort observation and broadcast.
        _this.cancel = function (reason) {
            _this.reject(reason);
            _this.sources = [];
            _this.handlers.complete();
        };
        // Suppress rejection warnings for this.promise, since it's perfectly
        // acceptable to pay no attention to this.promise if you're consuming
        // the results through the normal observable API.
        _this.promise.catch(function (_) { });
        // If someone accidentally tries to create a Concast using a subscriber
        // function, recover by creating an Observable from that subscriber and
        // using it as the source.
        if (typeof sources === "function") {
            sources = [new Observable(sources)];
        }
        if (isPromiseLike(sources)) {
            sources.then(function (iterable) { return _this.start(iterable); }, _this.handlers.error);
        }
        else {
            _this.start(sources);
        }
        return _this;
    }
    Concast.prototype.start = function (sources) {
        if (this.sub !== void 0)
            return;
        // In practice, sources is most often simply an Array of observables.
        // TODO Consider using sources[Symbol.iterator]() to take advantage
        // of the laziness of non-Array iterables.
        this.sources = Array.from(sources);
        // Calling this.handlers.complete() kicks off consumption of the first
        // source observable. It's tempting to do this step lazily in
        // addObserver, but this.promise can be accessed without calling
        // addObserver, so consumption needs to begin eagerly.
        this.handlers.complete();
    };
    Concast.prototype.deliverLastMessage = function (observer) {
        if (this.latest) {
            var nextOrError = this.latest[0];
            var method = observer[nextOrError];
            if (method) {
                method.call(observer, this.latest[1]);
            }
            // If the subscription is already closed, and the last message was
            // a 'next' message, simulate delivery of the final 'complete'
            // message again.
            if (this.sub === null && nextOrError === "next" && observer.complete) {
                observer.complete();
            }
        }
    };
    Concast.prototype.addObserver = function (observer) {
        if (!this.observers.has(observer)) {
            // Immediately deliver the most recent message, so we can always
            // be sure all observers have the latest information.
            this.deliverLastMessage(observer);
            this.observers.add(observer);
        }
    };
    Concast.prototype.removeObserver = function (observer) {
        if (this.observers.delete(observer) && this.observers.size < 1) {
            // In case there are still any listeners in this.nextResultListeners, and
            // no error or completion has been broadcast yet, make sure those
            // observers have a chance to run and then remove themselves from
            // this.observers.
            this.handlers.complete();
        }
    };
    Concast.prototype.notify = function (method, arg) {
        var nextResultListeners = this.nextResultListeners;
        if (nextResultListeners.size) {
            // Replacing this.nextResultListeners first ensures it does not grow while
            // we are iterating over it, potentially leading to infinite loops.
            this.nextResultListeners = new Set();
            nextResultListeners.forEach(function (listener) { return listener(method, arg); });
        }
    };
    // We need a way to run callbacks just *before* the next result (or error or
    // completion) is delivered by this Concast, so we can be sure any code that
    // runs as a result of delivering that result/error observes the effects of
    // running the callback(s). It was tempting to reuse the Observer type instead
    // of introducing NextResultListener, but that messes with the sizing and
    // maintenance of this.observers, and ends up being more code overall.
    Concast.prototype.beforeNext = function (callback) {
        var called = false;
        this.nextResultListeners.add(function (method, arg) {
            if (!called) {
                called = true;
                callback(method, arg);
            }
        });
    };
    return Concast;
}(Observable));
export { Concast };
// Necessary because the Concast constructor has a different signature
// than the Observable constructor.
fixObservableSubclass(Concast);
//# sourceMappingURL=Concast.js.map