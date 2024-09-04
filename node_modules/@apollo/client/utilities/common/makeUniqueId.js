var prefixCounts = new Map();
// These IDs won't be globally unique, but they will be unique within this
// process, thanks to the counter, and unguessable thanks to the random suffix.
export function makeUniqueId(prefix) {
    var count = prefixCounts.get(prefix) || 1;
    prefixCounts.set(prefix, count + 1);
    return "".concat(prefix, ":").concat(count, ":").concat(Math.random().toString(36).slice(2));
}
//# sourceMappingURL=makeUniqueId.js.map