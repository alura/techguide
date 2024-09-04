"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = _classStaticPrivateFieldSpecGet;
var _classCheckPrivateStaticAccessMjs = _interopRequireDefault(require("./_class_check_private_static_access.js"));
var _classCheckPrivateStaticFieldDescriptorMjs = _interopRequireDefault(require("./_class_check_private_static_field_descriptor.js"));
var _classApplyDescriptorGetMjs = _interopRequireDefault(require("./_class_apply_descriptor_get.js"));
function _classStaticPrivateFieldSpecGet(receiver, classConstructor, descriptor) {
    (0, _classCheckPrivateStaticAccessMjs).default(receiver, classConstructor);
    (0, _classCheckPrivateStaticFieldDescriptorMjs).default(descriptor, "get");
    return (0, _classApplyDescriptorGetMjs).default(receiver, descriptor);
}
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
