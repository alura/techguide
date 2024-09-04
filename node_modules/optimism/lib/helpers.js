export const { hasOwnProperty, } = Object.prototype;
export const arrayFromSet = Array.from ||
    function (set) {
        const array = [];
        set.forEach(item => array.push(item));
        return array;
    };
export function maybeUnsubscribe(entryOrDep) {
    const { unsubscribe } = entryOrDep;
    if (typeof unsubscribe === "function") {
        entryOrDep.unsubscribe = void 0;
        unsubscribe();
    }
}
//# sourceMappingURL=helpers.js.map