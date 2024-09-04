export function isNonNullObject(obj) {
    return obj !== null && typeof obj === "object";
}
export function isPlainObject(obj) {
    return (obj !== null &&
        typeof obj === "object" &&
        (Object.getPrototypeOf(obj) === Object.prototype ||
            Object.getPrototypeOf(obj) === null));
}
//# sourceMappingURL=objects.js.map