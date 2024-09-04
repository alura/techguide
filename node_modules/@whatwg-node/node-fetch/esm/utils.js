export function getHeadersObj(headers) {
    if (headers == null || !('forEach' in headers)) {
        return headers;
    }
    const obj = {};
    headers.forEach((value, key) => {
        obj[key] = value;
    });
    return obj;
}
export function uint8ArrayToArrayBuffer(uint8array) {
    return uint8array.buffer.slice(uint8array.byteOffset, uint8array.byteOffset + uint8array.byteLength);
}
