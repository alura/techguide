"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = _wrapNativeSuper;
var _constructMjs = _interopRequireDefault(require("./_construct.js"));
var _isNativeFunctionMjs = _interopRequireDefault(require("./_is_native_function.js"));
var _getPrototypeOfMjs = _interopRequireDefault(require("./_get_prototype_of.js"));
var _setPrototypeOfMjs = _interopRequireDefault(require("./_set_prototype_of.js"));
function _wrapNativeSuper(Class) {
    return wrapNativeSuper(Class);
}
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function wrapNativeSuper(Class1) {
    var _cache = typeof Map === "function" ? new Map() : undefined;
    wrapNativeSuper = function wrapNativeSuper(Class) {
        if (Class === null || !(0, _isNativeFunctionMjs).default(Class)) return Class;
        if (typeof Class !== "function") {
            throw new TypeError("Super expression must either be null or a function");
        }
        if (typeof _cache !== "undefined") {
            if (_cache.has(Class)) return _cache.get(Class);
            _cache.set(Class, Wrapper);
        }
        function Wrapper() {
            return (0, _constructMjs).default(Class, arguments, (0, _getPrototypeOfMjs).default(this).constructor);
        }
        Wrapper.prototype = Object.create(Class.prototype, {
            constructor: {
                value: Wrapper,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
        return (0, _setPrototypeOfMjs).default(Wrapper, Class);
    };
    return wrapNativeSuper(Class1);
}
