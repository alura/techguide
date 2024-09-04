function wrap(key) {
    return function (message, callback, timeout) {
        return (key ? it[key] : it)(message, function () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                return callback.call(_this, resolve, reject);
            });
        }, timeout);
    };
}
var wrappedIt = wrap();
export var itAsync = Object.assign(function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return wrappedIt.apply(this, args);
}, {
    only: wrap("only"),
    skip: wrap("skip"),
    todo: wrap("todo"),
});
//# sourceMappingURL=itAsync.js.map