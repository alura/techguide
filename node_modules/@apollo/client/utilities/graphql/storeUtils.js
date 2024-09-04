import { newInvariantError } from "../globals/index.js";
import { isNonNullObject } from "../common/objects.js";
import { getFragmentFromSelection } from "./fragments.js";
import { canonicalStringify } from "../common/canonicalStringify.js";
export function makeReference(id) {
    return { __ref: String(id) };
}
export function isReference(obj) {
    return Boolean(obj && typeof obj === "object" && typeof obj.__ref === "string");
}
export function isDocumentNode(value) {
    return (isNonNullObject(value) &&
        value.kind === "Document" &&
        Array.isArray(value.definitions));
}
function isStringValue(value) {
    return value.kind === "StringValue";
}
function isBooleanValue(value) {
    return value.kind === "BooleanValue";
}
function isIntValue(value) {
    return value.kind === "IntValue";
}
function isFloatValue(value) {
    return value.kind === "FloatValue";
}
function isVariable(value) {
    return value.kind === "Variable";
}
function isObjectValue(value) {
    return value.kind === "ObjectValue";
}
function isListValue(value) {
    return value.kind === "ListValue";
}
function isEnumValue(value) {
    return value.kind === "EnumValue";
}
function isNullValue(value) {
    return value.kind === "NullValue";
}
export function valueToObjectRepresentation(argObj, name, value, variables) {
    if (isIntValue(value) || isFloatValue(value)) {
        argObj[name.value] = Number(value.value);
    }
    else if (isBooleanValue(value) || isStringValue(value)) {
        argObj[name.value] = value.value;
    }
    else if (isObjectValue(value)) {
        var nestedArgObj_1 = {};
        value.fields.map(function (obj) {
            return valueToObjectRepresentation(nestedArgObj_1, obj.name, obj.value, variables);
        });
        argObj[name.value] = nestedArgObj_1;
    }
    else if (isVariable(value)) {
        var variableValue = (variables || {})[value.name.value];
        argObj[name.value] = variableValue;
    }
    else if (isListValue(value)) {
        argObj[name.value] = value.values.map(function (listValue) {
            var nestedArgArrayObj = {};
            valueToObjectRepresentation(nestedArgArrayObj, name, listValue, variables);
            return nestedArgArrayObj[name.value];
        });
    }
    else if (isEnumValue(value)) {
        argObj[name.value] = value.value;
    }
    else if (isNullValue(value)) {
        argObj[name.value] = null;
    }
    else {
        throw newInvariantError(83, name.value, value.kind);
    }
}
export function storeKeyNameFromField(field, variables) {
    var directivesObj = null;
    if (field.directives) {
        directivesObj = {};
        field.directives.forEach(function (directive) {
            directivesObj[directive.name.value] = {};
            if (directive.arguments) {
                directive.arguments.forEach(function (_a) {
                    var name = _a.name, value = _a.value;
                    return valueToObjectRepresentation(directivesObj[directive.name.value], name, value, variables);
                });
            }
        });
    }
    var argObj = null;
    if (field.arguments && field.arguments.length) {
        argObj = {};
        field.arguments.forEach(function (_a) {
            var name = _a.name, value = _a.value;
            return valueToObjectRepresentation(argObj, name, value, variables);
        });
    }
    return getStoreKeyName(field.name.value, argObj, directivesObj);
}
var KNOWN_DIRECTIVES = [
    "connection",
    "include",
    "skip",
    "client",
    "rest",
    "export",
    "nonreactive",
];
// Default stable JSON.stringify implementation used by getStoreKeyName. Can be
// updated/replaced with something better by calling
// getStoreKeyName.setStringify(newStringifyFunction).
var storeKeyNameStringify = canonicalStringify;
export var getStoreKeyName = Object.assign(function (fieldName, args, directives) {
    if (args &&
        directives &&
        directives["connection"] &&
        directives["connection"]["key"]) {
        if (directives["connection"]["filter"] &&
            directives["connection"]["filter"].length > 0) {
            var filterKeys = directives["connection"]["filter"] ?
                directives["connection"]["filter"]
                : [];
            filterKeys.sort();
            var filteredArgs_1 = {};
            filterKeys.forEach(function (key) {
                filteredArgs_1[key] = args[key];
            });
            return "".concat(directives["connection"]["key"], "(").concat(storeKeyNameStringify(filteredArgs_1), ")");
        }
        else {
            return directives["connection"]["key"];
        }
    }
    var completeFieldName = fieldName;
    if (args) {
        // We can't use `JSON.stringify` here since it's non-deterministic,
        // and can lead to different store key names being created even though
        // the `args` object used during creation has the same properties/values.
        var stringifiedArgs = storeKeyNameStringify(args);
        completeFieldName += "(".concat(stringifiedArgs, ")");
    }
    if (directives) {
        Object.keys(directives).forEach(function (key) {
            if (KNOWN_DIRECTIVES.indexOf(key) !== -1)
                return;
            if (directives[key] && Object.keys(directives[key]).length) {
                completeFieldName += "@".concat(key, "(").concat(storeKeyNameStringify(directives[key]), ")");
            }
            else {
                completeFieldName += "@".concat(key);
            }
        });
    }
    return completeFieldName;
}, {
    setStringify: function (s) {
        var previous = storeKeyNameStringify;
        storeKeyNameStringify = s;
        return previous;
    },
});
export function argumentsObjectFromField(field, variables) {
    if (field.arguments && field.arguments.length) {
        var argObj_1 = {};
        field.arguments.forEach(function (_a) {
            var name = _a.name, value = _a.value;
            return valueToObjectRepresentation(argObj_1, name, value, variables);
        });
        return argObj_1;
    }
    return null;
}
export function resultKeyNameFromField(field) {
    return field.alias ? field.alias.value : field.name.value;
}
export function getTypenameFromResult(result, selectionSet, fragmentMap) {
    var fragments;
    for (var _i = 0, _a = selectionSet.selections; _i < _a.length; _i++) {
        var selection = _a[_i];
        if (isField(selection)) {
            if (selection.name.value === "__typename") {
                return result[resultKeyNameFromField(selection)];
            }
        }
        else if (fragments) {
            fragments.push(selection);
        }
        else {
            fragments = [selection];
        }
    }
    if (typeof result.__typename === "string") {
        return result.__typename;
    }
    if (fragments) {
        for (var _b = 0, fragments_1 = fragments; _b < fragments_1.length; _b++) {
            var selection = fragments_1[_b];
            var typename = getTypenameFromResult(result, getFragmentFromSelection(selection, fragmentMap).selectionSet, fragmentMap);
            if (typeof typename === "string") {
                return typename;
            }
        }
    }
}
export function isField(selection) {
    return selection.kind === "Field";
}
export function isInlineFragment(selection) {
    return selection.kind === "InlineFragment";
}
//# sourceMappingURL=storeUtils.js.map