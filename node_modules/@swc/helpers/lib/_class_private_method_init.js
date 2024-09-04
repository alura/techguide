"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = _classPrivateMethodInit;
var _checkPrivateRedeclarationMjs = _interopRequireDefault(require("./_check_private_redeclaration.js"));
function _classPrivateMethodInit(obj, privateSet) {
    (0, _checkPrivateRedeclarationMjs).default(obj, privateSet);
    privateSet.add(obj);
}
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
