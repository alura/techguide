// A version of Array.isArray that works better with readonly arrays.
export var isArray = Array.isArray;
export function isNonEmptyArray(value) {
    return Array.isArray(value) && value.length > 0;
}
//# sourceMappingURL=arrays.js.map