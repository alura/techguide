'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __await(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

/** An error subclass which is thrown when there are too many pending push or next operations on a single repeater. */
var RepeaterOverflowError = /** @class */ (function (_super) {
    __extends(RepeaterOverflowError, _super);
    function RepeaterOverflowError(message) {
        var _this = _super.call(this, message) || this;
        Object.defineProperty(_this, "name", {
            value: "RepeaterOverflowError",
            enumerable: false,
        });
        if (typeof Object.setPrototypeOf === "function") {
            Object.setPrototypeOf(_this, _this.constructor.prototype);
        }
        else {
            _this.__proto__ = _this.constructor.prototype;
        }
        if (typeof Error.captureStackTrace === "function") {
            Error.captureStackTrace(_this, _this.constructor);
        }
        return _this;
    }
    return RepeaterOverflowError;
}(Error));
/** A buffer which allows you to push a set amount of values to the repeater without pushes waiting or throwing errors. */
var FixedBuffer = /** @class */ (function () {
    function FixedBuffer(capacity) {
        if (capacity < 0) {
            throw new RangeError("Capacity may not be less than 0");
        }
        this._c = capacity;
        this._q = [];
    }
    Object.defineProperty(FixedBuffer.prototype, "empty", {
        get: function () {
            return this._q.length === 0;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FixedBuffer.prototype, "full", {
        get: function () {
            return this._q.length >= this._c;
        },
        enumerable: false,
        configurable: true
    });
    FixedBuffer.prototype.add = function (value) {
        if (this.full) {
            throw new Error("Buffer full");
        }
        else {
            this._q.push(value);
        }
    };
    FixedBuffer.prototype.remove = function () {
        if (this.empty) {
            throw new Error("Buffer empty");
        }
        return this._q.shift();
    };
    return FixedBuffer;
}());
// TODO: Use a circular buffer here.
/** Sliding buffers allow you to push a set amount of values to the repeater without pushes waiting or throwing errors. If the number of values exceeds the capacity set in the constructor, the buffer will discard the earliest values added. */
var SlidingBuffer = /** @class */ (function () {
    function SlidingBuffer(capacity) {
        if (capacity < 1) {
            throw new RangeError("Capacity may not be less than 1");
        }
        this._c = capacity;
        this._q = [];
    }
    Object.defineProperty(SlidingBuffer.prototype, "empty", {
        get: function () {
            return this._q.length === 0;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SlidingBuffer.prototype, "full", {
        get: function () {
            return false;
        },
        enumerable: false,
        configurable: true
    });
    SlidingBuffer.prototype.add = function (value) {
        while (this._q.length >= this._c) {
            this._q.shift();
        }
        this._q.push(value);
    };
    SlidingBuffer.prototype.remove = function () {
        if (this.empty) {
            throw new Error("Buffer empty");
        }
        return this._q.shift();
    };
    return SlidingBuffer;
}());
/** Dropping buffers allow you to push a set amount of values to the repeater without the push function waiting or throwing errors. If the number of values exceeds the capacity set in the constructor, the buffer will discard the latest values added. */
var DroppingBuffer = /** @class */ (function () {
    function DroppingBuffer(capacity) {
        if (capacity < 1) {
            throw new RangeError("Capacity may not be less than 1");
        }
        this._c = capacity;
        this._q = [];
    }
    Object.defineProperty(DroppingBuffer.prototype, "empty", {
        get: function () {
            return this._q.length === 0;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DroppingBuffer.prototype, "full", {
        get: function () {
            return false;
        },
        enumerable: false,
        configurable: true
    });
    DroppingBuffer.prototype.add = function (value) {
        if (this._q.length < this._c) {
            this._q.push(value);
        }
    };
    DroppingBuffer.prototype.remove = function () {
        if (this.empty) {
            throw new Error("Buffer empty");
        }
        return this._q.shift();
    };
    return DroppingBuffer;
}());
/** Makes sure promise-likes don’t cause unhandled rejections. */
function swallow(value) {
    if (value != null && typeof value.then === "function") {
        value.then(NOOP, NOOP);
    }
}
/*** REPEATER STATES ***/
/** The following is an enumeration of all possible repeater states. These states are ordered, and a repeater may only advance to higher states. */
/** The initial state of the repeater. */
var Initial = 0;
/** Repeaters advance to this state the first time the next method is called on the repeater. */
var Started = 1;
/** Repeaters advance to this state when the stop function is called. */
var Stopped = 2;
/** Repeaters advance to this state when there are no values left to be pulled from the repeater. */
var Done = 3;
/** Repeaters advance to this state if an error is thrown into the repeater. */
var Rejected = 4;
/** The maximum number of push or next operations which may exist on a single repeater. */
var MAX_QUEUE_LENGTH = 1024;
var NOOP = function () { };
/** A helper function used to mimic the behavior of async generators where the final iteration is consumed. */
function consumeExecution(r) {
    var err = r.err;
    var execution = Promise.resolve(r.execution).then(function (value) {
        if (err != null) {
            throw err;
        }
        return value;
    });
    r.err = undefined;
    r.execution = execution.then(function () { return undefined; }, function () { return undefined; });
    return r.pending === undefined ? execution : r.pending.then(function () { return execution; });
}
/** A helper function for building iterations from values. Promises are unwrapped, so that iterations never have their value property set to a promise. */
function createIteration(r, value) {
    var done = r.state >= Done;
    return Promise.resolve(value).then(function (value) {
        if (!done && r.state >= Rejected) {
            return consumeExecution(r).then(function (value) { return ({
                value: value,
                done: true,
            }); });
        }
        return { value: value, done: done };
    });
}
/**
 * This function is bound and passed to the executor as the stop argument.
 *
 * Advances state to Stopped.
 */
function stop(r, err) {
    var e_1, _a;
    if (r.state >= Stopped) {
        return;
    }
    r.state = Stopped;
    r.onnext();
    r.onstop();
    if (r.err == null) {
        r.err = err;
    }
    if (r.pushes.length === 0 &&
        (typeof r.buffer === "undefined" || r.buffer.empty)) {
        finish(r);
    }
    else {
        try {
            for (var _b = __values(r.pushes), _d = _b.next(); !_d.done; _d = _b.next()) {
                var push_1 = _d.value;
                push_1.resolve();
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
}
/**
 * The difference between stopping a repeater vs finishing a repeater is that stopping a repeater allows next to continue to drain values from the push queue and buffer, while finishing a repeater will clear all pending values and end iteration immediately. Once, a repeater is finished, all iterations will have the done property set to true.
 *
 * Advances state to Done.
 */
function finish(r) {
    var e_2, _a;
    if (r.state >= Done) {
        return;
    }
    if (r.state < Stopped) {
        stop(r);
    }
    r.state = Done;
    r.buffer = undefined;
    try {
        for (var _b = __values(r.nexts), _d = _b.next(); !_d.done; _d = _b.next()) {
            var next = _d.value;
            var execution = r.pending === undefined
                ? consumeExecution(r)
                : r.pending.then(function () { return consumeExecution(r); });
            next.resolve(createIteration(r, execution));
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (_d && !_d.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_2) throw e_2.error; }
    }
    r.pushes = [];
    r.nexts = [];
}
/**
 * Called when a promise passed to push rejects, or when a push call is unhandled.
 *
 * Advances state to Rejected.
 */
function reject(r) {
    if (r.state >= Rejected) {
        return;
    }
    if (r.state < Done) {
        finish(r);
    }
    r.state = Rejected;
}
/** This function is bound and passed to the executor as the push argument. */
function push(r, value) {
    swallow(value);
    if (r.pushes.length >= MAX_QUEUE_LENGTH) {
        throw new RepeaterOverflowError("No more than " + MAX_QUEUE_LENGTH + " pending calls to push are allowed on a single repeater.");
    }
    else if (r.state >= Stopped) {
        return Promise.resolve(undefined);
    }
    var valueP = r.pending === undefined
        ? Promise.resolve(value)
        : r.pending.then(function () { return value; });
    valueP = valueP.catch(function (err) {
        if (r.state < Stopped) {
            r.err = err;
        }
        reject(r);
        return undefined; // void :(
    });
    var nextP;
    if (r.nexts.length) {
        var next_1 = r.nexts.shift();
        next_1.resolve(createIteration(r, valueP));
        if (r.nexts.length) {
            nextP = Promise.resolve(r.nexts[0].value);
        }
        else {
            nextP = new Promise(function (resolve) { return (r.onnext = resolve); });
        }
    }
    else if (typeof r.buffer !== "undefined" && !r.buffer.full) {
        r.buffer.add(valueP);
        nextP = Promise.resolve(undefined);
    }
    else {
        nextP = new Promise(function (resolve) { return r.pushes.push({ resolve: resolve, value: valueP }); });
    }
    // If an error is thrown into the repeater via the next or throw methods, we give the repeater a chance to handle this by rejecting the promise returned from push. If the push call is not immediately handled we throw the next iteration of the repeater.
    // To check that the promise returned from push is floating, we modify the then and catch methods of the returned promise so that they flip the floating flag. The push function actually does not return a promise, because modern engines do not call the then and catch methods on native promises. By making next a plain old javascript object, we ensure that the then and catch methods will be called.
    var floating = true;
    var next = {};
    var unhandled = nextP.catch(function (err) {
        if (floating) {
            throw err;
        }
        return undefined; // void :(
    });
    next.then = function (onfulfilled, onrejected) {
        floating = false;
        return Promise.prototype.then.call(nextP, onfulfilled, onrejected);
    };
    next.catch = function (onrejected) {
        floating = false;
        return Promise.prototype.catch.call(nextP, onrejected);
    };
    next.finally = nextP.finally.bind(nextP);
    r.pending = valueP
        .then(function () { return unhandled; })
        .catch(function (err) {
        r.err = err;
        reject(r);
    });
    return next;
}
/**
 * Creates the stop callable promise which is passed to the executor
 */
function createStop(r) {
    var stop1 = stop.bind(null, r);
    var stopP = new Promise(function (resolve) { return (r.onstop = resolve); });
    stop1.then = stopP.then.bind(stopP);
    stop1.catch = stopP.catch.bind(stopP);
    stop1.finally = stopP.finally.bind(stopP);
    return stop1;
}
/**
 * Calls the executor passed into the constructor. This function is called the first time the next method is called on the repeater.
 *
 * Advances state to Started.
 */
function execute(r) {
    if (r.state >= Started) {
        return;
    }
    r.state = Started;
    var push1 = push.bind(null, r);
    var stop1 = createStop(r);
    r.execution = new Promise(function (resolve) { return resolve(r.executor(push1, stop1)); });
    // TODO: We should consider stopping all repeaters when the executor settles.
    r.execution.catch(function () { return stop(r); });
}
var records = new WeakMap();
// NOTE: While repeaters implement and are assignable to the AsyncGenerator interface, and you can use the types interchangeably, we don’t use typescript’s implements syntax here because this would make supporting earlier versions of typescript trickier. This is because TypeScript version 3.6 changed the iterator types by adding the TReturn and TNext type parameters.
var Repeater = /** @class */ (function () {
    function Repeater(executor, buffer) {
        records.set(this, {
            executor: executor,
            buffer: buffer,
            err: undefined,
            state: Initial,
            pushes: [],
            nexts: [],
            pending: undefined,
            execution: undefined,
            onnext: NOOP,
            onstop: NOOP,
        });
    }
    Repeater.prototype.next = function (value) {
        swallow(value);
        var r = records.get(this);
        if (r === undefined) {
            throw new Error("WeakMap error");
        }
        if (r.nexts.length >= MAX_QUEUE_LENGTH) {
            throw new RepeaterOverflowError("No more than " + MAX_QUEUE_LENGTH + " pending calls to next are allowed on a single repeater.");
        }
        if (r.state <= Initial) {
            execute(r);
        }
        r.onnext(value);
        if (typeof r.buffer !== "undefined" && !r.buffer.empty) {
            var result = createIteration(r, r.buffer.remove());
            if (r.pushes.length) {
                var push_2 = r.pushes.shift();
                r.buffer.add(push_2.value);
                r.onnext = push_2.resolve;
            }
            return result;
        }
        else if (r.pushes.length) {
            var push_3 = r.pushes.shift();
            r.onnext = push_3.resolve;
            return createIteration(r, push_3.value);
        }
        else if (r.state >= Stopped) {
            finish(r);
            return createIteration(r, consumeExecution(r));
        }
        return new Promise(function (resolve) { return r.nexts.push({ resolve: resolve, value: value }); });
    };
    Repeater.prototype.return = function (value) {
        swallow(value);
        var r = records.get(this);
        if (r === undefined) {
            throw new Error("WeakMap error");
        }
        finish(r);
        // We override the execution because return should always return the value passed in.
        r.execution = Promise.resolve(r.execution).then(function () { return value; });
        return createIteration(r, consumeExecution(r));
    };
    Repeater.prototype.throw = function (err) {
        var r = records.get(this);
        if (r === undefined) {
            throw new Error("WeakMap error");
        }
        if (r.state <= Initial ||
            r.state >= Stopped ||
            (typeof r.buffer !== "undefined" && !r.buffer.empty)) {
            finish(r);
            // If r.err is already set, that mean the repeater has already produced an error, so we throw that error rather than the error passed in, because doing so might be more informative for the caller.
            if (r.err == null) {
                r.err = err;
            }
            return createIteration(r, consumeExecution(r));
        }
        return this.next(Promise.reject(err));
    };
    Repeater.prototype[Symbol.asyncIterator] = function () {
        return this;
    };
    // TODO: Remove these static methods from the class.
    Repeater.race = race;
    Repeater.merge = merge;
    Repeater.zip = zip;
    Repeater.latest = latest;
    return Repeater;
}());
/*** COMBINATOR FUNCTIONS ***/
// TODO: move these combinators to their own file.
function getIterators(values, options) {
    var e_3, _a;
    var iters = [];
    var _loop_1 = function (value) {
        if (value != null && typeof value[Symbol.asyncIterator] === "function") {
            iters.push(value[Symbol.asyncIterator]());
        }
        else if (value != null && typeof value[Symbol.iterator] === "function") {
            iters.push(value[Symbol.iterator]());
        }
        else {
            iters.push((function valueToAsyncIterator() {
                return __asyncGenerator(this, arguments, function valueToAsyncIterator_1() {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!options.yieldValues) return [3 /*break*/, 3];
                                return [4 /*yield*/, __await(value)];
                            case 1: return [4 /*yield*/, _a.sent()];
                            case 2:
                                _a.sent();
                                _a.label = 3;
                            case 3:
                                if (!options.returnValues) return [3 /*break*/, 5];
                                return [4 /*yield*/, __await(value)];
                            case 4: return [2 /*return*/, _a.sent()];
                            case 5: return [2 /*return*/];
                        }
                    });
                });
            })());
        }
    };
    try {
        for (var values_1 = __values(values), values_1_1 = values_1.next(); !values_1_1.done; values_1_1 = values_1.next()) {
            var value = values_1_1.value;
            _loop_1(value);
        }
    }
    catch (e_3_1) { e_3 = { error: e_3_1 }; }
    finally {
        try {
            if (values_1_1 && !values_1_1.done && (_a = values_1.return)) _a.call(values_1);
        }
        finally { if (e_3) throw e_3.error; }
    }
    return iters;
}
// NOTE: whenever you see any variables called `advance` or `advances`, know that it is a hack to get around the fact that `Promise.race` leaks memory. These variables are intended to be set to the resolve function of a promise which is constructed and awaited as an alternative to Promise.race. For more information, see this comment in the Node.js issue tracker: https://github.com/nodejs/node/issues/17469#issuecomment-685216777.
function race(contenders) {
    var _this = this;
    var iters = getIterators(contenders, { returnValues: true });
    return new Repeater(function (push, stop) { return __awaiter(_this, void 0, void 0, function () {
        var advance, stopped, finalIteration, iteration, i_1, _loop_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!iters.length) {
                        stop();
                        return [2 /*return*/];
                    }
                    stopped = false;
                    stop.then(function () {
                        advance();
                        stopped = true;
                    });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, , 5, 7]);
                    iteration = void 0;
                    i_1 = 0;
                    _loop_2 = function () {
                        var j, iters_1, iters_1_1, iter;
                        var e_4, _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    j = i_1;
                                    try {
                                        for (iters_1 = (e_4 = void 0, __values(iters)), iters_1_1 = iters_1.next(); !iters_1_1.done; iters_1_1 = iters_1.next()) {
                                            iter = iters_1_1.value;
                                            Promise.resolve(iter.next()).then(function (iteration) {
                                                if (iteration.done) {
                                                    stop();
                                                    if (finalIteration === undefined) {
                                                        finalIteration = iteration;
                                                    }
                                                }
                                                else if (i_1 === j) {
                                                    // This iterator has won, advance i and resolve the promise.
                                                    i_1++;
                                                    advance(iteration);
                                                }
                                            }, function (err) { return stop(err); });
                                        }
                                    }
                                    catch (e_4_1) { e_4 = { error: e_4_1 }; }
                                    finally {
                                        try {
                                            if (iters_1_1 && !iters_1_1.done && (_a = iters_1.return)) _a.call(iters_1);
                                        }
                                        finally { if (e_4) throw e_4.error; }
                                    }
                                    return [4 /*yield*/, new Promise(function (resolve) { return (advance = resolve); })];
                                case 1:
                                    iteration = _b.sent();
                                    if (!(iteration !== undefined)) return [3 /*break*/, 3];
                                    return [4 /*yield*/, push(iteration.value)];
                                case 2:
                                    _b.sent();
                                    _b.label = 3;
                                case 3: return [2 /*return*/];
                            }
                        });
                    };
                    _a.label = 2;
                case 2:
                    if (!!stopped) return [3 /*break*/, 4];
                    return [5 /*yield**/, _loop_2()];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 2];
                case 4: return [2 /*return*/, finalIteration && finalIteration.value];
                case 5:
                    stop();
                    return [4 /*yield*/, Promise.race(iters.map(function (iter) { return iter.return && iter.return(); }))];
                case 6:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    }); });
}
function merge(contenders) {
    var _this = this;
    var iters = getIterators(contenders, { yieldValues: true });
    return new Repeater(function (push, stop) { return __awaiter(_this, void 0, void 0, function () {
        var advances, stopped, finalIteration;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!iters.length) {
                        stop();
                        return [2 /*return*/];
                    }
                    advances = [];
                    stopped = false;
                    stop.then(function () {
                        var e_5, _a;
                        stopped = true;
                        try {
                            for (var advances_1 = __values(advances), advances_1_1 = advances_1.next(); !advances_1_1.done; advances_1_1 = advances_1.next()) {
                                var advance = advances_1_1.value;
                                advance();
                            }
                        }
                        catch (e_5_1) { e_5 = { error: e_5_1 }; }
                        finally {
                            try {
                                if (advances_1_1 && !advances_1_1.done && (_a = advances_1.return)) _a.call(advances_1);
                            }
                            finally { if (e_5) throw e_5.error; }
                        }
                    });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, , 3, 4]);
                    return [4 /*yield*/, Promise.all(iters.map(function (iter, i) { return __awaiter(_this, void 0, void 0, function () {
                            var iteration, _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        _b.trys.push([0, , 6, 9]);
                                        _b.label = 1;
                                    case 1:
                                        if (!!stopped) return [3 /*break*/, 5];
                                        Promise.resolve(iter.next()).then(function (iteration) { return advances[i](iteration); }, function (err) { return stop(err); });
                                        return [4 /*yield*/, new Promise(function (resolve) {
                                                advances[i] = resolve;
                                            })];
                                    case 2:
                                        iteration = _b.sent();
                                        if (!(iteration !== undefined)) return [3 /*break*/, 4];
                                        if (iteration.done) {
                                            finalIteration = iteration;
                                            return [2 /*return*/];
                                        }
                                        return [4 /*yield*/, push(iteration.value)];
                                    case 3:
                                        _b.sent();
                                        _b.label = 4;
                                    case 4: return [3 /*break*/, 1];
                                    case 5: return [3 /*break*/, 9];
                                    case 6:
                                        _a = iter.return;
                                        if (!_a) return [3 /*break*/, 8];
                                        return [4 /*yield*/, iter.return()];
                                    case 7:
                                        _a = (_b.sent());
                                        _b.label = 8;
                                    case 8:
                                        return [7 /*endfinally*/];
                                    case 9: return [2 /*return*/];
                                }
                            });
                        }); }))];
                case 2:
                    _a.sent();
                    return [2 /*return*/, finalIteration && finalIteration.value];
                case 3:
                    stop();
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); });
}
function zip(contenders) {
    var _this = this;
    var iters = getIterators(contenders, { returnValues: true });
    return new Repeater(function (push, stop) { return __awaiter(_this, void 0, void 0, function () {
        var advance, stopped, iterations, values;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!iters.length) {
                        stop();
                        return [2 /*return*/, []];
                    }
                    stopped = false;
                    stop.then(function () {
                        advance();
                        stopped = true;
                    });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, , 6, 8]);
                    _a.label = 2;
                case 2:
                    if (!!stopped) return [3 /*break*/, 5];
                    Promise.all(iters.map(function (iter) { return iter.next(); })).then(function (iterations) { return advance(iterations); }, function (err) { return stop(err); });
                    return [4 /*yield*/, new Promise(function (resolve) { return (advance = resolve); })];
                case 3:
                    iterations = _a.sent();
                    if (iterations === undefined) {
                        return [2 /*return*/];
                    }
                    values = iterations.map(function (iteration) { return iteration.value; });
                    if (iterations.some(function (iteration) { return iteration.done; })) {
                        return [2 /*return*/, values];
                    }
                    return [4 /*yield*/, push(values)];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 2];
                case 5: return [3 /*break*/, 8];
                case 6:
                    stop();
                    return [4 /*yield*/, Promise.all(iters.map(function (iter) { return iter.return && iter.return(); }))];
                case 7:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    }); });
}
function latest(contenders) {
    var _this = this;
    var iters = getIterators(contenders, {
        yieldValues: true,
        returnValues: true,
    });
    return new Repeater(function (push, stop) { return __awaiter(_this, void 0, void 0, function () {
        var advance, advances, stopped, iterations_1, values_2;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!iters.length) {
                        stop();
                        return [2 /*return*/, []];
                    }
                    advances = [];
                    stopped = false;
                    stop.then(function () {
                        var e_6, _a;
                        advance();
                        try {
                            for (var advances_2 = __values(advances), advances_2_1 = advances_2.next(); !advances_2_1.done; advances_2_1 = advances_2.next()) {
                                var advance1 = advances_2_1.value;
                                advance1();
                            }
                        }
                        catch (e_6_1) { e_6 = { error: e_6_1 }; }
                        finally {
                            try {
                                if (advances_2_1 && !advances_2_1.done && (_a = advances_2.return)) _a.call(advances_2);
                            }
                            finally { if (e_6) throw e_6.error; }
                        }
                        stopped = true;
                    });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, , 5, 7]);
                    Promise.all(iters.map(function (iter) { return iter.next(); })).then(function (iterations) { return advance(iterations); }, function (err) { return stop(err); });
                    return [4 /*yield*/, new Promise(function (resolve) { return (advance = resolve); })];
                case 2:
                    iterations_1 = _a.sent();
                    if (iterations_1 === undefined) {
                        return [2 /*return*/];
                    }
                    values_2 = iterations_1.map(function (iteration) { return iteration.value; });
                    if (iterations_1.every(function (iteration) { return iteration.done; })) {
                        return [2 /*return*/, values_2];
                    }
                    // We continuously yield and mutate the same values array so we shallow copy it each time it is pushed.
                    return [4 /*yield*/, push(values_2.slice())];
                case 3:
                    // We continuously yield and mutate the same values array so we shallow copy it each time it is pushed.
                    _a.sent();
                    return [4 /*yield*/, Promise.all(iters.map(function (iter, i) { return __awaiter(_this, void 0, void 0, function () {
                            var iteration;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (iterations_1[i].done) {
                                            return [2 /*return*/, iterations_1[i].value];
                                        }
                                        _a.label = 1;
                                    case 1:
                                        if (!!stopped) return [3 /*break*/, 4];
                                        Promise.resolve(iter.next()).then(function (iteration) { return advances[i](iteration); }, function (err) { return stop(err); });
                                        return [4 /*yield*/, new Promise(function (resolve) { return (advances[i] = resolve); })];
                                    case 2:
                                        iteration = _a.sent();
                                        if (iteration === undefined) {
                                            return [2 /*return*/, iterations_1[i].value];
                                        }
                                        else if (iteration.done) {
                                            return [2 /*return*/, iteration.value];
                                        }
                                        values_2[i] = iteration.value;
                                        return [4 /*yield*/, push(values_2.slice())];
                                    case 3:
                                        _a.sent();
                                        return [3 /*break*/, 1];
                                    case 4: return [2 /*return*/];
                                }
                            });
                        }); }))];
                case 4: return [2 /*return*/, _a.sent()];
                case 5:
                    stop();
                    return [4 /*yield*/, Promise.all(iters.map(function (iter) { return iter.return && iter.return(); }))];
                case 6:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    }); });
}

exports.DroppingBuffer = DroppingBuffer;
exports.FixedBuffer = FixedBuffer;
exports.MAX_QUEUE_LENGTH = MAX_QUEUE_LENGTH;
exports.Repeater = Repeater;
exports.RepeaterOverflowError = RepeaterOverflowError;
exports.SlidingBuffer = SlidingBuffer;
//# sourceMappingURL=repeater.js.map
