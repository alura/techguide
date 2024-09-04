"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = _wrapAsyncGenerator;
var _asyncGeneratorMjs = _interopRequireDefault(require("./_async_generator.js"));
function _wrapAsyncGenerator(fn) {
    return function() {
        return new _asyncGeneratorMjs.default(fn.apply(this, arguments));
    };
}
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
