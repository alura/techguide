"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const resolvablePromise = () => {
    let resolve;
    let reject;
    const promise = new Promise((_resolve, _reject) => {
        resolve = _resolve;
        reject = _reject;
    });
    promise.resolve = resolve;
    promise.reject = reject;
    return promise;
};
exports.default = resolvablePromise;
module.exports = resolvablePromise;
//# sourceMappingURL=index.js.map