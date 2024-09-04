"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
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
};
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("./index");
var Calculator = /** @class */ (function () {
    // accept the logger in the constructor, defaulting to dummy logger
    function Calculator(log) {
        if (log === void 0) { log = index_1.dummyLogger; }
        this.log = log;
    }
    Calculator.prototype.sum = function (a, b) {
        var result = a + b;
        // call all methods of the logger
        this.log.trace("trace summing ".concat(a, " + ").concat(b, " = ").concat(result), a, b, result);
        this.log.debug("debug summing ".concat(a, " + ").concat(b, " = ").concat(result), a, b, result);
        this.log.info("info summing ".concat(a, " + ").concat(b, " = ").concat(result), a, b, result);
        this.log.warn("warn summing ".concat(a, " + ").concat(b, " = ").concat(result), a, b, result);
        this.log.error("error summing ".concat(a, " + ").concat(b, " = ").concat(result), a, b, result);
        return result;
    };
    return Calculator;
}());
describe("ts-log", function () {
    it("should work with default dummy logger", function () { return __awaiter(void 0, void 0, void 0, function () {
        var calculator;
        return __generator(this, function (_a) {
            calculator = new Calculator();
            calculator.sum(1, 2);
            return [2 /*return*/];
        });
    }); });
    it("should work with console as logger", function () { return __awaiter(void 0, void 0, void 0, function () {
        var calculator;
        return __generator(this, function (_a) {
            calculator = new Calculator(console);
            calculator.sum(1, 2);
            return [2 /*return*/];
        });
    }); });
    it("should work with custom logger", function () { return __awaiter(void 0, void 0, void 0, function () {
        var customLogger, calculator;
        return __generator(this, function (_a) {
            customLogger = {
                trace: jest.fn(),
                debug: jest.fn(),
                info: jest.fn(),
                warn: jest.fn(),
                error: jest.fn(),
            };
            calculator = new Calculator(customLogger);
            calculator.sum(1, 2);
            expect(customLogger.trace.mock.calls).toMatchSnapshot();
            expect(customLogger.debug.mock.calls).toMatchSnapshot();
            expect(customLogger.info.mock.calls).toMatchSnapshot();
            expect(customLogger.warn.mock.calls).toMatchSnapshot();
            expect(customLogger.error.mock.calls).toMatchSnapshot();
            return [2 /*return*/];
        });
    }); });
});
//# sourceMappingURL=index.test.js.map