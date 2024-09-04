/**
 * Original source:
 * https://github.com/kmalakoff/response-iterator/blob/master/src/iterators/promise.ts
 */
import { canUseAsyncIteratorSymbol } from "../../../utilities/index.js";
export default function promiseIterator(promise) {
    var resolved = false;
    var iterator = {
        next: function () {
            if (resolved)
                return Promise.resolve({
                    value: undefined,
                    done: true,
                });
            resolved = true;
            return new Promise(function (resolve, reject) {
                promise
                    .then(function (value) {
                    resolve({ value: value, done: false });
                })
                    .catch(reject);
            });
        },
    };
    if (canUseAsyncIteratorSymbol) {
        iterator[Symbol.asyncIterator] = function () {
            return this;
        };
    }
    return iterator;
}
//# sourceMappingURL=promise.js.map