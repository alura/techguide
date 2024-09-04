import { Observable } from "./Observable.js";
// Like Observable.prototype.map, except that the mapping function can
// optionally return a Promise (or be async).
export function asyncMap(observable, mapFn, catchFn) {
    return new Observable(function (observer) {
        var promiseQueue = {
            // Normally we would initialize promiseQueue to Promise.resolve(), but
            // in this case, for backwards compatibility, we need to be careful to
            // invoke the first callback synchronously.
            then: function (callback) {
                return new Promise(function (resolve) { return resolve(callback()); });
            },
        };
        function makeCallback(examiner, key) {
            return function (arg) {
                if (examiner) {
                    var both = function () {
                        // If the observer is closed, we don't want to continue calling the
                        // mapping function - it's result will be swallowed anyways.
                        return observer.closed ?
                            /* will be swallowed */ 0
                            : examiner(arg);
                    };
                    promiseQueue = promiseQueue.then(both, both).then(function (result) { return observer.next(result); }, function (error) { return observer.error(error); });
                }
                else {
                    observer[key](arg);
                }
            };
        }
        var handler = {
            next: makeCallback(mapFn, "next"),
            error: makeCallback(catchFn, "error"),
            complete: function () {
                // no need to reassign `promiseQueue`, after `observer.complete`,
                // the observer will be closed and short-circuit everything anyways
                /*promiseQueue = */ promiseQueue.then(function () { return observer.complete(); });
            },
        };
        var sub = observable.subscribe(handler);
        return function () { return sub.unsubscribe(); };
    });
}
//# sourceMappingURL=asyncMap.js.map