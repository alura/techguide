"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = _toPrimitive;
var _typeOfMjs = _interopRequireDefault(require("./_type_of.js"));
function _toPrimitive(input, hint) {
    if ((0, _typeOfMjs).default(input) !== "object" || input === null) return input;
    var prim = input[Symbol.toPrimitive];
    if (prim !== undefined) {
        var res = prim.call(input, hint || "default");
        if ((0, _typeOfMjs).default(res) !== "object") return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (hint === "string" ? String : Number)(input);
}
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
