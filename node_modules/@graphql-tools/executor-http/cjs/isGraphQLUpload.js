"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isGraphQLUpload = void 0;
function isGraphQLUpload(upload) {
    return typeof upload.createReadStream === 'function';
}
exports.isGraphQLUpload = isGraphQLUpload;
