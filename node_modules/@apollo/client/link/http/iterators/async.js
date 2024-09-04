/**
 * Original source:
 * https://github.com/kmalakoff/response-iterator/blob/master/src/iterators/async.ts
 */
export default function asyncIterator(source) {
    var _a;
    var iterator = source[Symbol.asyncIterator]();
    return _a = {
            next: function () {
                return iterator.next();
            }
        },
        _a[Symbol.asyncIterator] = function () {
            return this;
        },
        _a;
}
//# sourceMappingURL=async.js.map