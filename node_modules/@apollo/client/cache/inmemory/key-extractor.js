import { invariant } from "../../utilities/globals/index.js";
import { argumentsObjectFromField, DeepMerger, isNonEmptyArray, isNonNullObject, } from "../../utilities/index.js";
import { hasOwn, isArray } from "./helpers.js";
// Mapping from JSON-encoded KeySpecifier strings to associated information.
var specifierInfoCache = Object.create(null);
function lookupSpecifierInfo(spec) {
    // It's safe to encode KeySpecifier arrays with JSON.stringify, since they're
    // just arrays of strings or nested KeySpecifier arrays, and the order of the
    // array elements is important (and suitably preserved by JSON.stringify).
    var cacheKey = JSON.stringify(spec);
    return (specifierInfoCache[cacheKey] ||
        (specifierInfoCache[cacheKey] = Object.create(null)));
}
export function keyFieldsFnFromSpecifier(specifier) {
    var info = lookupSpecifierInfo(specifier);
    return (info.keyFieldsFn || (info.keyFieldsFn = function (object, context) {
            var extract = function (from, key) {
                return context.readField(key, from);
            };
            var keyObject = (context.keyObject = collectSpecifierPaths(specifier, function (schemaKeyPath) {
                var extracted = extractKeyPath(context.storeObject, schemaKeyPath, 
                // Using context.readField to extract paths from context.storeObject
                // allows the extraction to see through Reference objects and respect
                // custom read functions.
                extract);
                if (extracted === void 0 &&
                    object !== context.storeObject &&
                    hasOwn.call(object, schemaKeyPath[0])) {
                    // If context.storeObject fails to provide a value for the requested
                    // path, fall back to the raw result object, if it has a top-level key
                    // matching the first key in the path (schemaKeyPath[0]). This allows
                    // key fields included in the written data to be saved in the cache
                    // even if they are not selected explicitly in context.selectionSet.
                    // Not being mentioned by context.selectionSet is convenient here,
                    // since it means these extra fields cannot be affected by field
                    // aliasing, which is why we can use extractKey instead of
                    // context.readField for this extraction.
                    extracted = extractKeyPath(object, schemaKeyPath, extractKey);
                }
                invariant(extracted !== void 0, 4, schemaKeyPath.join("."), object);
                return extracted;
            }));
            return "".concat(context.typename, ":").concat(JSON.stringify(keyObject));
        }));
}
// The keyArgs extraction process is roughly analogous to keyFields extraction,
// but there are no aliases involved, missing fields are tolerated (by merely
// omitting them from the key), and drawing from field.directives or variables
// is allowed (in addition to drawing from the field's arguments object).
// Concretely, these differences mean passing a different key path extractor
// function to collectSpecifierPaths, reusing the shared extractKeyPath helper
// wherever possible.
export function keyArgsFnFromSpecifier(specifier) {
    var info = lookupSpecifierInfo(specifier);
    return (info.keyArgsFn ||
        (info.keyArgsFn = function (args, _a) {
            var field = _a.field, variables = _a.variables, fieldName = _a.fieldName;
            var collected = collectSpecifierPaths(specifier, function (keyPath) {
                var firstKey = keyPath[0];
                var firstChar = firstKey.charAt(0);
                if (firstChar === "@") {
                    if (field && isNonEmptyArray(field.directives)) {
                        var directiveName_1 = firstKey.slice(1);
                        // If the directive appears multiple times, only the first
                        // occurrence's arguments will be used. TODO Allow repetition?
                        // TODO Cache this work somehow, a la aliasMap?
                        var d = field.directives.find(function (d) { return d.name.value === directiveName_1; });
                        // Fortunately argumentsObjectFromField works for DirectiveNode!
                        var directiveArgs = d && argumentsObjectFromField(d, variables);
                        // For directives without arguments (d defined, but directiveArgs ===
                        // null), the presence or absence of the directive still counts as
                        // part of the field key, so we return null in those cases. If no
                        // directive with this name was found for this field (d undefined and
                        // thus directiveArgs undefined), we return undefined, which causes
                        // this value to be omitted from the key object returned by
                        // collectSpecifierPaths.
                        return (directiveArgs &&
                            extractKeyPath(directiveArgs, 
                            // If keyPath.length === 1, this code calls extractKeyPath with an
                            // empty path, which works because it uses directiveArgs as the
                            // extracted value.
                            keyPath.slice(1)));
                    }
                    // If the key started with @ but there was no corresponding directive,
                    // we want to omit this value from the key object, not fall through to
                    // treating @whatever as a normal argument name.
                    return;
                }
                if (firstChar === "$") {
                    var variableName = firstKey.slice(1);
                    if (variables && hasOwn.call(variables, variableName)) {
                        var varKeyPath = keyPath.slice(0);
                        varKeyPath[0] = variableName;
                        return extractKeyPath(variables, varKeyPath);
                    }
                    // If the key started with $ but there was no corresponding variable, we
                    // want to omit this value from the key object, not fall through to
                    // treating $whatever as a normal argument name.
                    return;
                }
                if (args) {
                    return extractKeyPath(args, keyPath);
                }
            });
            var suffix = JSON.stringify(collected);
            // If no arguments were passed to this field, and it didn't have any other
            // field key contributions from directives or variables, hide the empty
            // :{} suffix from the field key. However, a field passed no arguments can
            // still end up with a non-empty :{...} suffix if its key configuration
            // refers to directives or variables.
            if (args || suffix !== "{}") {
                fieldName += ":" + suffix;
            }
            return fieldName;
        }));
}
export function collectSpecifierPaths(specifier, extractor) {
    // For each path specified by specifier, invoke the extractor, and repeatedly
    // merge the results together, with appropriate ancestor context.
    var merger = new DeepMerger();
    return getSpecifierPaths(specifier).reduce(function (collected, path) {
        var _a;
        var toMerge = extractor(path);
        if (toMerge !== void 0) {
            // This path is not expected to contain array indexes, so the toMerge
            // reconstruction will not contain arrays. TODO Fix this?
            for (var i = path.length - 1; i >= 0; --i) {
                toMerge = (_a = {}, _a[path[i]] = toMerge, _a);
            }
            collected = merger.merge(collected, toMerge);
        }
        return collected;
    }, Object.create(null));
}
export function getSpecifierPaths(spec) {
    var info = lookupSpecifierInfo(spec);
    if (!info.paths) {
        var paths_1 = (info.paths = []);
        var currentPath_1 = [];
        spec.forEach(function (s, i) {
            if (isArray(s)) {
                getSpecifierPaths(s).forEach(function (p) { return paths_1.push(currentPath_1.concat(p)); });
                currentPath_1.length = 0;
            }
            else {
                currentPath_1.push(s);
                if (!isArray(spec[i + 1])) {
                    paths_1.push(currentPath_1.slice(0));
                    currentPath_1.length = 0;
                }
            }
        });
    }
    return info.paths;
}
function extractKey(object, key) {
    return object[key];
}
export function extractKeyPath(object, path, extract) {
    // For each key in path, extract the corresponding child property from obj,
    // flattening arrays if encountered (uncommon for keyFields and keyArgs, but
    // possible). The final result of path.reduce is normalized so unexpected leaf
    // objects have their keys safely sorted. That final result is difficult to
    // type as anything other than any. You're welcome to try to improve the
    // return type, but keep in mind extractKeyPath is not a public function
    // (exported only for testing), so the effort may not be worthwhile unless the
    // limited set of actual callers (see above) pass arguments that TypeScript
    // can statically type. If we know only that path is some array of strings
    // (and not, say, a specific tuple of statically known strings), any (or
    // possibly unknown) is the honest answer.
    extract = extract || extractKey;
    return normalize(path.reduce(function reducer(obj, key) {
        return isArray(obj) ?
            obj.map(function (child) { return reducer(child, key); })
            : obj && extract(obj, key);
    }, object));
}
function normalize(value) {
    // Usually the extracted value will be a scalar value, since most primary
    // key fields are scalar, but just in case we get an object or an array, we
    // need to do some normalization of the order of (nested) keys.
    if (isNonNullObject(value)) {
        if (isArray(value)) {
            return value.map(normalize);
        }
        return collectSpecifierPaths(Object.keys(value).sort(), function (path) {
            return extractKeyPath(value, path);
        });
    }
    return value;
}
//# sourceMappingURL=key-extractor.js.map