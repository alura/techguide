"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = _createSuper;
var _isNativeReflectConstructMjs = _interopRequireDefault(require("./_is_native_reflect_construct.js"));
var _getPrototypeOfMjs = _interopRequireDefault(require("./_get_prototype_of.js"));
var _possibleConstructorReturnMjs = _interopRequireDefault(require("./_possible_constructor_return.js"));
function _createSuper(Derived) {
    var hasNativeReflectConstruct = (0, _isNativeReflectConstructMjs).default();
    return function _createSuperInternal() {
        var Super = (0, _getPrototypeOfMjs).default(Derived), result;
        if (hasNativeReflectConstruct) {
            var NewTarget = (0, _getPrototypeOfMjs).default(this).constructor;
            result = Reflect.construct(Super, arguments, NewTarget);
        } else {
            result = Super.apply(this, arguments);
        }
        return (0, _possibleConstructorReturnMjs).default(this, result);
    };
}
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
