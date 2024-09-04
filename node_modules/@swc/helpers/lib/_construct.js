"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = _construct;
var _setPrototypeOfMjs = _interopRequireDefault(require("./_set_prototype_of.js"));
function _construct(Parent, args, Class) {
    return construct.apply(null, arguments);
}
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;
    try {
        Date.prototype.toString.call(Reflect.construct(Date, [], function() {}));
        return true;
    } catch (e) {
        return false;
    }
}
function construct(Parent1, args1, Class1) {
    if (isNativeReflectConstruct()) {
        construct = Reflect.construct;
    } else {
        construct = function construct(Parent, args, Class) {
            var a = [
                null
            ];
            a.push.apply(a, args);
            var Constructor = Function.bind.apply(Parent, a);
            var instance = new Constructor();
            if (Class) (0, _setPrototypeOfMjs).default(instance, Class.prototype);
            return instance;
        };
    }
    return construct.apply(null, arguments);
}
