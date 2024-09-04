import { __spreadArray } from "tslib";
// Take an observable and N callbacks, and observe the observable,
// ensuring it is called exactly N times, resolving once it has done so.
// Optionally takes a timeout, which it will wait X ms after the Nth callback
// to ensure it is not called again.
export function observableToPromiseAndSubscription(_a) {
    var observable = _a.observable, _b = _a.shouldResolve, shouldResolve = _b === void 0 ? true : _b, _c = _a.wait, wait = _c === void 0 ? -1 : _c, _d = _a.errorCallbacks, errorCallbacks = _d === void 0 ? [] : _d;
    var cbs = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        cbs[_i - 1] = arguments[_i];
    }
    var subscription = null;
    var promise = new Promise(function (resolve, reject) {
        var errorIndex = 0;
        var cbIndex = 0;
        var results = [];
        var tryToResolve = function () {
            if (!shouldResolve) {
                return;
            }
            var done = function () {
                subscription.unsubscribe();
                // XXX: we could pass a few other things out here?
                resolve(results);
            };
            if (cbIndex === cbs.length && errorIndex === errorCallbacks.length) {
                if (wait === -1) {
                    done();
                }
                else {
                    setTimeout(done, wait);
                }
            }
        };
        var queue = Promise.resolve();
        subscription = observable.subscribe({
            next: function (result) {
                queue = queue
                    .then(function () {
                    var cb = cbs[cbIndex++];
                    if (cb)
                        return cb(result);
                    reject(new Error("Observable 'next' method called more than ".concat(cbs.length, " times")));
                })
                    .then(function (res) {
                    results.push(res);
                    tryToResolve();
                }, reject);
            },
            error: function (error) {
                queue = queue
                    .then(function () {
                    var errorCb = errorCallbacks[errorIndex++];
                    if (errorCb)
                        return errorCb(error);
                    reject(error);
                })
                    .then(tryToResolve, reject);
            },
        });
    });
    return {
        promise: promise,
        subscription: subscription,
    };
}
export default function (options) {
    var cbs = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        cbs[_i - 1] = arguments[_i];
    }
    return observableToPromiseAndSubscription.apply(void 0, __spreadArray([options], cbs, false)).promise;
}
//# sourceMappingURL=observableToPromise.js.map