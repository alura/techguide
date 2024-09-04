"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = _getPrototypeOf;
function _getPrototypeOf(o) {
    return getPrototypeOf(o);
}
function getPrototypeOf(o1) {
    getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
    };
    return getPrototypeOf(o1);
}
