"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = _classPrivateFieldSet;
var _classExtractFieldDescriptorMjs = _interopRequireDefault(require("./_class_extract_field_descriptor.js"));
var _classApplyDescriptorSetMjs = _interopRequireDefault(require("./_class_apply_descriptor_set.js"));
function _classPrivateFieldSet(receiver, privateMap, value) {
    var descriptor = (0, _classExtractFieldDescriptorMjs).default(receiver, privateMap, "set");
    (0, _classApplyDescriptorSetMjs).default(receiver, descriptor, value);
    return value;
}
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
