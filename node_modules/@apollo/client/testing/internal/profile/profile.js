var _a, _b;
import { __addDisposableResource, __assign, __awaiter, __disposeResources, __extends, __generator, __rest } from "tslib";
import * as React from "react";
import { TextEncoder, TextDecoder } from "util";
(_a = global.TextEncoder) !== null && _a !== void 0 ? _a : (global.TextEncoder = TextEncoder);
// @ts-ignore
(_b = global.TextDecoder) !== null && _b !== void 0 ? _b : (global.TextDecoder = TextDecoder);
import { RenderInstance } from "./Render.js";
import { applyStackTrace, captureStackTrace } from "./traces.js";
import { ProfilerContextProvider, useProfilerContext } from "./context.js";
import { disableActWarnings } from "../disposables/index.js";
/** only used for passing around data internally */
var _stackTrace = Symbol();
/** @internal */
export function profile(_a) {
    var Component = _a.Component, options = __rest(_a, ["Component"]);
    var Profiler = createProfiler(options);
    return Object.assign(function ProfiledComponent(props) {
        return (React.createElement(Profiler, null,
            React.createElement(Component, __assign({}, props))));
    }, {
        mergeSnapshot: Profiler.mergeSnapshot,
        replaceSnapshot: Profiler.replaceSnapshot,
        getCurrentRender: Profiler.getCurrentRender,
        peekRender: Profiler.peekRender,
        takeRender: Profiler.takeRender,
        totalRenderCount: Profiler.totalRenderCount,
        waitForNextRender: Profiler.waitForNextRender,
        get renders() {
            return Profiler.renders;
        },
    });
}
/** @internal */
export function createProfiler(_a) {
    var _b = _a === void 0 ? {} : _a, onRender = _b.onRender, _c = _b.snapshotDOM, snapshotDOM = _c === void 0 ? false : _c, initialSnapshot = _b.initialSnapshot, skipNonTrackingRenders = _b.skipNonTrackingRenders;
    var nextRender;
    var resolveNextRender;
    var rejectNextRender;
    function resetNextRender() {
        nextRender = resolveNextRender = rejectNextRender = undefined;
    }
    var snapshotRef = { current: initialSnapshot };
    var replaceSnapshot = function (snap) {
        if (typeof snap === "function") {
            if (!initialSnapshot) {
                throw new Error("Cannot use a function to update the snapshot if no initial snapshot was provided.");
            }
            snapshotRef.current = snap(typeof snapshotRef.current === "object" ? __assign({}, snapshotRef.current) : snapshotRef.current);
        }
        else {
            snapshotRef.current = snap;
        }
    };
    var mergeSnapshot = function (partialSnapshot) {
        replaceSnapshot(function (snapshot) { return (__assign(__assign({}, snapshot), (typeof partialSnapshot === "function" ?
            partialSnapshot(snapshot)
            : partialSnapshot))); });
    };
    var profilerContext = {
        renderedComponents: [],
    };
    var profilerOnRender = function (id, phase, actualDuration, baseDuration, startTime, commitTime) {
        if (skipNonTrackingRenders &&
            profilerContext.renderedComponents.length === 0) {
            return;
        }
        var baseRender = {
            id: id,
            phase: phase,
            actualDuration: actualDuration,
            baseDuration: baseDuration,
            startTime: startTime,
            commitTime: commitTime,
            count: Profiler.renders.length + 1,
        };
        try {
            /*
             * The `onRender` function could contain `expect` calls that throw
             * `JestAssertionError`s - but we are still inside of React, where errors
             * might be swallowed.
             * So we record them and re-throw them in `takeRender`
             * Additionally, we reject the `waitForNextRender` promise.
             */
            onRender === null || onRender === void 0 ? void 0 : onRender(__assign(__assign({}, baseRender), { replaceSnapshot: replaceSnapshot, mergeSnapshot: mergeSnapshot, snapshot: snapshotRef.current }));
            var snapshot = snapshotRef.current;
            var domSnapshot = snapshotDOM ? window.document.body.innerHTML : undefined;
            var render = new RenderInstance(baseRender, snapshot, domSnapshot, profilerContext.renderedComponents);
            profilerContext.renderedComponents = [];
            Profiler.renders.push(render);
            resolveNextRender === null || resolveNextRender === void 0 ? void 0 : resolveNextRender(render);
        }
        catch (error) {
            Profiler.renders.push({
                phase: "snapshotError",
                count: Profiler.renders.length,
                error: error,
            });
            rejectNextRender === null || rejectNextRender === void 0 ? void 0 : rejectNextRender(error);
        }
        finally {
            resetNextRender();
        }
    };
    var iteratorPosition = 0;
    var Profiler = Object.assign(function (_a) {
        var children = _a.children;
        return (React.createElement(ProfilerContextProvider, { value: profilerContext },
            React.createElement(React.Profiler, { id: "test", onRender: profilerOnRender }, children)));
    }, {
        replaceSnapshot: replaceSnapshot,
        mergeSnapshot: mergeSnapshot,
    }, {
        renders: new Array(),
        totalRenderCount: function () {
            return Profiler.renders.length;
        },
        peekRender: function () {
            return __awaiter(this, arguments, void 0, function (options) {
                var render;
                var _a;
                if (options === void 0) { options = {}; }
                return __generator(this, function (_b) {
                    if (iteratorPosition < Profiler.renders.length) {
                        render = Profiler.renders[iteratorPosition];
                        if (render.phase === "snapshotError") {
                            throw render.error;
                        }
                        return [2 /*return*/, render];
                    }
                    return [2 /*return*/, Profiler.waitForNextRender(__assign((_a = {}, _a[_stackTrace] = captureStackTrace(Profiler.peekRender), _a), options))];
                });
            });
        },
        takeRender: function () {
            return __awaiter(this, arguments, void 0, function (options) {
                var env_1, _disabledActWarnings, error, e_1, e_2;
                var _a;
                if (options === void 0) { options = {}; }
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            env_1 = { stack: [], error: void 0, hasError: false };
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 7, 8, 9]);
                            _disabledActWarnings = __addDisposableResource(env_1, disableActWarnings(), false);
                            error = undefined;
                            _b.label = 2;
                        case 2:
                            _b.trys.push([2, 4, 5, 6]);
                            return [4 /*yield*/, Profiler.peekRender(__assign((_a = {}, _a[_stackTrace] = captureStackTrace(Profiler.takeRender), _a), options))];
                        case 3: return [2 /*return*/, _b.sent()];
                        case 4:
                            e_1 = _b.sent();
                            error = e_1;
                            throw e_1;
                        case 5:
                            if (!(error && error instanceof WaitForRenderTimeoutError)) {
                                iteratorPosition++;
                            }
                            return [7 /*endfinally*/];
                        case 6: return [3 /*break*/, 9];
                        case 7:
                            e_2 = _b.sent();
                            env_1.error = e_2;
                            env_1.hasError = true;
                            return [3 /*break*/, 9];
                        case 8:
                            __disposeResources(env_1);
                            return [7 /*endfinally*/];
                        case 9: return [2 /*return*/];
                    }
                });
            });
        },
        getCurrentRender: function () {
            // The "current" render should point at the same render that the most
            // recent `takeRender` call returned, so we need to get the "previous"
            // iterator position, otherwise `takeRender` advances the iterator
            // to the next render. This means we need to call `takeRender` at least
            // once before we can get a current render.
            var currentPosition = iteratorPosition - 1;
            if (currentPosition < 0) {
                throw new Error("No current render available. You need to call `takeRender` before you can get the current render.");
            }
            var render = Profiler.renders[currentPosition];
            if (render.phase === "snapshotError") {
                throw render.error;
            }
            return render;
        },
        waitForNextRender: function (_a) {
            var _b = _a === void 0 ? {} : _a, _c = _b.timeout, timeout = _c === void 0 ? 1000 : _c, 
            // capture the stack trace here so its stack trace is as close to the calling code as possible
            _d = _stackTrace, 
            // capture the stack trace here so its stack trace is as close to the calling code as possible
            _e = _b[_d], 
            // capture the stack trace here so its stack trace is as close to the calling code as possible
            stackTrace = _e === void 0 ? captureStackTrace(Profiler.waitForNextRender) : _e;
            if (!nextRender) {
                nextRender = Promise.race([
                    new Promise(function (resolve, reject) {
                        resolveNextRender = resolve;
                        rejectNextRender = reject;
                    }),
                    new Promise(function (_, reject) {
                        return setTimeout(function () {
                            reject(applyStackTrace(new WaitForRenderTimeoutError(), stackTrace));
                            resetNextRender();
                        }, timeout);
                    }),
                ]);
            }
            return nextRender;
        },
    });
    return Profiler;
}
/** @internal */
var WaitForRenderTimeoutError = /** @class */ (function (_super) {
    __extends(WaitForRenderTimeoutError, _super);
    function WaitForRenderTimeoutError() {
        var _newTarget = this.constructor;
        var _this = _super.call(this, "Exceeded timeout waiting for next render.") || this;
        Object.setPrototypeOf(_this, _newTarget.prototype);
        return _this;
    }
    return WaitForRenderTimeoutError;
}(Error));
export { WaitForRenderTimeoutError };
/** @internal */
export function profileHook(renderCallback) {
    var Profiler = createProfiler();
    var ProfiledHook = function (props) {
        Profiler.replaceSnapshot(renderCallback(props));
        return null;
    };
    return Object.assign(function App(props) {
        return (React.createElement(Profiler, null,
            React.createElement(ProfiledHook, __assign({}, props))));
    }, {
        Profiler: Profiler,
    }, {
        renders: Profiler.renders,
        totalSnapshotCount: Profiler.totalRenderCount,
        peekSnapshot: function (options) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, Profiler.peekRender(options)];
                        case 1: return [2 /*return*/, (_a.sent()).snapshot];
                    }
                });
            });
        },
        takeSnapshot: function (options) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, Profiler.takeRender(options)];
                        case 1: return [2 /*return*/, (_a.sent()).snapshot];
                    }
                });
            });
        },
        getCurrentSnapshot: function () {
            return Profiler.getCurrentRender().snapshot;
        },
        waitForNextSnapshot: function (options) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, Profiler.waitForNextRender(options)];
                        case 1: return [2 /*return*/, (_a.sent()).snapshot];
                    }
                });
            });
        },
    });
}
function resolveR18HookOwner() {
    var _a, _b, _c;
    return (_c = (_b = (_a = React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED) === null || _a === void 0 ? void 0 : _a.ReactCurrentOwner) === null || _b === void 0 ? void 0 : _b.current) === null || _c === void 0 ? void 0 : _c.elementType;
}
function resolveR19HookOwner() {
    var _a, _b;
    return (_b = (_a = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE) === null || _a === void 0 ? void 0 : _a.A) === null || _b === void 0 ? void 0 : _b.getOwner().elementType;
}
export function useTrackRenders(_a) {
    var _b = _a === void 0 ? {} : _a, name = _b.name;
    var component = name || resolveR18HookOwner() || resolveR19HookOwner();
    if (!component) {
        throw new Error("useTrackRender: Unable to determine component. Please ensure the hook is called inside a rendered component or provide a `name` option.");
    }
    var ctx = useProfilerContext();
    if (!ctx) {
        throw new Error("useTrackComponentRender: A Profiler must be created and rendered to track component renders");
    }
    React.useLayoutEffect(function () {
        ctx.renderedComponents.unshift(component);
    });
}
//# sourceMappingURL=profile.js.map