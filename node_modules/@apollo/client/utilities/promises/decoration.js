export function createFulfilledPromise(value) {
    var promise = Promise.resolve(value);
    promise.status = "fulfilled";
    promise.value = value;
    return promise;
}
export function createRejectedPromise(reason) {
    var promise = Promise.reject(reason);
    // prevent potential edge cases leaking unhandled error rejections
    promise.catch(function () { });
    promise.status = "rejected";
    promise.reason = reason;
    return promise;
}
export function isStatefulPromise(promise) {
    return "status" in promise;
}
export function wrapPromiseWithState(promise) {
    if (isStatefulPromise(promise)) {
        return promise;
    }
    var pendingPromise = promise;
    pendingPromise.status = "pending";
    pendingPromise.then(function (value) {
        if (pendingPromise.status === "pending") {
            var fulfilledPromise = pendingPromise;
            fulfilledPromise.status = "fulfilled";
            fulfilledPromise.value = value;
        }
    }, function (reason) {
        if (pendingPromise.status === "pending") {
            var rejectedPromise = pendingPromise;
            rejectedPromise.status = "rejected";
            rejectedPromise.reason = reason;
        }
    });
    return promise;
}
//# sourceMappingURL=decoration.js.map