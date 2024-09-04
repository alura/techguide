"use strict";

if (typeof window === "undefined") {
    window = {};
}

var logMethods = [
    "trace",
    "debug",
    "info",
    "warn",
    "error"
];

define(function () {
    function getStorageKey(loggerName) {
        var key = "loglevel";
        if (loggerName) {
            key += ":" + loggerName;
        }
        return key;
    }

    var self = {};

    // Jasmine matcher to check the log level of a log object. Usage:
    //   expect(log).toBeAtLevel("DEBUG");
    self.toBeAtLevel = function toBeAtLevel() {
        return {
            compare: function (log, level) {
                var expectedWorkingCalls = log.levels.SILENT - log.levels[level.toUpperCase()];
                var realLogMethod = window.console.log;
                var priorCalls = realLogMethod.calls.count();

                for (var ii = 0; ii < logMethods.length; ii++) {
                    var methodName = logMethods[ii];
                    log[methodName](methodName);
                }

                var actualCalls = realLogMethod.calls.count() - priorCalls;
                var actualLevel = logMethods[log.levels.SILENT - actualCalls];
                return {
                    pass: actualCalls === expectedWorkingCalls,
                    message: "Expected level to be '" + level + "' but found '" + actualLevel + "'"
                };
            }
        };
    };

    self.isCookieStorageAvailable = function isCookieStorageAvailable() {
        if (window && window.document && window.document.cookie != null) {
            // We need to check not just that the cookie objects are available, but that they work, because
            // if we run from file:// URLs they appear present but are non-functional
            window.document.cookie = "test=hi;";

            var result = window.document.cookie.indexOf('test=hi') !== -1;
            window.document.cookie = "test=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";

            return result;
        } else {
            return false;
        }
    };

    self.isLocalStorageAvailable = function isLocalStorageAvailable() {
        try {
            return !!window.localStorage;
        } catch (e){
            return false;
        }
    };

    self.isAnyLevelStoragePossible = function isAnyLevelStoragePossible() {
        return self.isCookieStorageAvailable() || self.isLocalStorageAvailable();
    };

    // Check whether a cookie is storing the given level for the given logger
    // name. If level is `undefined`, this will check that it is *not* stored.
    function isLevelInCookie(level, name) {
        level = level === undefined ? undefined : level.toUpperCase();
        var storageKey = encodeURIComponent(getStorageKey(name));

        if(level === undefined) {
            return window.document.cookie.indexOf(storageKey + "=") === -1;
        } else if (window.document.cookie.indexOf(storageKey + "=" + level) !== -1) {
            return true;
        } else {
            return false;
        }
    }

    // Jasmine matcher to check whether the given log level is in a cookie.
    // Usage: `expect("DEBUG").toBeTheLevelStoredByCookie("name-of-logger")`
    self.toBeTheLevelStoredByCookie = function toBeTheLevelStoredByCookie() {
        return {
            compare: function (actual, name) {
                return {
                    pass: isLevelInCookie(actual, name),
                    message: "Level '" + actual + "' for the " + (name || "default") + " logger is not stored in a cookie"
                };
            }
        };
    };

    // Check whether local storage is storing the given level for the given
    // logger name. If level is `undefined`, this will check that it is *not*
    // stored.
    function isLevelInLocalStorage(level, name) {
        level = level === undefined ? undefined : level.toUpperCase();

        if (window.localStorage[getStorageKey(name)] === level) {
            return true;
        }

        return false;
    }

    // Jasmine matcher to check whether the given log level is in local storage.
    // Usage: `expect("DEBUG").toBeTheLevelStoredByLocalStorage("name-of-logger")`
    self.toBeTheLevelStoredByLocalStorage = function toBeTheLevelStoredByLocalStorage() {
        return {
            compare: function (actual, name) {
                return {
                    pass: isLevelInLocalStorage(actual, name),
                    message: "Level '" + actual + "' for the " + (name || "default") + " logger is not stored in local storage"
                };
            }
        };
    };

    // Jasmine matcher to check whether a given level has been persisted.
    self.toBeTheStoredLevel = function toBeTheStoredLevel() {
        return {
            compare: function (actual, name) {
                return {
                    pass: isLevelInLocalStorage(actual, name) ||
                          isLevelInCookie(actual, name),
                    message: "Level '" + actual + "' is not persisted for the " + (name || "default") + " logger"
                };
            }
        };
    };

    self.setCookieStoredLevel = function setCookieStoredLevel(level, name) {
        window.document.cookie =
            encodeURIComponent(getStorageKey(name)) + "=" +
            level.toUpperCase() + ";";
    };

    self.setLocalStorageStoredLevel = function setLocalStorageStoredLevel(level, name) {
        window.localStorage[getStorageKey(name)] = level.toUpperCase();
    };

    self.setStoredLevel = function setStoredLevel(level, name) {
        if (self.isCookieStorageAvailable()) {
            self.setCookieStoredLevel(level, name);
        }
        if (self.isLocalStorageAvailable()) {
            self.setLocalStorageStoredLevel(level, name);
        }
    };

    self.clearStoredLevels = function clearStoredLevels() {
        if (self.isLocalStorageAvailable()) {
            window.localStorage.clear();
        }
        if (self.isCookieStorageAvailable()) {
            var storedKeys = window.document.cookie.match(/(?:^|;\s)(loglevel(%3a\w+)?)(?=\=)/ig);
            if (storedKeys) {
                for (var i = 0; i < storedKeys.length; i++) {
                    window.document.cookie = storedKeys[i] + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
                }
            }
        }
    };

    self.describeIf = function describeIf(condition, name, test) {
        var env = jasmine.getEnv();
        var implementation = condition ? env.describe : env.xdescribe;
        return implementation(name, test);
    };

    self.itIf = function itIf(condition, name, test) {
        var env = jasmine.getEnv();
        var implementation = condition ? env.it : env.xit;
        return implementation(name, test);
    };

    // Forcibly reloads loglevel and asynchronously hands the resulting log to
    // a callback.
    self.withFreshLog = function withFreshLog(toRun, onError) {
        require.undef("lib/loglevel");

        require(['lib/loglevel'], function(log) {
            toRun(log);
        });
    };

    // Wraps Jasmine's `it(name, test)` call to reload the loglevel module
    // for the given test. An optional boolean first argument causes this to
    // behave like `itIf()` instead of `it()`.
    //
    // Normal usage:
    //   itWithFreshLog("test name", function(log) {
    //       // test code
    //    });
    //
    // Conditional usage:
    //   itWithFreshLog(shouldRunTest(), "test name", function(log) {
    //       // test code
    //    });
    self.itWithFreshLog = function itWithFreshLog(condition, name, test) {
        if (!test) {
            test = name;
            name = condition;
            condition = true;
        }

        self.itIf(condition, name, function(done) {
            function runTest (log) {
                if (test.length > 1) {
                    return test(log, done);
                } else {
                    try {
                        test(log);
                        done();
                    } catch (error) {
                        done.fail(error);
                    }
                }
            }
            self.withFreshLog(runTest);
        });
    };

    return self;
});
