"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = _classPrivateFieldGet;
var _classExtractFieldDescriptorMjs = _interopRequireDefault(require("./_class_extract_field_descriptor.js"));
var _classApplyDescriptorGetMjs = _interopRequireDefault(require("./_class_apply_descriptor_get.js"));
function _classPrivateFieldGet(receiver, privateMap) {
    var descriptor = (0, _classExtractFieldDescriptorMjs).default(receiver, privateMap, "get");
    return (0, _classApplyDescriptorGetMjs).default(receiver, descriptor);
}
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
