import { __extends } from "tslib";
import { invariant } from "../../../utilities/globals/index.js";
import { equal } from "@wry/equality";
import { ApolloLink } from "../../../link/core/index.js";
import { Observable, addTypenameToDocument, removeClientSetsFromDocument, cloneDeep, stringifyForDisplay, print, removeDirectivesFromDocument, checkDocument, } from "../../../utilities/index.js";
function requestToKey(request, addTypename) {
    var queryString = request.query &&
        print(addTypename ? addTypenameToDocument(request.query) : request.query);
    var requestKey = { query: queryString };
    return JSON.stringify(requestKey);
}
var MockLink = /** @class */ (function (_super) {
    __extends(MockLink, _super);
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
                if (equal(requestVariables, mockedResponseVars)) {
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
        // There have been platform- and engine-dependent differences with
        // setInterval(fn, Infinity), so we pass 0 instead (but detect
        // Infinity where we call observer.error or observer.next to pend
        // indefinitely in those cases.)
        var delay = (response === null || response === void 0 ? void 0 : response.delay) === Infinity ? 0 : (_a = response === null || response === void 0 ? void 0 : response.delay) !== null && _a !== void 0 ? _a : 0;
        var configError;
        if (!response) {
            configError = new Error("No more mocked responses for the query: ".concat(print(operation.query), "\nExpected variables: ").concat(stringifyForDisplay(operation.variables), "\n").concat(unmatchedVars.length > 0 ?
                "\nFailed to match ".concat(unmatchedVars.length, " mock").concat(unmatchedVars.length === 1 ? "" : "s", " for this query. The mocked response had the following variables:\n").concat(unmatchedVars.map(function (d) { return "  ".concat(stringifyForDisplay(d)); }).join("\n"), "\n")
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
        return new Observable(function (observer) {
            var timer = setTimeout(function () {
                if (configError) {
                    try {
                        // The onError function can return false to indicate that
                        // configError need not be passed to observer.error. For
                        // example, the default implementation of onError calls
                        // observer.error(configError) and then returns false to
                        // prevent this extra (harmless) observer.error call.
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
        var newMockedResponse = cloneDeep(mockedResponse);
        var queryWithoutClientOnlyDirectives = removeDirectivesFromDocument([{ name: "connection" }, { name: "nonreactive" }], checkDocument(newMockedResponse.request.query));
        invariant(queryWithoutClientOnlyDirectives, 65);
        newMockedResponse.request.query = queryWithoutClientOnlyDirectives;
        var query = removeClientSetsFromDocument(newMockedResponse.request.query);
        if (query) {
            newMockedResponse.request.query = query;
        }
        mockedResponse.maxUsageCount = (_a = mockedResponse.maxUsageCount) !== null && _a !== void 0 ? _a : 1;
        invariant(mockedResponse.maxUsageCount > 0, 66, mockedResponse.maxUsageCount);
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
                return equal(requestVariables, mockedResponseVariables);
            };
        }
    };
    return MockLink;
}(ApolloLink));
export { MockLink };
// Pass in multiple mocked responses, so that you can test flows that end up
// making multiple queries to the server.
// NOTE: The last arg can optionally be an `addTypename` arg.
export function mockSingleLink() {
    var mockedResponses = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        mockedResponses[_i] = arguments[_i];
    }
    // To pull off the potential typename. If this isn't a boolean, we'll just
    // set it true later.
    var maybeTypename = mockedResponses[mockedResponses.length - 1];
    var mocks = mockedResponses.slice(0, mockedResponses.length - 1);
    if (typeof maybeTypename !== "boolean") {
        mocks = mockedResponses;
        maybeTypename = true;
    }
    return new MockLink(mocks, maybeTypename);
}
//# sourceMappingURL=mockLink.js.map