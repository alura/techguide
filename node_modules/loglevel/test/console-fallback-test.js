"use strict";

function consoleLogIsCalledBy(log, methodName) {
    it(methodName + " calls console.log", function() {
        log.setLevel(log.levels.TRACE);
        log[methodName]("Log message for call to " + methodName);
        expect(console.log.calls.count()).toEqual(1);
    });
}

function mockConsole() {
    return {"log" : jasmine.createSpy("console.log")};
}

define(['../lib/loglevel', 'test/test-helpers'], function(log, testHelpers) {
    var originalConsole = window.console;

    describe("Fallback functionality:", function() {
        describe("with no console present", function() {
            beforeEach(function() {
                window.console = undefined;
            });

            afterEach(function() {
                window.console = originalConsole;
            });

            it("silent method calls are allowed", function() {
                var result = log.setLevel(log.levels.SILENT);
                log.trace("hello");

                expect(result).toBeUndefined();
            });

            it("setting an active level gently returns an error string", function() {
                var result = log.setLevel(log.levels.TRACE);
                expect(result).toEqual("No console available for logging");
            });

            it("active method calls are allowed, once the active setLevel fails", function() {
                log.setLevel(log.levels.TRACE);
                log.trace("hello");
                expect().nothing();
            });

            describe("if a console later appears", function () {
                it("logging is re-enabled and works correctly when next used", function () {
                    log.setLevel(log.levels.WARN);

                    window.console = mockConsole();
                    log.error("error");

                    expect(window.console.log).toHaveBeenCalled();
                });

                it("logging is re-enabled but does nothing when used at a blocked level", function () {
                    log.setLevel(log.levels.WARN);

                    window.console = mockConsole();
                    log.trace("trace");

                    expect(window.console.log).not.toHaveBeenCalled();
                });

                it("changing level works correctly from that point", function () {
                    window.console = mockConsole();
                    var result = log.setLevel(log.levels.WARN);

                    expect(result).toBeUndefined();
                });
            });
        });

        describe("with a console that only supports console.log", function() {
            beforeEach(function() {
                window.console = mockConsole();
            });

            afterEach(function() {
                window.console = originalConsole;
            });

            it("log can be set to silent", function() {
                log.setLevel(log.levels.SILENT);
                expect().nothing();
            });

            it("log can be set to an active level", function() {
                log.setLevel(log.levels.ERROR);
                expect().nothing();
            });

            consoleLogIsCalledBy(log, "trace");
            consoleLogIsCalledBy(log, "debug");
            consoleLogIsCalledBy(log, "info");
            consoleLogIsCalledBy(log, "warn");
            consoleLogIsCalledBy(log, "trace");
        });
    });
});

