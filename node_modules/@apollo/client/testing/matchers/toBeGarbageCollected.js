import { __awaiter, __generator } from "tslib";
export var toBeGarbageCollected = function (actual) {
    return __awaiter(this, void 0, void 0, function () {
        var hint, pass, interval, timeout;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    hint = this.utils.matcherHint("toBeGarbageCollected");
                    if (!(actual instanceof WeakRef)) {
                        throw new Error(hint +
                            "\n\n" +
                            "Expected value to be a WeakRef, but it was a ".concat(typeof actual, "."));
                    }
                    pass = false;
                    return [4 /*yield*/, Promise.race([
                            new Promise(function (resolve) {
                                timeout = setTimeout(resolve, 1000);
                            }),
                            new Promise(function (resolve) {
                                interval = setInterval(function () {
                                    global.gc();
                                    pass = actual.deref() === undefined;
                                    if (pass) {
                                        resolve();
                                    }
                                }, 1);
                            }),
                        ])];
                case 1:
                    _a.sent();
                    clearInterval(interval);
                    clearTimeout(timeout);
                    return [2 /*return*/, {
                            pass: pass,
                            message: function () {
                                if (pass) {
                                    return (hint +
                                        "\n\n" +
                                        "Expected value to not be cache-collected, but it was.");
                                }
                                return (hint + "\n\n Expected value to be cache-collected, but it was not.");
                            },
                        }];
            }
        });
    });
};
//# sourceMappingURL=toBeGarbageCollected.js.map