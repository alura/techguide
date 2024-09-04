"use strict";

define(['test/test-helpers'], function(testHelpers) {
    var describeIf = testHelpers.describeIf;
    var it = testHelpers.itWithFreshLog;

    var originalConsole = window.console;

    describe("Multiple logger instances tests:", function() {

        describe("log.getLogger()", function() {
            it("returns a new logger that is not the default one", function(log) {
                var newLogger = log.getLogger("newLogger");
                expect(newLogger).not.toEqual(log);
                expect(newLogger.trace).toBeDefined();
                expect(newLogger.debug).toBeDefined();
                expect(newLogger.info).toBeDefined();
                expect(newLogger.warn).toBeDefined();
                expect(newLogger.error).toBeDefined();
                expect(newLogger.setLevel).toBeDefined();
                expect(newLogger.setDefaultLevel).toBeDefined();
                expect(newLogger.enableAll).toBeDefined();
                expect(newLogger.disableAll).toBeDefined();
                expect(newLogger.methodFactory).toBeDefined();
            });

            it("returns loggers without `getLogger()` and `noConflict()`", function(log) {
                var newLogger = log.getLogger("newLogger");
                expect(newLogger.getLogger).toBeUndefined();
                expect(newLogger.noConflict).toBeUndefined();
            });

            it("returns the same instance when called repeatedly with the same name", function(log) {
                var logger1 = log.getLogger("newLogger");
                var logger2 = log.getLogger("newLogger");

                expect(logger1).toEqual(logger2);
            });

            it("should throw if called with no name", function(log) {
                expect(function() {
                  log.getLogger();
                }).toThrow();
            });

            it("should throw if called with empty string for name", function(log) {
                expect(function() {
                  log.getLogger("");
                }).toThrow();
            });

            it("should throw if called with a non-string name", function(log) {
                expect(function() { log.getLogger(true); }).toThrow();
                expect(function() { log.getLogger({}); }).toThrow();
                expect(function() { log.getLogger([]); }).toThrow();
                expect(function() { log.getLogger(10); }).toThrow();
                expect(function() { log.getLogger(function(){}); }).toThrow();
                expect(function() { log.getLogger(null); }).toThrow();
                expect(function() { log.getLogger(undefined); }).toThrow();
            });

            // NOTE: this test is the same as the similarly-named test in
            // `node-integration.js` (which only runs in Node.js). If making
            // changes here, be sure to adjust that test as well.
            it(typeof Symbol !== "undefined", "supports using symbols as names", function(log) {
                var s1 = Symbol("a-symbol");
                var s2 = Symbol("a-symbol");

                var logger1 = log.getLogger(s1);
                var defaultLevel = logger1.getLevel();
                logger1.setLevel(log.levels.TRACE);

                var logger2 = log.getLogger(s2);

                // Should be unequal: same name, but different symbol instances
                expect(logger1).not.toEqual(logger2);
                expect(logger2.getLevel()).toEqual(defaultLevel);
            });
        });

        describe("inheritance", function() {
            beforeEach(function() {
                window.console = {"log" : jasmine.createSpy("console.log")};
                jasmine.addMatchers({
                    "toBeAtLevel" : testHelpers.toBeAtLevel
                });
                testHelpers.clearStoredLevels();
            });

            afterEach(function() {
                window.console = originalConsole;
            });

            it("loggers are created with the same level as the default logger", function(log) {
              log.setLevel("ERROR");
              var newLogger = log.getLogger("newLogger");
              expect(newLogger).toBeAtLevel("error");
            });

            it("if a logger's level is persisted, it uses that level rather than the default logger's level", function(log) {
                testHelpers.setStoredLevel("error", "newLogger");
                log.setLevel("TRACE");
                var newLogger = log.getLogger("newLogger");
                expect(newLogger).toBeAtLevel("error");
            });

            it("other loggers do not change when the default logger's level is changed", function(log) {
                log.setLevel("TRACE");
                var newLogger = log.getLogger("newLogger");
                log.setLevel("ERROR");
                expect(newLogger).toBeAtLevel("TRACE");
                expect(log.getLogger("newLogger")).toBeAtLevel("TRACE");
            });

            it("loggers are created with the same methodFactory as the default logger", function(log) {
                log.methodFactory = function(methodName, level) {
                  return function() {};
                };

                var newLogger = log.getLogger("newLogger");
                expect(newLogger.methodFactory).toEqual(log.methodFactory);
            });

            it("loggers have independent method factories", function(log) {
                var log1 = log.getLogger('logger1');
                var log2 = log.getLogger('logger2');

                var log1Spy = jasmine.createSpy('log1spy');
                log1.methodFactory = function(methodName, level) {
                    return log1Spy;
                };
                log1.setLevel(log1.getLevel());

                var log2Spy = jasmine.createSpy('log2spy');
                log2.methodFactory = function(methodName, level) {
                    return log2Spy;
                };
                log2.setLevel(log2.getLevel());

                log1.error('test1');
                log2.error('test2');

                expect(log1Spy).toHaveBeenCalledWith("test1");
                expect(log2Spy).toHaveBeenCalledWith("test2");
            });

            it("new loggers correctly inherit a logging level of `0`", function(log) {
              log.setLevel(0);
              var newLogger = log.getLogger("newLogger");
              expect(newLogger).toBeAtLevel("trace");
            });
        });

        describe("logger.resetLevel()", function() {
            beforeEach(function() {
                window.console = {"log" : jasmine.createSpy("console.log")};
                jasmine.addMatchers({
                    "toBeAtLevel" : testHelpers.toBeAtLevel
                });
                testHelpers.clearStoredLevels();
            });

            afterEach(function() {
                window.console = originalConsole;
            });

            it("resets to the inherited level if no local level was set", function(log) {
                testHelpers.setStoredLevel("ERROR", "newLogger");

                log.setLevel("TRACE");
                var newLogger = log.getLogger("newLogger");
                expect(newLogger).toBeAtLevel("ERROR");

                newLogger.resetLevel();
                expect(newLogger).toBeAtLevel("TRACE");

                // resetLevel() should not have broken inheritance.
                log.setLevel("DEBUG");
                log.rebuild();
                expect(newLogger).toBeAtLevel("DEBUG");
            });

            it("resets to the inherited level if no default level was set", function(log) {
                log.setLevel("TRACE");
                var newLogger = log.getLogger("newLogger");
                expect(newLogger).toBeAtLevel("TRACE");

                newLogger.setLevel("ERROR");
                expect(newLogger).toBeAtLevel("ERROR");

                newLogger.resetLevel();
                expect(newLogger).toBeAtLevel("TRACE");

                // resetLevel() should not have broken inheritance.
                log.setLevel("DEBUG");
                log.rebuild();
                expect(newLogger).toBeAtLevel("DEBUG");
            });

            it("resets to the default level if one was set", function(log) {
                testHelpers.setStoredLevel("ERROR", "newLogger");

                log.setLevel("TRACE");
                var newLogger = log.getLogger("newLogger");
                newLogger.setDefaultLevel("INFO");
                expect(newLogger).toBeAtLevel("ERROR");

                newLogger.resetLevel();
                expect(newLogger).toBeAtLevel("INFO");

                // resetLevel() should not have caused inheritance to start.
                log.setLevel("DEBUG");
                log.rebuild();
                expect(newLogger).toBeAtLevel("INFO");
            });
        });

        describe("logger.rebuild()", function() {
            beforeEach(function() {
                window.console = {"log" : jasmine.createSpy("console.log")};
                jasmine.addMatchers({
                    "toBeAtLevel" : testHelpers.toBeAtLevel
                });
                testHelpers.clearStoredLevels();
            });

            afterEach(function() {
                window.console = originalConsole;
            });

            it("rebuilds existing child loggers", function(log) {
                log.setLevel("TRACE");
                var newLogger = log.getLogger("newLogger");
                expect(newLogger).toBeAtLevel("TRACE");

                log.setLevel("ERROR");
                expect(newLogger).toBeAtLevel("TRACE");

                log.rebuild();
                expect(newLogger).toBeAtLevel("ERROR");
            });

            it("should not change a child's persisted level", function(log) {
                testHelpers.setStoredLevel("ERROR", "newLogger");

                log.setLevel("TRACE");
                var newLogger = log.getLogger("newLogger");
                expect(newLogger).toBeAtLevel("ERROR");

                log.rebuild();
                expect(newLogger).toBeAtLevel("ERROR");
            });

            it("should not change a child's level set with `setLevel()`", function(log) {
                log.setLevel("TRACE");
                var newLogger = log.getLogger("newLogger");
                expect(newLogger).toBeAtLevel("TRACE");

                newLogger.setLevel("DEBUG", false);
                log.rebuild();
                expect(newLogger).toBeAtLevel("DEBUG");
            });

            it("should not change a child's level set with `setDefaultLevel()`", function(log) {
                log.setLevel("TRACE");
                var newLogger = log.getLogger("newLogger");
                expect(newLogger).toBeAtLevel("TRACE");

                newLogger.setDefaultLevel("DEBUG");
                log.rebuild();
                expect(newLogger).toBeAtLevel("DEBUG");
            });
        });
    });
});
