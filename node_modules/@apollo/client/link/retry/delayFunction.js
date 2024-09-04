export function buildDelayFunction(delayOptions) {
    var _a = delayOptions || {}, _b = _a.initial, initial = _b === void 0 ? 300 : _b, _c = _a.jitter, jitter = _c === void 0 ? true : _c, _d = _a.max, max = _d === void 0 ? Infinity : _d;
    // If we're jittering, baseDelay is half of the maximum delay for that
    // attempt (and is, on average, the delay we will encounter).
    // If we're not jittering, adjust baseDelay so that the first attempt
    // lines up with initialDelay, for everyone's sanity.
    var baseDelay = jitter ? initial : initial / 2;
    return function delayFunction(count) {
        var delay = Math.min(max, baseDelay * Math.pow(2, count));
        if (jitter) {
            // We opt for a full jitter approach for a mostly uniform distribution,
            // but bound it within initialDelay and delay for everyone's sanity.
            delay = Math.random() * delay;
        }
        return delay;
    };
}
//# sourceMappingURL=delayFunction.js.map