export function maybe(thunk) {
    try {
        return thunk();
    }
    catch (_a) { }
}
//# sourceMappingURL=maybe.js.map