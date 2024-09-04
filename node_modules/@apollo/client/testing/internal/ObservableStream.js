import { __asyncGenerator, __await, __awaiter, __extends, __generator } from "tslib";
function observableToAsyncEventIterator(observable) {
    return __asyncGenerator(this, arguments, function observableToAsyncEventIterator_1() {
        function queuePromise() {
            promises.push(new Promise(function (resolve) {
                resolveNext = function (event) {
                    resolve(event);
                    queuePromise();
                };
            }));
        }
        var resolveNext, promises;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    promises = [];
                    queuePromise();
                    observable.subscribe(function (value) { return resolveNext({ type: "next", value: value }); }, function (error) { return resolveNext({ type: "error", error: error }); }, function () { return resolveNext({ type: "complete" }); });
                    return [4 /*yield*/, __await("initialization value")];
                case 1: return [4 /*yield*/, _a.sent()];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    if (!true) return [3 /*break*/, 6];
                    return [4 /*yield*/, __await(promises.shift())];
                case 4: return [4 /*yield*/, _a.sent()];
                case 5:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 6: return [2 /*return*/];
            }
        });
    });
}
var IteratorStream = /** @class */ (function () {
    function IteratorStream(iterator) {
        this.iterator = iterator;
    }
    IteratorStream.prototype.take = function () {
        return __awaiter(this, arguments, void 0, function (_a) {
            var _b = _a === void 0 ? {} : _a, _c = _b.timeout, timeout = _c === void 0 ? 100 : _c;
            return __generator(this, function (_d) {
                return [2 /*return*/, Promise.race([
                        this.iterator.next().then(function (result) { return result.value; }),
                        new Promise(function (_, reject) {
                            setTimeout(reject, timeout, new Error("Timeout waiting for next event"));
                        }),
                    ])];
            });
        });
    };
    return IteratorStream;
}());
var ObservableStream = /** @class */ (function (_super) {
    __extends(ObservableStream, _super);
    function ObservableStream(observable) {
        var iterator = observableToAsyncEventIterator(observable);
        // we need to call next() once to start the generator so we immediately subscribe.
        // the first value is always "initialization value" which we don't care about
        iterator.next();
        return _super.call(this, iterator) || this;
    }
    ObservableStream.prototype.takeNext = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var event;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.take(options)];
                    case 1:
                        event = _a.sent();
                        expect(event).toEqual({ type: "next", value: expect.anything() });
                        return [2 /*return*/, event.value];
                }
            });
        });
    };
    ObservableStream.prototype.takeError = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var event;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.take(options)];
                    case 1:
                        event = _a.sent();
                        expect(event).toEqual({ type: "error", error: expect.anything() });
                        return [2 /*return*/, event.error];
                }
            });
        });
    };
    ObservableStream.prototype.takeComplete = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var event;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.take(options)];
                    case 1:
                        event = _a.sent();
                        expect(event).toEqual({ type: "complete" });
                        return [2 /*return*/];
                }
            });
        });
    };
    return ObservableStream;
}(IteratorStream));
export { ObservableStream };
//# sourceMappingURL=ObservableStream.js.map