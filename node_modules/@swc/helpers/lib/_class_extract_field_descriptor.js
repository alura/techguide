"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = _classExtractFieldDescriptor;
function _classExtractFieldDescriptor(receiver, privateMap, action) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to " + action + " private field on non-instance");
    }
    return privateMap.get(receiver);
}
