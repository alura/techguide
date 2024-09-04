import { __assign, __spreadArray } from "tslib";
import { invariant } from "../globals/index.js";
import { visit, Kind } from "graphql";
import { checkDocument, getOperationDefinition, getFragmentDefinition, getFragmentDefinitions, getMainDefinition, } from "./getFromAST.js";
import { isField } from "./storeUtils.js";
import { createFragmentMap } from "./fragments.js";
import { isArray, isNonEmptyArray } from "../common/arrays.js";
var TYPENAME_FIELD = {
    kind: Kind.FIELD,
    name: {
        kind: Kind.NAME,
        value: "__typename",
    },
};
function isEmpty(op, fragmentMap) {
    return (!op ||
        op.selectionSet.selections.every(function (selection) {
            return selection.kind === Kind.FRAGMENT_SPREAD &&
                isEmpty(fragmentMap[selection.name.value], fragmentMap);
        }));
}
function nullIfDocIsEmpty(doc) {
    return (isEmpty(getOperationDefinition(doc) || getFragmentDefinition(doc), createFragmentMap(getFragmentDefinitions(doc)))) ?
        null
        : doc;
}
function getDirectiveMatcher(configs) {
    var names = new Map();
    var tests = new Map();
    configs.forEach(function (directive) {
        if (directive) {
            if (directive.name) {
                names.set(directive.name, directive);
            }
            else if (directive.test) {
                tests.set(directive.test, directive);
            }
        }
    });
    return function (directive) {
        var config = names.get(directive.name.value);
        if (!config && tests.size) {
            tests.forEach(function (testConfig, test) {
                if (test(directive)) {
                    config = testConfig;
                }
            });
        }
        return config;
    };
}
function makeInUseGetterFunction(defaultKey) {
    var map = new Map();
    return function inUseGetterFunction(key) {
        if (key === void 0) { key = defaultKey; }
        var inUse = map.get(key);
        if (!inUse) {
            map.set(key, (inUse = {
                // Variable and fragment spread names used directly within this
                // operation or fragment definition, as identified by key. These sets
                // will be populated during the first traversal of the document in
                // removeDirectivesFromDocument below.
                variables: new Set(),
                fragmentSpreads: new Set(),
            }));
        }
        return inUse;
    };
}
export function removeDirectivesFromDocument(directives, doc) {
    checkDocument(doc);
    // Passing empty strings to makeInUseGetterFunction means we handle anonymous
    // operations as if their names were "". Anonymous fragment definitions are
    // not supposed to be possible, but the same default naming strategy seems
    // appropriate for that case as well.
    var getInUseByOperationName = makeInUseGetterFunction("");
    var getInUseByFragmentName = makeInUseGetterFunction("");
    var getInUse = function (ancestors) {
        for (var p = 0, ancestor = void 0; p < ancestors.length && (ancestor = ancestors[p]); ++p) {
            if (isArray(ancestor))
                continue;
            if (ancestor.kind === Kind.OPERATION_DEFINITION) {
                // If an operation is anonymous, we use the empty string as its key.
                return getInUseByOperationName(ancestor.name && ancestor.name.value);
            }
            if (ancestor.kind === Kind.FRAGMENT_DEFINITION) {
                return getInUseByFragmentName(ancestor.name.value);
            }
        }
        globalThis.__DEV__ !== false && invariant.error(84);
        return null;
    };
    var operationCount = 0;
    for (var i = doc.definitions.length - 1; i >= 0; --i) {
        if (doc.definitions[i].kind === Kind.OPERATION_DEFINITION) {
            ++operationCount;
        }
    }
    var directiveMatcher = getDirectiveMatcher(directives);
    var shouldRemoveField = function (nodeDirectives) {
        return isNonEmptyArray(nodeDirectives) &&
            nodeDirectives
                .map(directiveMatcher)
                .some(function (config) { return config && config.remove; });
    };
    var originalFragmentDefsByPath = new Map();
    // Any time the first traversal of the document below makes a change like
    // removing a fragment (by returning null), this variable should be set to
    // true. Once it becomes true, it should never be set to false again. If this
    // variable remains false throughout the traversal, then we can return the
    // original doc immediately without any modifications.
    var firstVisitMadeChanges = false;
    var fieldOrInlineFragmentVisitor = {
        enter: function (node) {
            if (shouldRemoveField(node.directives)) {
                firstVisitMadeChanges = true;
                return null;
            }
        },
    };
    var docWithoutDirectiveSubtrees = visit(doc, {
        // These two AST node types share the same implementation, defined above.
        Field: fieldOrInlineFragmentVisitor,
        InlineFragment: fieldOrInlineFragmentVisitor,
        VariableDefinition: {
            enter: function () {
                // VariableDefinition nodes do not count as variables in use, though
                // they do contain Variable nodes that might be visited below. To avoid
                // counting variable declarations as usages, we skip visiting the
                // contents of this VariableDefinition node by returning false.
                return false;
            },
        },
        Variable: {
            enter: function (node, _key, _parent, _path, ancestors) {
                var inUse = getInUse(ancestors);
                if (inUse) {
                    inUse.variables.add(node.name.value);
                }
            },
        },
        FragmentSpread: {
            enter: function (node, _key, _parent, _path, ancestors) {
                if (shouldRemoveField(node.directives)) {
                    firstVisitMadeChanges = true;
                    return null;
                }
                var inUse = getInUse(ancestors);
                if (inUse) {
                    inUse.fragmentSpreads.add(node.name.value);
                }
                // We might like to remove this FragmentSpread by returning null here if
                // the corresponding FragmentDefinition node is also going to be removed
                // by the logic below, but we can't control the relative order of those
                // events, so we have to postpone the removal of dangling FragmentSpread
                // nodes until after the current visit of the document has finished.
            },
        },
        FragmentDefinition: {
            enter: function (node, _key, _parent, path) {
                originalFragmentDefsByPath.set(JSON.stringify(path), node);
            },
            leave: function (node, _key, _parent, path) {
                var originalNode = originalFragmentDefsByPath.get(JSON.stringify(path));
                if (node === originalNode) {
                    // If the FragmentNode received by this leave function is identical to
                    // the one received by the corresponding enter function (above), then
                    // the visitor must not have made any changes within this
                    // FragmentDefinition node. This fragment definition may still be
                    // removed if there are no ...spread references to it, but it won't be
                    // removed just because it has only a __typename field.
                    return node;
                }
                if (
                // This logic applies only if the document contains one or more
                // operations, since removing all fragments from a document containing
                // only fragments makes the document useless.
                operationCount > 0 &&
                    node.selectionSet.selections.every(function (selection) {
                        return selection.kind === Kind.FIELD &&
                            selection.name.value === "__typename";
                    })) {
                    // This is a somewhat opinionated choice: if a FragmentDefinition ends
                    // up having no fields other than __typename, we remove the whole
                    // fragment definition, and later prune ...spread references to it.
                    getInUseByFragmentName(node.name.value).removed = true;
                    firstVisitMadeChanges = true;
                    return null;
                }
            },
        },
        Directive: {
            leave: function (node) {
                // If a matching directive is found, remove the directive itself. Note
                // that this does not remove the target (field, argument, etc) of the
                // directive, but only the directive itself.
                if (directiveMatcher(node)) {
                    firstVisitMadeChanges = true;
                    return null;
                }
            },
        },
    });
    if (!firstVisitMadeChanges) {
        // If our first pass did not change anything about the document, then there
        // is no cleanup we need to do, and we can return the original doc.
        return doc;
    }
    // Utility for making sure inUse.transitiveVars is recursively populated.
    // Because this logic assumes inUse.fragmentSpreads has been completely
    // populated and inUse.removed has been set if appropriate,
    // populateTransitiveVars must be called after that information has been
    // collected by the first traversal of the document.
    var populateTransitiveVars = function (inUse) {
        if (!inUse.transitiveVars) {
            inUse.transitiveVars = new Set(inUse.variables);
            if (!inUse.removed) {
                inUse.fragmentSpreads.forEach(function (childFragmentName) {
                    populateTransitiveVars(getInUseByFragmentName(childFragmentName)).transitiveVars.forEach(function (varName) {
                        inUse.transitiveVars.add(varName);
                    });
                });
            }
        }
        return inUse;
    };
    // Since we've been keeping track of fragment spreads used by particular
    // operations and fragment definitions, we now need to compute the set of all
    // spreads used (transitively) by any operations in the document.
    var allFragmentNamesUsed = new Set();
    docWithoutDirectiveSubtrees.definitions.forEach(function (def) {
        if (def.kind === Kind.OPERATION_DEFINITION) {
            populateTransitiveVars(getInUseByOperationName(def.name && def.name.value)).fragmentSpreads.forEach(function (childFragmentName) {
                allFragmentNamesUsed.add(childFragmentName);
            });
        }
        else if (def.kind === Kind.FRAGMENT_DEFINITION &&
            // If there are no operations in the document, then all fragment
            // definitions count as usages of their own fragment names. This heuristic
            // prevents accidentally removing all fragment definitions from the
            // document just because it contains no operations that use the fragments.
            operationCount === 0 &&
            !getInUseByFragmentName(def.name.value).removed) {
            allFragmentNamesUsed.add(def.name.value);
        }
    });
    // Now that we have added all fragment spreads used by operations to the
    // allFragmentNamesUsed set, we can complete the set by transitively adding
    // all fragment spreads used by those fragments, and so on.
    allFragmentNamesUsed.forEach(function (fragmentName) {
        // Once all the childFragmentName strings added here have been seen already,
        // the top-level allFragmentNamesUsed.forEach loop will terminate.
        populateTransitiveVars(getInUseByFragmentName(fragmentName)).fragmentSpreads.forEach(function (childFragmentName) {
            allFragmentNamesUsed.add(childFragmentName);
        });
    });
    var fragmentWillBeRemoved = function (fragmentName) {
        return !!(
        // A fragment definition will be removed if there are no spreads that refer
        // to it, or the fragment was explicitly removed because it had no fields
        // other than __typename.
        (!allFragmentNamesUsed.has(fragmentName) ||
            getInUseByFragmentName(fragmentName).removed));
    };
    var enterVisitor = {
        enter: function (node) {
            if (fragmentWillBeRemoved(node.name.value)) {
                return null;
            }
        },
    };
    return nullIfDocIsEmpty(visit(docWithoutDirectiveSubtrees, {
        // If the fragment is going to be removed, then leaving any dangling
        // FragmentSpread nodes with the same name would be a mistake.
        FragmentSpread: enterVisitor,
        // This is where the fragment definition is actually removed.
        FragmentDefinition: enterVisitor,
        OperationDefinition: {
            leave: function (node) {
                // Upon leaving each operation in the depth-first AST traversal, prune
                // any variables that are declared by the operation but unused within.
                if (node.variableDefinitions) {
                    var usedVariableNames_1 = populateTransitiveVars(
                    // If an operation is anonymous, we use the empty string as its key.
                    getInUseByOperationName(node.name && node.name.value)).transitiveVars;
                    // According to the GraphQL spec, all variables declared by an
                    // operation must either be used by that operation or used by some
                    // fragment included transitively into that operation:
                    // https://spec.graphql.org/draft/#sec-All-Variables-Used
                    //
                    // To stay on the right side of this validation rule, if/when we
                    // remove the last $var references from an operation or its fragments,
                    // we must also remove the corresponding $var declaration from the
                    // enclosing operation. This pruning applies only to operations and
                    // not fragment definitions, at the moment. Fragments may be able to
                    // declare variables eventually, but today they can only consume them.
                    if (usedVariableNames_1.size < node.variableDefinitions.length) {
                        return __assign(__assign({}, node), { variableDefinitions: node.variableDefinitions.filter(function (varDef) {
                                return usedVariableNames_1.has(varDef.variable.name.value);
                            }) });
                    }
                }
            },
        },
    }));
}
export var addTypenameToDocument = Object.assign(function (doc) {
    return visit(doc, {
        SelectionSet: {
            enter: function (node, _key, parent) {
                // Don't add __typename to OperationDefinitions.
                if (parent &&
                    parent.kind ===
                        Kind.OPERATION_DEFINITION) {
                    return;
                }
                // No changes if no selections.
                var selections = node.selections;
                if (!selections) {
                    return;
                }
                // If selections already have a __typename, or are part of an
                // introspection query, do nothing.
                var skip = selections.some(function (selection) {
                    return (isField(selection) &&
                        (selection.name.value === "__typename" ||
                            selection.name.value.lastIndexOf("__", 0) === 0));
                });
                if (skip) {
                    return;
                }
                // If this SelectionSet is @export-ed as an input variable, it should
                // not have a __typename field (see issue #4691).
                var field = parent;
                if (isField(field) &&
                    field.directives &&
                    field.directives.some(function (d) { return d.name.value === "export"; })) {
                    return;
                }
                // Create and return a new SelectionSet with a __typename Field.
                return __assign(__assign({}, node), { selections: __spreadArray(__spreadArray([], selections, true), [TYPENAME_FIELD], false) });
            },
        },
    });
}, {
    added: function (field) {
        return field === TYPENAME_FIELD;
    },
});
var connectionRemoveConfig = {
    test: function (directive) {
        var willRemove = directive.name.value === "connection";
        if (willRemove) {
            if (!directive.arguments ||
                !directive.arguments.some(function (arg) { return arg.name.value === "key"; })) {
                globalThis.__DEV__ !== false && invariant.warn(85);
            }
        }
        return willRemove;
    },
};
export function removeConnectionDirectiveFromDocument(doc) {
    return removeDirectivesFromDocument([connectionRemoveConfig], checkDocument(doc));
}
function hasDirectivesInSelectionSet(directives, selectionSet, nestedCheck) {
    if (nestedCheck === void 0) { nestedCheck = true; }
    return (!!selectionSet &&
        selectionSet.selections &&
        selectionSet.selections.some(function (selection) {
            return hasDirectivesInSelection(directives, selection, nestedCheck);
        }));
}
function hasDirectivesInSelection(directives, selection, nestedCheck) {
    if (nestedCheck === void 0) { nestedCheck = true; }
    if (!isField(selection)) {
        return true;
    }
    if (!selection.directives) {
        return false;
    }
    return (selection.directives.some(getDirectiveMatcher(directives)) ||
        (nestedCheck &&
            hasDirectivesInSelectionSet(directives, selection.selectionSet, nestedCheck)));
}
function getArgumentMatcher(config) {
    return function argumentMatcher(argument) {
        return config.some(function (aConfig) {
            return argument.value &&
                argument.value.kind === Kind.VARIABLE &&
                argument.value.name &&
                (aConfig.name === argument.value.name.value ||
                    (aConfig.test && aConfig.test(argument)));
        });
    };
}
export function removeArgumentsFromDocument(config, doc) {
    var argMatcher = getArgumentMatcher(config);
    return nullIfDocIsEmpty(visit(doc, {
        OperationDefinition: {
            enter: function (node) {
                return __assign(__assign({}, node), { 
                    // Remove matching top level variables definitions.
                    variableDefinitions: node.variableDefinitions ?
                        node.variableDefinitions.filter(function (varDef) {
                            return !config.some(function (arg) { return arg.name === varDef.variable.name.value; });
                        })
                        : [] });
            },
        },
        Field: {
            enter: function (node) {
                // If `remove` is set to true for an argument, and an argument match
                // is found for a field, remove the field as well.
                var shouldRemoveField = config.some(function (argConfig) { return argConfig.remove; });
                if (shouldRemoveField) {
                    var argMatchCount_1 = 0;
                    if (node.arguments) {
                        node.arguments.forEach(function (arg) {
                            if (argMatcher(arg)) {
                                argMatchCount_1 += 1;
                            }
                        });
                    }
                    if (argMatchCount_1 === 1) {
                        return null;
                    }
                }
            },
        },
        Argument: {
            enter: function (node) {
                // Remove all matching arguments.
                if (argMatcher(node)) {
                    return null;
                }
            },
        },
    }));
}
export function removeFragmentSpreadFromDocument(config, doc) {
    function enter(node) {
        if (config.some(function (def) { return def.name === node.name.value; })) {
            return null;
        }
    }
    return nullIfDocIsEmpty(visit(doc, {
        FragmentSpread: { enter: enter },
        FragmentDefinition: { enter: enter },
    }));
}
// If the incoming document is a query, return it as is. Otherwise, build a
// new document containing a query operation based on the selection set
// of the previous main operation.
export function buildQueryFromSelectionSet(document) {
    var definition = getMainDefinition(document);
    var definitionOperation = definition.operation;
    if (definitionOperation === "query") {
        // Already a query, so return the existing document.
        return document;
    }
    // Build a new query using the selection set of the main operation.
    var modifiedDoc = visit(document, {
        OperationDefinition: {
            enter: function (node) {
                return __assign(__assign({}, node), { operation: "query" });
            },
        },
    });
    return modifiedDoc;
}
// Remove fields / selection sets that include an @client directive.
export function removeClientSetsFromDocument(document) {
    checkDocument(document);
    var modifiedDoc = removeDirectivesFromDocument([
        {
            test: function (directive) { return directive.name.value === "client"; },
            remove: true,
        },
    ], document);
    return modifiedDoc;
}
//# sourceMappingURL=transform.js.map