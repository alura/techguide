import { isReference, isField, DeepMerger, resultKeyNameFromField, shouldInclude, isNonNullObject, compact, createFragmentMap, getFragmentDefinitions, isArray, } from "../../utilities/index.js";
export var hasOwn = Object.prototype.hasOwnProperty;
export function isNullish(value) {
    return value === null || value === void 0;
}
export { isArray };
export function defaultDataIdFromObject(_a, context) {
    var __typename = _a.__typename, id = _a.id, _id = _a._id;
    if (typeof __typename === "string") {
        if (context) {
            context.keyObject =
                !isNullish(id) ? { id: id }
                    : !isNullish(_id) ? { _id: _id }
                        : void 0;
        }
        // If there is no object.id, fall back to object._id.
        if (isNullish(id) && !isNullish(_id)) {
            id = _id;
        }
        if (!isNullish(id)) {
            return "".concat(__typename, ":").concat(typeof id === "number" || typeof id === "string" ?
                id
                : JSON.stringify(id));
        }
    }
}
var defaultConfig = {
    dataIdFromObject: defaultDataIdFromObject,
    addTypename: true,
    resultCaching: true,
    // Thanks to the shouldCanonizeResults helper, this should be the only line
    // you have to change to reenable canonization by default in the future.
    canonizeResults: false,
};
export function normalizeConfig(config) {
    return compact(defaultConfig, config);
}
export function shouldCanonizeResults(config) {
    var value = config.canonizeResults;
    return value === void 0 ? defaultConfig.canonizeResults : value;
}
export function getTypenameFromStoreObject(store, objectOrReference) {
    return isReference(objectOrReference) ?
        store.get(objectOrReference.__ref, "__typename")
        : objectOrReference && objectOrReference.__typename;
}
export var TypeOrFieldNameRegExp = /^[_a-z][_0-9a-z]*/i;
export function fieldNameFromStoreName(storeFieldName) {
    var match = storeFieldName.match(TypeOrFieldNameRegExp);
    return match ? match[0] : storeFieldName;
}
export function selectionSetMatchesResult(selectionSet, result, variables) {
    if (isNonNullObject(result)) {
        return isArray(result) ?
            result.every(function (item) {
                return selectionSetMatchesResult(selectionSet, item, variables);
            })
            : selectionSet.selections.every(function (field) {
                if (isField(field) && shouldInclude(field, variables)) {
                    var key = resultKeyNameFromField(field);
                    return (hasOwn.call(result, key) &&
                        (!field.selectionSet ||
                            selectionSetMatchesResult(field.selectionSet, result[key], variables)));
                }
                // If the selection has been skipped with @skip(true) or
                // @include(false), it should not count against the matching. If
                // the selection is not a field, it must be a fragment (inline or
                // named). We will determine if selectionSetMatchesResult for that
                // fragment when we get to it, so for now we return true.
                return true;
            });
    }
    return false;
}
export function storeValueIsStoreObject(value) {
    return isNonNullObject(value) && !isReference(value) && !isArray(value);
}
export function makeProcessedFieldsMerger() {
    return new DeepMerger();
}
export function extractFragmentContext(document, fragments) {
    // FragmentMap consisting only of fragments defined directly in document, not
    // including other fragments registered in the FragmentRegistry.
    var fragmentMap = createFragmentMap(getFragmentDefinitions(document));
    return {
        fragmentMap: fragmentMap,
        lookupFragment: function (name) {
            var def = fragmentMap[name];
            if (!def && fragments) {
                def = fragments.lookup(name);
            }
            return def || null;
        },
    };
}
//# sourceMappingURL=helpers.js.map