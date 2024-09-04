'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var globals = require('../../utilities/globals');
var equality = require('@wry/equality');
var core = require('../../link/core');
var utilities = require('../../utilities');
var core$1 = require('../../core');
var cache = require('../../cache');

function requestToKey(request, addTypename) {
    var queryString = request.query &&
        utilities.print(addTypename ? utilities.addTypenameToDocument(request.query) : request.query);
    var requestKey = { query: queryString };
    return JSON.stringify(requestKey);
}
var MockLink =  (function (_super) {
    tslib.__extends(MockLink, _super);
    function MockLink(mockedResponses, addTypename, options) {
        if (addTypename === void 0) { addTypename = true; }
        if (options === void 0) { options = Object.create(null); }
        var _a;
        var _this = _super.call(this) || this;
        _this.addTypename = true;
        _this.showWarnings = true;
        _this.mockedResponsesByKey = {};
        _this.addTypename = addTypename;
        _this.showWarnings = (_a = options.showWarnings) !== null && _a !== void 0 ? _a : true;
        if (mockedResponses) {
            mockedResponses.forEach(function (mockedResponse) {
                _this.addMockedResponse(mockedResponse);
            });
        }
        return _this;
    }
    MockLink.prototype.addMockedResponse = function (mockedResponse) {
        var normalizedMockedResponse = this.normalizeMockedResponse(mockedResponse);
        var key = requestToKey(normalizedMockedResponse.request, this.addTypename);
        var mockedResponses = this.mockedResponsesByKey[key];
        if (!mockedResponses) {
            mockedResponses = [];
            this.mockedResponsesByKey[key] = mockedResponses;
        }
        mockedResponses.push(normalizedMockedResponse);
    };
    MockLink.prototype.request = function (operation) {
        var _this = this;
        var _a;
        this.operation = operation;
        var key = requestToKey(operation, this.addTypename);
        var unmatchedVars = [];
        var requestVariables = operation.variables || {};
        var mockedResponses = this.mockedResponsesByKey[key];
        var responseIndex = mockedResponses ?
            mockedResponses.findIndex(function (res, index) {
                var mockedResponseVars = res.request.variables || {};
                if (equality.equal(requestVariables, mockedResponseVars)) {
                    return true;
                }
                if (res.variableMatcher && res.variableMatcher(operation.variables)) {
                    return true;
                }
                unmatchedVars.push(mockedResponseVars);
                return false;
            })
            : -1;
        var response = responseIndex >= 0 ? mockedResponses[responseIndex] : void 0;
        var delay = (response === null || response === void 0 ? void 0 : response.delay) === Infinity ? 0 : (_a = response === null || response === void 0 ? void 0 : response.delay) !== null && _a !== void 0 ? _a : 0;
        var configError;
        if (!response) {
            configError = new Error("No more mocked responses for the query: ".concat(utilities.print(operation.query), "\nExpected variables: ").concat(utilities.stringifyForDisplay(operation.variables), "\n").concat(unmatchedVars.length > 0 ?
                "\nFailed to match ".concat(unmatchedVars.length, " mock").concat(unmatchedVars.length === 1 ? "" : "s", " for this query. The mocked response had the following variables:\n").concat(unmatchedVars.map(function (d) { return "  ".concat(utilities.stringifyForDisplay(d)); }).join("\n"), "\n")
                : ""));
            if (this.showWarnings) {
                console.warn(configError.message +
                    "\nThis typically indicates a configuration error in your mocks " +
                    "setup, usually due to a typo or mismatched variable.");
            }
        }
        else {
            if (response.maxUsageCount && response.maxUsageCount > 1) {
                response.maxUsageCount--;
            }
            else {
                mockedResponses.splice(responseIndex, 1);
            }
            var newData = response.newData;
            if (newData) {
                response.result = newData(operation.variables);
                mockedResponses.push(response);
            }
            if (!response.result && !response.error && response.delay !== Infinity) {
                configError = new Error("Mocked response should contain either `result`, `error` or a `delay` of `Infinity`: ".concat(key));
            }
        }
        return new utilities.Observable(function (observer) {
            var timer = setTimeout(function () {
                if (configError) {
                    try {
                        if (_this.onError(configError, observer) !== false) {
                            throw configError;
                        }
                    }
                    catch (error) {
                        observer.error(error);
                    }
                }
                else if (response && response.delay !== Infinity) {
                    if (response.error) {
                        observer.error(response.error);
                    }
                    else {
                        if (response.result) {
                            observer.next(typeof response.result === "function" ?
                                response.result(operation.variables)
                                : response.result);
                        }
                        observer.complete();
                    }
                }
            }, delay);
            return function () {
                clearTimeout(timer);
            };
        });
    };
    MockLink.prototype.normalizeMockedResponse = function (mockedResponse) {
        var _a;
        var newMockedResponse = utilities.cloneDeep(mockedResponse);
        var queryWithoutClientOnlyDirectives = utilities.removeDirectivesFromDocument([{ name: "connection" }, { name: "nonreactive" }], utilities.checkDocument(newMockedResponse.request.query));
        globals.invariant(queryWithoutClientOnlyDirectives, 65);
        newMockedResponse.request.query = queryWithoutClientOnlyDirectives;
        var query = utilities.removeClientSetsFromDocument(newMockedResponse.request.query);
        if (query) {
            newMockedResponse.request.query = query;
        }
        mockedResponse.maxUsageCount = (_a = mockedResponse.maxUsageCount) !== null && _a !== void 0 ? _a : 1;
        globals.invariant(mockedResponse.maxUsageCount > 0, 66, mockedResponse.maxUsageCount);
        this.normalizeVariableMatching(newMockedResponse);
        return newMockedResponse;
    };
    MockLink.prototype.normalizeVariableMatching = function (mockedResponse) {
        var variables = mockedResponse.request.variables;
        if (mockedResponse.variableMatcher && variables) {
            throw new Error("Mocked response should contain either variableMatcher or request.variables");
        }
        if (!mockedResponse.variableMatcher) {
            mockedResponse.variableMatcher = function (vars) {
                var requestVariables = vars || {};
                var mockedResponseVariables = variables || {};
                return equality.equal(requestVariables, mockedResponseVariables);
            };
        }
    };
    return MockLink;
}(core.ApolloLink));
function mockSingleLink() {
    var mockedResponses = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        mockedResponses[_i] = arguments[_i];
    }
    var maybeTypename = mockedResponses[mockedResponses.length - 1];
    var mocks = mockedResponses.slice(0, mockedResponses.length - 1);
    if (typeof maybeTypename !== "boolean") {
        mocks = mockedResponses;
        maybeTypename = true;
    }
    return new MockLink(mocks, maybeTypename);
}

var MockSubscriptionLink =  (function (_super) {
    tslib.__extends(MockSubscriptionLink, _super);
    function MockSubscriptionLink() {
        var _this = _super.call(this) || this;
        _this.unsubscribers = [];
        _this.setups = [];
        _this.observers = [];
        return _this;
    }
    MockSubscriptionLink.prototype.request = function (operation) {
        var _this = this;
        this.operation = operation;
        return new utilities.Observable(function (observer) {
            _this.setups.forEach(function (x) { return x(); });
            _this.observers.push(observer);
            return function () {
                _this.unsubscribers.forEach(function (x) { return x(); });
            };
        });
    };
    MockSubscriptionLink.prototype.simulateResult = function (result, complete) {
        var _this = this;
        if (complete === void 0) { complete = false; }
        setTimeout(function () {
            var observers = _this.observers;
            if (!observers.length)
                throw new Error("subscription torn down");
            observers.forEach(function (observer) {
                if (result.result && observer.next)
                    observer.next(result.result);
                if (result.error && observer.error)
                    observer.error(result.error);
                if (complete && observer.complete)
                    observer.complete();
            });
        }, result.delay || 0);
    };
    MockSubscriptionLink.prototype.simulateComplete = function () {
        var observers = this.observers;
        if (!observers.length)
            throw new Error("subscription torn down");
        observers.forEach(function (observer) {
            if (observer.complete)
                observer.complete();
        });
    };
    MockSubscriptionLink.prototype.onSetup = function (listener) {
        this.setups = this.setups.concat([listener]);
    };
    MockSubscriptionLink.prototype.onUnsubscribe = function (listener) {
        this.unsubscribers = this.unsubscribers.concat([listener]);
    };
    return MockSubscriptionLink;
}(core.ApolloLink));
function mockObservableLink() {
    return new MockSubscriptionLink();
}

function createMockClient(data, query, variables) {
    if (variables === void 0) { variables = {}; }
    return new core$1.ApolloClient({
        link: mockSingleLink({
            request: { query: query, variables: variables },
            result: { data: data },
        }).setOnError(function (error) {
            throw error;
        }),
        cache: new cache.InMemoryCache({ addTypename: false }),
    });
}

function subscribeAndCount(reject, observable, cb) {
    var queue = Promise.resolve();
    var handleCount = 0;
    var subscription = utilities.asyncMap(observable, function (result) {
        return (queue = queue
            .then(function () {
            return cb(++handleCount, result);
        })
            .catch(error));
    }).subscribe({ error: error });
    function error(e) {
        subscription.unsubscribe();
        reject(e);
    }
    return subscription;
}

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
var itAsync = Object.assign(function () {
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

function wait(ms) {
    return tslib.__awaiter(this, void 0, void 0, function () {
        return tslib.__generator(this, function (_a) {
            return [2 , new Promise(function (resolve) { return setTimeout(resolve, ms); })];
        });
    });
}
function tick() {
    return tslib.__awaiter(this, void 0, void 0, function () {
        return tslib.__generator(this, function (_a) {
            return [2 , wait(0)];
        });
    });
}

function wrapTestFunction(fn, consoleMethodName) {
    return function () {
        var _this = this;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var spy = jest.spyOn(console, consoleMethodName);
        spy.mockImplementation(function () { });
        return new Promise(function (resolve) {
            resolve(fn === null || fn === void 0 ? void 0 : fn.apply(_this, args));
        }).finally(function () {
            expect(spy).toMatchSnapshot();
            spy.mockReset();
        });
    };
}
function withErrorSpy(it) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    args[1] = wrapTestFunction(args[1], "error");
    return it.apply(void 0, args);
}
function withWarningSpy(it) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    args[1] = wrapTestFunction(args[1], "warn");
    return it.apply(void 0, args);
}
function withLogSpy(it) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    args[1] = wrapTestFunction(args[1], "log");
    return it.apply(void 0, args);
}

exports.MockLink = MockLink;
exports.MockSubscriptionLink = MockSubscriptionLink;
exports.createMockClient = createMockClient;
exports.itAsync = itAsync;
exports.mockObservableLink = mockObservableLink;
exports.mockSingleLink = mockSingleLink;
exports.subscribeAndCount = subscribeAndCount;
exports.tick = tick;
exports.wait = wait;
exports.withErrorSpy = withErrorSpy;
exports.withLogSpy = withLogSpy;
exports.withWarningSpy = withWarningSpy;
//# sourceMappingURL=core.cjs.map
