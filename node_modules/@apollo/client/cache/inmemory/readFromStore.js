import { __assign } from "tslib";
import { invariant, newInvariantError } from "../../utilities/globals/index.js";
import { Kind } from "graphql";
import { wrap } from "optimism";
import { isField, resultKeyNameFromField, isReference, makeReference, shouldInclude, addTypenameToDocument, getDefaultValues, getMainDefinition, getQueryDefinition, getFragmentFromSelection, maybeDeepFreeze, mergeDeepArray, DeepMerger, isNonNullObject, canUseWeakMap, compact, canonicalStringify, cacheSizes, } from "../../utilities/index.js";
import { maybeDependOnExistenceOfEntity, supportsResultCaching, } from "./entityStore.js";
import { isArray, extractFragmentContext, getTypenameFromStoreObject, shouldCanonizeResults, } from "./helpers.js";
import { MissingFieldError } from "../core/types/common.js";
import { ObjectCanon } from "./object-canon.js";
function execSelectionSetKeyArgs(options) {
    return [
        options.selectionSet,
        options.objectOrReference,
        options.context,
        // We split out this property so we can pass different values
        // independently without modifying options.context itself.
        options.context.canonizeResults,
    ];
}
var StoreReader = /** @class */ (function () {
    function StoreReader(config) {
        var _this = this;
        this.knownResults = new (canUseWeakMap ? WeakMap : Map)();
        this.config = compact(config, {
            addTypename: config.addTypename !== false,
            canonizeResults: shouldCanonizeResults(config),
        });
        this.canon = config.canon || new ObjectCanon();
        // memoized functions in this class will be "garbage-collected"
        // by recreating the whole `StoreReader` in
        // `InMemoryCache.resetResultsCache`
        // (triggered from `InMemoryCache.gc` with `resetResultCache: true`)
        this.executeSelectionSet = wrap(function (options) {
            var _a;
            var canonizeResults = options.context.canonizeResults;
            var peekArgs = execSelectionSetKeyArgs(options);
            // Negate this boolean option so we can find out if we've already read
            // this result using the other boolean value.
            peekArgs[3] = !canonizeResults;
            var other = (_a = _this.executeSelectionSet).peek.apply(_a, peekArgs);
            if (other) {
                if (canonizeResults) {
                    return __assign(__assign({}, other), { 
                        // If we previously read this result without canonizing it, we can
                        // reuse that result simply by canonizing it now.
                        result: _this.canon.admit(other.result) });
                }
                // If we previously read this result with canonization enabled, we can
                // return that canonized result as-is.
                return other;
            }
            maybeDependOnExistenceOfEntity(options.context.store, options.enclosingRef.__ref);
            // Finally, if we didn't find any useful previous results, run the real
            // execSelectionSetImpl method with the given options.
            return _this.execSelectionSetImpl(options);
        }, {
            max: this.config.resultCacheMaxSize ||
                cacheSizes["inMemoryCache.executeSelectionSet"] ||
                50000 /* defaultCacheSizes["inMemoryCache.executeSelectionSet"] */,
            keyArgs: execSelectionSetKeyArgs,
            // Note that the parameters of makeCacheKey are determined by the
            // array returned by keyArgs.
            makeCacheKey: function (selectionSet, parent, context, canonizeResults) {
                if (supportsResultCaching(context.store)) {
                    return context.store.makeCacheKey(selectionSet, isReference(parent) ? parent.__ref : parent, context.varString, canonizeResults);
                }
            },
        });
        this.executeSubSelectedArray = wrap(function (options) {
            maybeDependOnExistenceOfEntity(options.context.store, options.enclosingRef.__ref);
            return _this.execSubSelectedArrayImpl(options);
        }, {
            max: this.config.resultCacheMaxSize ||
                cacheSizes["inMemoryCache.executeSubSelectedArray"] ||
                10000 /* defaultCacheSizes["inMemoryCache.executeSubSelectedArray"] */,
            makeCacheKey: function (_a) {
                var field = _a.field, array = _a.array, context = _a.context;
                if (supportsResultCaching(context.store)) {
                    return context.store.makeCacheKey(field, array, context.varString);
                }
            },
        });
    }
    StoreReader.prototype.resetCanon = function () {
        this.canon = new ObjectCanon();
    };
    /**
     * Given a store and a query, return as much of the result as possible and
     * identify if any data was missing from the store.
     */
    StoreReader.prototype.diffQueryAgainstStore = function (_a) {
        var store = _a.store, query = _a.query, _b = _a.rootId, rootId = _b === void 0 ? "ROOT_QUERY" : _b, variables = _a.variables, _c = _a.returnPartialData, returnPartialData = _c === void 0 ? true : _c, _d = _a.canonizeResults, canonizeResults = _d === void 0 ? this.config.canonizeResults : _d;
        var policies = this.config.cache.policies;
        variables = __assign(__assign({}, getDefaultValues(getQueryDefinition(query))), variables);
        var rootRef = makeReference(rootId);
        var execResult = this.executeSelectionSet({
            selectionSet: getMainDefinition(query).selectionSet,
            objectOrReference: rootRef,
            enclosingRef: rootRef,
            context: __assign({ store: store, query: query, policies: policies, variables: variables, varString: canonicalStringify(variables), canonizeResults: canonizeResults }, extractFragmentContext(query, this.config.fragments)),
        });
        var missing;
        if (execResult.missing) {
            // For backwards compatibility we still report an array of
            // MissingFieldError objects, even though there will only ever be at most
            // one of them, now that all missing field error messages are grouped
            // together in the execResult.missing tree.
            missing = [
                new MissingFieldError(firstMissing(execResult.missing), execResult.missing, query, variables),
            ];
            if (!returnPartialData) {
                throw missing[0];
            }
        }
        return {
            result: execResult.result,
            complete: !missing,
            missing: missing,
        };
    };
    StoreReader.prototype.isFresh = function (result, parent, selectionSet, context) {
        if (supportsResultCaching(context.store) &&
            this.knownResults.get(result) === selectionSet) {
            var latest = this.executeSelectionSet.peek(selectionSet, parent, context, 
            // If result is canonical, then it could only have been previously
            // cached by the canonizing version of executeSelectionSet, so we can
            // avoid checking both possibilities here.
            this.canon.isKnown(result));
            if (latest && result === latest.result) {
                return true;
            }
        }
        return false;
    };
    // Uncached version of executeSelectionSet.
    StoreReader.prototype.execSelectionSetImpl = function (_a) {
        var _this = this;
        var selectionSet = _a.selectionSet, objectOrReference = _a.objectOrReference, enclosingRef = _a.enclosingRef, context = _a.context;
        if (isReference(objectOrReference) &&
            !context.policies.rootTypenamesById[objectOrReference.__ref] &&
            !context.store.has(objectOrReference.__ref)) {
            return {
                result: this.canon.empty,
                missing: "Dangling reference to missing ".concat(objectOrReference.__ref, " object"),
            };
        }
        var variables = context.variables, policies = context.policies, store = context.store;
        var typename = store.getFieldValue(objectOrReference, "__typename");
        var objectsToMerge = [];
        var missing;
        var missingMerger = new DeepMerger();
        if (this.config.addTypename &&
            typeof typename === "string" &&
            !policies.rootIdsByTypename[typename]) {
            // Ensure we always include a default value for the __typename
            // field, if we have one, and this.config.addTypename is true. Note
            // that this field can be overridden by other merged objects.
            objectsToMerge.push({ __typename: typename });
        }
        function handleMissing(result, resultName) {
            var _a;
            if (result.missing) {
                missing = missingMerger.merge(missing, (_a = {},
                    _a[resultName] = result.missing,
                    _a));
            }
            return result.result;
        }
        var workSet = new Set(selectionSet.selections);
        workSet.forEach(function (selection) {
            var _a, _b;
            // Omit fields with directives @skip(if: <truthy value>) or
            // @include(if: <falsy value>).
            if (!shouldInclude(selection, variables))
                return;
            if (isField(selection)) {
                var fieldValue = policies.readField({
                    fieldName: selection.name.value,
                    field: selection,
                    variables: context.variables,
                    from: objectOrReference,
                }, context);
                var resultName = resultKeyNameFromField(selection);
                if (fieldValue === void 0) {
                    if (!addTypenameToDocument.added(selection)) {
                        missing = missingMerger.merge(missing, (_a = {},
                            _a[resultName] = "Can't find field '".concat(selection.name.value, "' on ").concat(isReference(objectOrReference) ?
                                objectOrReference.__ref + " object"
                                : "object " + JSON.stringify(objectOrReference, null, 2)),
                            _a));
                    }
                }
                else if (isArray(fieldValue)) {
                    if (fieldValue.length > 0) {
                        fieldValue = handleMissing(_this.executeSubSelectedArray({
                            field: selection,
                            array: fieldValue,
                            enclosingRef: enclosingRef,
                            context: context,
                        }), resultName);
                    }
                }
                else if (!selection.selectionSet) {
                    // If the field does not have a selection set, then we handle it
                    // as a scalar value. To keep this.canon from canonicalizing
                    // this value, we use this.canon.pass to wrap fieldValue in a
                    // Pass object that this.canon.admit will later unwrap as-is.
                    if (context.canonizeResults) {
                        fieldValue = _this.canon.pass(fieldValue);
                    }
                }
                else if (fieldValue != null) {
                    // In this case, because we know the field has a selection set,
                    // it must be trying to query a GraphQLObjectType, which is why
                    // fieldValue must be != null.
                    fieldValue = handleMissing(_this.executeSelectionSet({
                        selectionSet: selection.selectionSet,
                        objectOrReference: fieldValue,
                        enclosingRef: isReference(fieldValue) ? fieldValue : enclosingRef,
                        context: context,
                    }), resultName);
                }
                if (fieldValue !== void 0) {
                    objectsToMerge.push((_b = {}, _b[resultName] = fieldValue, _b));
                }
            }
            else {
                var fragment = getFragmentFromSelection(selection, context.lookupFragment);
                if (!fragment && selection.kind === Kind.FRAGMENT_SPREAD) {
                    throw newInvariantError(9, selection.name.value);
                }
                if (fragment && policies.fragmentMatches(fragment, typename)) {
                    fragment.selectionSet.selections.forEach(workSet.add, workSet);
                }
            }
        });
        var result = mergeDeepArray(objectsToMerge);
        var finalResult = { result: result, missing: missing };
        var frozen = context.canonizeResults ?
            this.canon.admit(finalResult)
            // Since this.canon is normally responsible for freezing results (only in
            // development), freeze them manually if canonization is disabled.
            : maybeDeepFreeze(finalResult);
        // Store this result with its selection set so that we can quickly
        // recognize it again in the StoreReader#isFresh method.
        if (frozen.result) {
            this.knownResults.set(frozen.result, selectionSet);
        }
        return frozen;
    };
    // Uncached version of executeSubSelectedArray.
    StoreReader.prototype.execSubSelectedArrayImpl = function (_a) {
        var _this = this;
        var field = _a.field, array = _a.array, enclosingRef = _a.enclosingRef, context = _a.context;
        var missing;
        var missingMerger = new DeepMerger();
        function handleMissing(childResult, i) {
            var _a;
            if (childResult.missing) {
                missing = missingMerger.merge(missing, (_a = {}, _a[i] = childResult.missing, _a));
            }
            return childResult.result;
        }
        if (field.selectionSet) {
            array = array.filter(context.store.canRead);
        }
        array = array.map(function (item, i) {
            // null value in array
            if (item === null) {
                return null;
            }
            // This is a nested array, recurse
            if (isArray(item)) {
                return handleMissing(_this.executeSubSelectedArray({
                    field: field,
                    array: item,
                    enclosingRef: enclosingRef,
                    context: context,
                }), i);
            }
            // This is an object, run the selection set on it
            if (field.selectionSet) {
                return handleMissing(_this.executeSelectionSet({
                    selectionSet: field.selectionSet,
                    objectOrReference: item,
                    enclosingRef: isReference(item) ? item : enclosingRef,
                    context: context,
                }), i);
            }
            if (globalThis.__DEV__ !== false) {
                assertSelectionSetForIdValue(context.store, field, item);
            }
            return item;
        });
        return {
            result: context.canonizeResults ? this.canon.admit(array) : array,
            missing: missing,
        };
    };
    return StoreReader;
}());
export { StoreReader };
function firstMissing(tree) {
    try {
        JSON.stringify(tree, function (_, value) {
            if (typeof value === "string")
                throw value;
            return value;
        });
    }
    catch (result) {
        return result;
    }
}
function assertSelectionSetForIdValue(store, field, fieldValue) {
    if (!field.selectionSet) {
        var workSet_1 = new Set([fieldValue]);
        workSet_1.forEach(function (value) {
            if (isNonNullObject(value)) {
                invariant(
                    !isReference(value),
                    10,
                    getTypenameFromStoreObject(store, value),
                    field.name.value
                );
                Object.values(value).forEach(workSet_1.add, workSet_1);
            }
        });
    }
}
//# sourceMappingURL=readFromStore.js.map