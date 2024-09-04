// I'm not sure why mocha doesn't provide something like this, you can't
// always use promises
export default (function(reject, cb) {
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        try {
            return cb.apply(void 0, args);
        }
        catch (e) {
            reject(e);
        }
    };
});
export function withError(func, regex) {
    var message = null;
    var oldError = console.error;
    console.error = function (m) { return (message = m); };
    try {
        var result = func();
        expect(message).toMatch(regex);
        return result;
    }
    finally {
        console.error = oldError;
    }
}
//# sourceMappingURL=wrap.js.map