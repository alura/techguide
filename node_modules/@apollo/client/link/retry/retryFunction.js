export function buildRetryFunction(retryOptions) {
    var _a = retryOptions || {}, retryIf = _a.retryIf, _b = _a.max, max = _b === void 0 ? 5 : _b;
    return function retryFunction(count, operation, error) {
        if (count >= max)
            return false;
        return retryIf ? retryIf(error, operation) : !!error;
    };
}
//# sourceMappingURL=retryFunction.js.map