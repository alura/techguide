import { invariant } from "../../utilities/globals/index.js";
import { AutoCleanedWeakCache, cacheSizes, } from "../../utilities/index.js";
import { registerGlobalCache } from "../../utilities/caching/getMemoryInternals.js";
export var DocumentType;
(function (DocumentType) {
    DocumentType[DocumentType["Query"] = 0] = "Query";
    DocumentType[DocumentType["Mutation"] = 1] = "Mutation";
    DocumentType[DocumentType["Subscription"] = 2] = "Subscription";
})(DocumentType || (DocumentType = {}));
var cache;
export function operationName(type) {
    var name;
    switch (type) {
        case DocumentType.Query:
            name = "Query";
            break;
        case DocumentType.Mutation:
            name = "Mutation";
            break;
        case DocumentType.Subscription:
            name = "Subscription";
            break;
    }
    return name;
}
// This parser is mostly used to safety check incoming documents.
export function parser(document) {
    if (!cache) {
        cache = new AutoCleanedWeakCache(cacheSizes.parser || 1000 /* defaultCacheSizes.parser */);
    }
    var cached = cache.get(document);
    if (cached)
        return cached;
    var variables, type, name;
    invariant(!!document && !!document.kind, 60, document);
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
    invariant(!fragments.length ||
        queries.length ||
        mutations.length ||
        subscriptions.length, 61);
    invariant(
        queries.length + mutations.length + subscriptions.length <= 1,
        62,
        document,
        queries.length,
        subscriptions.length,
        mutations.length
    );
    type = queries.length ? DocumentType.Query : DocumentType.Mutation;
    if (!queries.length && !mutations.length)
        type = DocumentType.Subscription;
    var definitions = queries.length ? queries
        : mutations.length ? mutations
            : subscriptions;
    invariant(definitions.length === 1, 63, document, definitions.length);
    var definition = definitions[0];
    variables = definition.variableDefinitions || [];
    if (definition.name && definition.name.kind === "Name") {
        name = definition.name.value;
    }
    else {
        name = "data"; // fallback to using data if no name
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
export function verifyDocumentType(document, type) {
    var operation = parser(document);
    var requiredOperationName = operationName(type);
    var usedOperationName = operationName(operation.type);
    invariant(
        operation.type === type,
        64,
        requiredOperationName,
        requiredOperationName,
        usedOperationName
    );
}
//# sourceMappingURL=index.js.map