"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = _objectWithoutProperties;
var _objectWithoutPropertiesLooseMjs = _interopRequireDefault(require("./_object_without_properties_loose.js"));
function _objectWithoutProperties(source, excluded) {
    if (source == null) return {};
    var target = (0, _objectWithoutPropertiesLooseMjs).default(source, excluded);
    var key, i;
    if (Object.getOwnPropertySymbols) {
        var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
        for(i = 0; i < sourceSymbolKeys.length; i++){
            key = sourceSymbolKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
            target[key] = source[key];
        }
    }
    return target;
}
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
