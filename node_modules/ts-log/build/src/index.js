"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dummyLogger = void 0;
/**
 * Dummy logger that does not do anything.
 *
 * Useful as a default for some library that the user might want to get logs out of.
 */
exports.dummyLogger = {
    trace: function (_message) {
        var _optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            _optionalParams[_i - 1] = arguments[_i];
        }
    },
    debug: function (_message) {
        var _optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            _optionalParams[_i - 1] = arguments[_i];
        }
    },
    info: function (_message) {
        var _optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            _optionalParams[_i - 1] = arguments[_i];
        }
    },
    warn: function (_message) {
        var _optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            _optionalParams[_i - 1] = arguments[_i];
        }
    },
    error: function (_message) {
        var _optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            _optionalParams[_i - 1] = arguments[_i];
        }
    },
};
//# sourceMappingURL=index.js.map