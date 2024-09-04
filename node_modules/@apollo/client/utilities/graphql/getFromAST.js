import { invariant, newInvariantError } from "../globals/index.js";
import { valueToObjectRepresentation } from "./storeUtils.js";
// Checks the document for errors and throws an exception if there is an error.
export function checkDocument(doc) {
    invariant(doc && doc.kind === "Document", 75);
    var operations = doc.definitions
        .filter(function (d) { return d.kind !== "FragmentDefinition"; })
        .map(function (definition) {
        if (definition.kind !== "OperationDefinition") {
            throw newInvariantError(76, definition.kind);
        }
        return definition;
    });
    invariant(operations.length <= 1, 77, operations.length);
    return doc;
}
export function getOperationDefinition(doc) {
    checkDocument(doc);
    return doc.definitions.filter(function (definition) {
        return definition.kind === "OperationDefinition";
    })[0];
}
export function getOperationName(doc) {
    return (doc.definitions
        .filter(function (definition) {
        return definition.kind === "OperationDefinition" && !!definition.name;
    })
        .map(function (x) { return x.name.value; })[0] || null);
}
// Returns the FragmentDefinitions from a particular document as an array
export function getFragmentDefinitions(doc) {
    return doc.definitions.filter(function (definition) {
        return definition.kind === "FragmentDefinition";
    });
}
export function getQueryDefinition(doc) {
    var queryDef = getOperationDefinition(doc);
    invariant(queryDef && queryDef.operation === "query", 78);
    return queryDef;
}
export function getFragmentDefinition(doc) {
    invariant(doc.kind === "Document", 79);
    invariant(doc.definitions.length <= 1, 80);
    var fragmentDef = doc.definitions[0];
    invariant(fragmentDef.kind === "FragmentDefinition", 81);
    return fragmentDef;
}
/**
 * Returns the first operation definition found in this document.
 * If no operation definition is found, the first fragment definition will be returned.
 * If no definitions are found, an error will be thrown.
 */
export function getMainDefinition(queryDoc) {
    checkDocument(queryDoc);
    var fragmentDefinition;
    for (var _i = 0, _a = queryDoc.definitions; _i < _a.length; _i++) {
        var definition = _a[_i];
        if (definition.kind === "OperationDefinition") {
            var operation = definition.operation;
            if (operation === "query" ||
                operation === "mutation" ||
                operation === "subscription") {
                return definition;
            }
        }
        if (definition.kind === "FragmentDefinition" && !fragmentDefinition) {
            // we do this because we want to allow multiple fragment definitions
            // to precede an operation definition.
            fragmentDefinition = definition;
        }
    }
    if (fragmentDefinition) {
        return fragmentDefinition;
    }
    throw newInvariantError(82);
}
export function getDefaultValues(definition) {
    var defaultValues = Object.create(null);
    var defs = definition && definition.variableDefinitions;
    if (defs && defs.length) {
        defs.forEach(function (def) {
            if (def.defaultValue) {
                valueToObjectRepresentation(defaultValues, def.variable.name, def.defaultValue);
            }
        });
    }
    return defaultValues;
}
//# sourceMappingURL=getFromAST.js.map