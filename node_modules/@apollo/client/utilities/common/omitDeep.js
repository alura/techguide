import { isPlainObject } from "./objects.js";
export function omitDeep(value, key) {
    return __omitDeep(value, key);
}
function __omitDeep(value, key, known) {
    if (known === void 0) { known = new Map(); }
    if (known.has(value)) {
        return known.get(value);
    }
    var modified = false;
    if (Array.isArray(value)) {
        var array_1 = [];
        known.set(value, array_1);
        value.forEach(function (value, index) {
            var result = __omitDeep(value, key, known);
            modified || (modified = result !== value);
            array_1[index] = result;
        });
        if (modified) {
            return array_1;
        }
    }
    else if (isPlainObject(value)) {
        var obj_1 = Object.create(Object.getPrototypeOf(value));
        known.set(value, obj_1);
        Object.keys(value).forEach(function (k) {
            if (k === key) {
                modified = true;
                return;
            }
            var result = __omitDeep(value[k], key, known);
            modified || (modified = result !== value[k]);
            obj_1[k] = result;
        });
        if (modified) {
            return obj_1;
        }
    }
    return value;
}
//# sourceMappingURL=omitDeep.js.map