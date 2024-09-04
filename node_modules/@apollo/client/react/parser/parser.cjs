'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var globals = require('../../utilities/globals');
var utilities = require('../../utilities');
require('tslib');

var globalCaches = {};
function registerGlobalCache(name, getSize) {
    globalCaches[name] = getSize;
}

exports.DocumentType = void 0;
(function (DocumentType) {
    DocumentType[DocumentType["Query"] = 0] = "Query";
    DocumentType[DocumentType["Mutation"] = 1] = "Mutation";
    DocumentType[DocumentType["Subscription"] = 2] = "Subscription";
})(exports.DocumentType || (exports.DocumentType = {}));
var cache;
function operationName(type) {
    var name;
    switch (type) {
        case exports.DocumentType.Query:
            name = "Query";
            break;
        case exports.DocumentType.Mutation:
            name = "Mutation";
            break;
        case exports.DocumentType.Subscription:
            name = "Subscription";
            break;
    }
    return name;
}
function parser(document) {
    if (!cache) {
        cache = new utilities.AutoCleanedWeakCache(utilities.cacheSizes.parser || 1000 );
    }
    var cached = cache.get(document);
    if (cached)
        return cached;
    var variables, type, name;
    globals.invariant(!!document && !!document.kind, 60, document);
    var fragments = [];
    var queries = [];
    var mutations = [];
    var subscriptions = [];
    for (var _i = 0, _a = document.definitions; _i < _a.length; _i++) {
        var x = _a[_i];
        if (x.kind === "FragmentDefinition") {
            fragments.push(x);
            continue;
        }
        if (x.kind === "OperationDefinition") {
            switch (x.operation) {
                case "query":
                    queries.push(x);
                    break;
                case "mutation":
                    mutations.push(x);
                    break;
                case "subscription":
                    subscriptions.push(x);
                    break;
            }
        }
    }
    globals.invariant(!fragments.length ||
        queries.length ||
        mutations.length ||
        subscriptions.length, 61);
    globals.invariant(
        queries.length + mutations.length + subscriptions.length <= 1,
        62,
        document,
        queries.length,
        subscriptions.length,
        mutations.length
    );
    type = queries.length ? exports.DocumentType.Query : exports.DocumentType.Mutation;
    if (!queries.length && !mutations.length)
        type = exports.DocumentType.Subscription;
    var definitions = queries.length ? queries
        : mutations.length ? mutations
            : subscriptions;
    globals.invariant(definitions.length === 1, 63, document, definitions.length);
    var definition = definitions[0];
    variables = definition.variableDefinitions || [];
    if (definition.name && definition.name.kind === "Name") {
        name = definition.name.value;
    }
    else {
        name = "data";
    }
    var payload = { name: name, type: type, variables: variables };
    cache.set(document, payload);
    return payload;
}
parser.resetCache = function () {
    cache = undefined;
};
if (globalThis.__DEV__ !== false) {
    registerGlobalCache("parser", function () { return (cache ? cache.size : 0); });
}
function verifyDocumentType(document, type) {
    var operation = parser(document);
    var requiredOperationName = operationName(type);
    var usedOperationName = operationName(operation.type);
    globals.invariant(
        operation.type === type,
        64,
        requiredOperationName,
        requiredOperationName,
        usedOperationName
    );
}

exports.operationName = operationName;
exports.parser = parser;
exports.verifyDocumentType = verifyDocumentType;
//# sourceMappingURL=parser.cjs.map
