"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = _toPropertyKey;
var _typeOfMjs = _interopRequireDefault(require("./_type_of.js"));
var _toPrimitiveMjs = _interopRequireDefault(require("./_to_primitive.js"));
function _toPropertyKey(arg) {
    var key = (0, _toPrimitiveMjs).default(arg, "string");
    return (0, _typeOfMjs).default(key) === "symbol" ? key : String(key);
}
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
