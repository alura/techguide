import { isNonNullObject } from "./objects.js";
function deepFreeze(value) {
    var workSet = new Set([value]);
    workSet.forEach(function (obj) {
        if (isNonNullObject(obj) && shallowFreeze(obj) === obj) {
            Object.getOwnPropertyNames(obj).forEach(function (name) {
                if (isNonNullObject(obj[name]))
                    workSet.add(obj[name]);
            });
        }
    });
    return value;
}
function shallowFreeze(obj) {
    if (globalThis.__DEV__ !== false && !Object.isFrozen(obj)) {
        try {
            Object.freeze(obj);
        }
        catch (e) {
            // Some types like Uint8Array and Node.js's Buffer cannot be frozen, but
            // they all throw a TypeError when you try, so we re-throw any exceptions
            // that are not TypeErrors, since that would be unexpected.
            if (e instanceof TypeError)
                return null;
            throw e;
        }
    }
    return obj;
}
export function maybeDeepFreeze(obj) {
    if (globalThis.__DEV__ !== false) {
        deepFreeze(obj);
    }
    return obj;
}
//# sourceMappingURL=maybeDeepFreeze.js.map