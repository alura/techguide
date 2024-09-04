"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = _update;
var _getMjs = _interopRequireDefault(require("./_get.js"));
var _setMjs = _interopRequireDefault(require("./_set.js"));
function _update(target, property, receiver, isStrict) {
    return {
        get _ () {
            return (0, _getMjs).default(target, property, receiver);
        },
        set _ (value){
            (0, _setMjs).default(target, property, value, receiver, isStrict);
        }
    };
}
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
