export function isGraphQLUpload(upload) {
    return typeof upload.createReadStream === 'function';
}
