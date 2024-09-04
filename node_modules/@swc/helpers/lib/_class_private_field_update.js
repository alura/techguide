"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = _classPrivateFieldUpdate;
var _classExtractFieldDescriptorMjs = _interopRequireDefault(require("./_class_extract_field_descriptor.js"));
var _classApplyDescriptorUpdateMjs = _interopRequireDefault(require("./_class_apply_descriptor_update.js"));
function _classPrivateFieldUpdate(receiver, privateMap) {
    var descriptor = (0, _classExtractFieldDescriptorMjs).default(receiver, privateMap, "update");
    return (0, _classApplyDescriptorUpdateMjs).default(receiver, descriptor);
}
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
