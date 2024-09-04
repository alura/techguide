import { parentEntrySlot } from "./context.js";
import { hasOwnProperty, maybeUnsubscribe, arrayFromSet, } from "./helpers.js";
const EntryMethods = {
    setDirty: true,
    dispose: true,
    forget: true, // Fully remove parent Entry from LRU cache and computation graph
};
export function dep(options) {
    const depsByKey = new Map();
    const subscribe = options && options.subscribe;
    function depend(key) {
        const parent = parentEntrySlot.getValue();
        if (parent) {
            let dep = depsByKey.get(key);
            if (!dep) {
                depsByKey.set(key, dep = new Set);
            }
            parent.dependOn(dep);
            if (typeof subscribe === "function") {
                maybeUnsubscribe(dep);
                dep.unsubscribe = subscribe(key);
            }
        }
    }
    depend.dirty = function dirty(key, entryMethodName) {
        const dep = depsByKey.get(key);
        if (dep) {
            const m = (entryMethodName &&
                hasOwnProperty.call(EntryMethods, entryMethodName)) ? entryMethodName : "setDirty";
            // We have to use arrayFromSet(dep).forEach instead of dep.forEach,
            // because modifying a Set while iterating over it can cause elements in
            // the Set to be removed from the Set before they've been iterated over.
            arrayFromSet(dep).forEach(entry => entry[m]());
            depsByKey.delete(key);
            maybeUnsubscribe(dep);
        }
    };
    return depend;
}
//# sourceMappingURL=dep.js.map