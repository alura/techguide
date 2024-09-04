"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = _set;
var _definePropertyMjs = _interopRequireDefault(require("./_define_property.js"));
var _superPropBaseMjs = _interopRequireDefault(require("./_super_prop_base.js"));
function _set(target, property, value, receiver, isStrict) {
    var s = set(target, property, value, receiver || target);
    if (!s && isStrict) {
        throw new Error('failed to set property');
    }
    return value;
}
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function set(target1, property1, value1, receiver1) {
    if (typeof Reflect !== "undefined" && Reflect.set) {
        set = Reflect.set;
    } else {
        set = function set(target, property, value, receiver) {
            var base = (0, _superPropBaseMjs).default(target, property);
            var desc;
            if (base) {
                desc = Object.getOwnPropertyDescriptor(base, property);
                if (desc.set) {
                    desc.set.call(receiver, value);
                    return true;
                } else if (!desc.writable) {
                    return false;
                }
            }
            desc = Object.getOwnPropertyDescriptor(receiver, property);
            if (desc) {
                if (!desc.writable) {
                    return false;
                }
                desc.value = value;
                Object.defineProperty(receiver, property, desc);
            } else {
                (0, _definePropertyMjs).default(receiver, property, value);
            }
            return true;
        };
    }
    return set(target1, property1, value1, receiver1);
}
