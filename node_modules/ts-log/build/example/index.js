"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var src_1 = require("../src");
// example class that uses the logger
var Calculator = /** @class */ (function () {
    // accept the logger in the constructor, defaulting to dummy logger that does nothing
    function Calculator(log) {
        if (log === void 0) { log = src_1.dummyLogger; }
        this.log = log;
    }
    Calculator.prototype.sum = function (a, b) {
        var result = a + b;
        // call the logger
        this.log.info("summing ".concat(a, " + ").concat(b, " = ").concat(result), a, b, result);
        return result;
    };
    return Calculator;
}());
// example custom logger that logs to a file
var FileLogger = /** @class */ (function () {
    function FileLogger(filename) {
        this.fd = fs.openSync(filename, "a");
    }
    FileLogger.prototype.trace = function (message) {
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
        this.append("TRACE", "".concat(message, " ").concat(JSON.stringify(optionalParams)));
    };
    FileLogger.prototype.debug = function (message) {
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
        this.append("DEBUG", "".concat(message, " ").concat(JSON.stringify(optionalParams)));
    };
    FileLogger.prototype.info = function (message) {
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
        this.append("INFO ", "".concat(message, " ").concat(JSON.stringify(optionalParams)));
    };
    FileLogger.prototype.warn = function (message) {
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
        this.append("WARN ", "".concat(message, " ").concat(JSON.stringify(optionalParams)));
    };
    FileLogger.prototype.error = function (message) {
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
        this.append("ERROR", "".concat(message, " ").concat(JSON.stringify(optionalParams)));
    };
    FileLogger.prototype.append = function (type, message) {
        fs.writeSync(this.fd, "".concat(new Date().toISOString(), " ").concat(type, " ").concat(message, "\n"));
    };
    return FileLogger;
}());
// don't define a logger, defaults to dummy logger that does nothing
var calculator1 = new Calculator();
// use the built-in console as the logger
var calculator2 = new Calculator(console);
// use the custom file logger
var calculator3 = new Calculator(new FileLogger("log.txt"));
// run the calculator
calculator1.sum(2, 3);
calculator2.sum(-4, 1);
calculator3.sum(6, 3);
//# sourceMappingURL=index.js.map