"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uint8ArrayToArrayBuffer = exports.getHeadersObj = void 0;
function getHeadersObj(headers) {
    if (headers == null || !('forEach' in headers)) {
        return headers;
    }
    const obj = {};
    headers.forEach((value, key) => {
        obj[key] = value;
    });
    return obj;
}
exports.getHeadersObj = getHeadersObj;
function uint8ArrayToArrayBuffer(uint8array) {
    return uint8array.buffer.slice(uint8array.byteOffset, uint8array.byteOffset + uint8array.byteLength);
}
exports.uint8ArrayToArrayBuffer = uint8ArrayToArrayBuffer;
