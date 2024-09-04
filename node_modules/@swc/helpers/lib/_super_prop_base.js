"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = _superPropBase;
var _getPrototypeOfMjs = _interopRequireDefault(require("./_get_prototype_of.js"));
function _superPropBase(object, property) {
    while(!Object.prototype.hasOwnProperty.call(object, property)){
        object = (0, _getPrototypeOfMjs).default(object);
        if (object === null) break;
    }
    return object;
}
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
