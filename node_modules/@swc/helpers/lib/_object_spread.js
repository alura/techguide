"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = _objectSpread;
var _definePropertyMjs = _interopRequireDefault(require("./_define_property.js"));
function _objectSpread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === 'function') {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            (0, _definePropertyMjs).default(target, key, source[key]);
        });
    }
    return target;
}
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
