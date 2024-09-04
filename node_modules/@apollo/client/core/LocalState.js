import { __assign, __awaiter, __generator } from "tslib";
import { invariant } from "../utilities/globals/index.js";
import { visit, BREAK, isSelectionNode } from "graphql";
import { argumentsObjectFromField, buildQueryFromSelectionSet, createFragmentMap, getFragmentDefinitions, getMainDefinition, hasDirectives, isField, isInlineFragment, mergeDeep, mergeDeepArray, removeClientSetsFromDocument, resultKeyNameFromField, shouldInclude, } from "../utilities/index.js";
import { cacheSlot } from "../cache/index.js";
var LocalState = /** @class */ (function () {
    function LocalState(_a) {
        var cache = _a.cache, client = _a.client, resolvers = _a.resolvers, fragmentMatcher = _a.fragmentMatcher;
        this.selectionsToResolveCache = new WeakMap();
        this.cache = cache;
        if (client) {
            this.client = client;
        }
        if (resolvers) {
            this.addResolvers(resolvers);
        }
        if (fragmentMatcher) {
            this.setFragmentMatcher(fragmentMatcher);
        }
    }
    LocalState.prototype.addResolvers = function (resolvers) {
        var _this = this;
        this.resolvers = this.resolvers || {};
        if (Array.isArray(resolvers)) {
            resolvers.forEach(function (resolverGroup) {
                _this.resolvers = mergeDeep(_this.resolvers, resolverGroup);
            });
        }
        else {
            this.resolvers = mergeDeep(this.resolvers, resolvers);
        }
    };
    LocalState.prototype.setResolvers = function (resolvers) {
        this.resolvers = {};
        this.addResolvers(resolvers);
    };
    LocalState.prototype.getResolvers = function () {
        return this.resolvers || {};
    };
    // Run local client resolvers against the incoming query and remote data.
    // Locally resolved field values are merged with the incoming remote data,
    // and returned. Note that locally resolved fields will overwrite
    // remote data using the same field name.
    LocalState.prototype.runResolvers = function (_a) {
        return __awaiter(this, arguments, void 0, function (_b) {
            var document = _b.document, remoteResult = _b.remoteResult, context = _b.context, variables = _b.variables, _c = _b.onlyRunForcedResolvers, onlyRunForcedResolvers = _c === void 0 ? false : _c;
            return __generator(this, function (_d) {
                if (document) {
                    return [2 /*return*/, this.resolveDocument(document, remoteResult.data, context, variables, this.fragmentMatcher, onlyRunForcedResolvers).then(function (localResult) { return (__assign(__assign({}, remoteResult), { data: localResult.result })); })];
                }
                return [2 /*return*/, remoteResult];
            });
        });
    };
    LocalState.prototype.setFragmentMatcher = function (fragmentMatcher) {
        this.fragmentMatcher = fragmentMatcher;
    };
    LocalState.prototype.getFragmentMatcher = function () {
        return this.fragmentMatcher;
    };
    // Client queries contain everything in the incoming document (if a @client
    // directive is found).
    LocalState.prototype.clientQuery = function (document) {
        if (hasDirectives(["client"], document)) {
            if (this.resolvers) {
                return document;
            }
        }
        return null;
    };
    // Server queries are stripped of all @client based selection sets.
    LocalState.prototype.serverQuery = function (document) {
        return removeClientSetsFromDocument(document);
    };
    LocalState.prototype.prepareContext = function (context) {
        var cache = this.cache;
        return __assign(__assign({}, context), { cache: cache, 
            // Getting an entry's cache key is useful for local state resolvers.
            getCacheKey: function (obj) {
                return cache.identify(obj);
            } });
    };
    // To support `@client @export(as: "someVar")` syntax, we'll first resolve
    // @client @export fields locally, then pass the resolved values back to be
    // used alongside the original operation variables.
    LocalState.prototype.addExportedVariables = function (document_1) {
        return __awaiter(this, arguments, void 0, function (document, variables, context) {
            if (variables === void 0) { variables = {}; }
            if (context === void 0) { context = {}; }
            return __generator(this, function (_a) {
                if (document) {
                    return [2 /*return*/, this.resolveDocument(document, this.buildRootValueFromCache(document, variables) || {}, this.prepareContext(context), variables).then(function (data) { return (__assign(__assign({}, variables), data.exportedVariables)); })];
                }
                return [2 /*return*/, __assign({}, variables)];
            });
        });
    };
    LocalState.prototype.shouldForceResolvers = function (document) {
        var forceResolvers = false;
        visit(document, {
            Directive: {
                enter: function (node) {
                    if (node.name.value === "client" && node.arguments) {
                        forceResolvers = node.arguments.some(function (arg) {
                            return arg.name.value === "always" &&
                                arg.value.kind === "BooleanValue" &&
                                arg.value.value === true;
                        });
                        if (forceResolvers) {
                            return BREAK;
                        }
                    }
                },
            },
        });
        return forceResolvers;
    };
    // Query the cache and return matching data.
    LocalState.prototype.buildRootValueFromCache = function (document, variables) {
        return this.cache.diff({
            query: buildQueryFromSelectionSet(document),
            variables: variables,
            returnPartialData: true,
            optimistic: false,
        }).result;
    };
    LocalState.prototype.resolveDocument = function (document_1, rootValue_1) {
        return __awaiter(this, arguments, void 0, function (document, rootValue, context, variables, fragmentMatcher, onlyRunForcedResolvers) {
            var mainDefinition, fragments, fragmentMap, selectionsToResolve, definitionOperation, defaultOperationType, _a, cache, client, execContext, isClientFieldDescendant;
            if (context === void 0) { context = {}; }
            if (variables === void 0) { variables = {}; }
            if (fragmentMatcher === void 0) { fragmentMatcher = function () { return true; }; }
            if (onlyRunForcedResolvers === void 0) { onlyRunForcedResolvers = false; }
            return __generator(this, function (_b) {
                mainDefinition = getMainDefinition(document);
                fragments = getFragmentDefinitions(document);
                fragmentMap = createFragmentMap(fragments);
                selectionsToResolve = this.collectSelectionsToResolve(mainDefinition, fragmentMap);
                definitionOperation = mainDefinition.operation;
                defaultOperationType = definitionOperation ?
                    definitionOperation.charAt(0).toUpperCase() +
                        definitionOperation.slice(1)
                    : "Query";
                _a = this, cache = _a.cache, client = _a.client;
                execContext = {
                    fragmentMap: fragmentMap,
                    context: __assign(__assign({}, context), { cache: cache, client: client }),
                    variables: variables,
                    fragmentMatcher: fragmentMatcher,
                    defaultOperationType: defaultOperationType,
                    exportedVariables: {},
                    selectionsToResolve: selectionsToResolve,
                    onlyRunForcedResolvers: onlyRunForcedResolvers,
                };
                isClientFieldDescendant = false;
                return [2 /*return*/, this.resolveSelectionSet(mainDefinition.selectionSet, isClientFieldDescendant, rootValue, execContext).then(function (result) { return ({
                        result: result,
                        exportedVariables: execContext.exportedVariables,
                    }); })];
            });
        });
    };
    LocalState.prototype.resolveSelectionSet = function (selectionSet, isClientFieldDescendant, rootValue, execContext) {
        return __awaiter(this, void 0, void 0, function () {
            var fragmentMap, context, variables, resultsToMerge, execute;
            var _this = this;
            return __generator(this, function (_a) {
                fragmentMap = execContext.fragmentMap, context = execContext.context, variables = execContext.variables;
                resultsToMerge = [rootValue];
                execute = function (selection) { return __awaiter(_this, void 0, void 0, function () {
                    var fragment, typeCondition;
                    return __generator(this, function (_a) {
                        if (!isClientFieldDescendant &&
                            !execContext.selectionsToResolve.has(selection)) {
                            // Skip selections without @client directives
                            // (still processing if one of the ancestors or one of the child fields has @client directive)
                            return [2 /*return*/];
                        }
                        if (!shouldInclude(selection, variables)) {
                            // Skip this entirely.
                            return [2 /*return*/];
                        }
                        if (isField(selection)) {
                            return [2 /*return*/, this.resolveField(selection, isClientFieldDescendant, rootValue, execContext).then(function (fieldResult) {
                                    var _a;
                                    if (typeof fieldResult !== "undefined") {
                                        resultsToMerge.push((_a = {},
                                            _a[resultKeyNameFromField(selection)] = fieldResult,
                                            _a));
                                    }
                                })];
                        }
                        if (isInlineFragment(selection)) {
                            fragment = selection;
                        }
                        else {
                            // This is a named fragment.
                            fragment = fragmentMap[selection.name.value];
                            invariant(fragment, 18, selection.name.value);
                        }
                        if (fragment && fragment.typeCondition) {
                            typeCondition = fragment.typeCondition.name.value;
                            if (execContext.fragmentMatcher(rootValue, typeCondition, context)) {
                                return [2 /*return*/, this.resolveSelectionSet(fragment.selectionSet, isClientFieldDescendant, rootValue, execContext).then(function (fragmentResult) {
                                        resultsToMerge.push(fragmentResult);
                                    })];
                            }
                        }
                        return [2 /*return*/];
                    });
                }); };
                return [2 /*return*/, Promise.all(selectionSet.selections.map(execute)).then(function () {
                        return mergeDeepArray(resultsToMerge);
                    })];
            });
        });
    };
    LocalState.prototype.resolveField = function (field, isClientFieldDescendant, rootValue, execContext) {
        return __awaiter(this, void 0, void 0, function () {
            var variables, fieldName, aliasedFieldName, aliasUsed, defaultResult, resultPromise, resolverType, resolverMap, resolve;
            var _this = this;
            return __generator(this, function (_a) {
                if (!rootValue) {
                    return [2 /*return*/, null];
                }
                variables = execContext.variables;
                fieldName = field.name.value;
                aliasedFieldName = resultKeyNameFromField(field);
                aliasUsed = fieldName !== aliasedFieldName;
                defaultResult = rootValue[aliasedFieldName] || rootValue[fieldName];
                resultPromise = Promise.resolve(defaultResult);
                // Usually all local resolvers are run when passing through here, but
                // if we've specifically identified that we only want to run forced
                // resolvers (that is, resolvers for fields marked with
                // `@client(always: true)`), then we'll skip running non-forced resolvers.
                if (!execContext.onlyRunForcedResolvers ||
                    this.shouldForceResolvers(field)) {
                    resolverType = rootValue.__typename || execContext.defaultOperationType;
                    resolverMap = this.resolvers && this.resolvers[resolverType];
                    if (resolverMap) {
                        resolve = resolverMap[aliasUsed ? fieldName : aliasedFieldName];
                        if (resolve) {
                            resultPromise = Promise.resolve(
                            // In case the resolve function accesses reactive variables,
                            // set cacheSlot to the current cache instance.
                            cacheSlot.withValue(this.cache, resolve, [
                                rootValue,
                                argumentsObjectFromField(field, variables),
                                execContext.context,
                                { field: field, fragmentMap: execContext.fragmentMap },
                            ]));
                        }
                    }
                }
                return [2 /*return*/, resultPromise.then(function (result) {
                        var _a, _b;
                        if (result === void 0) { result = defaultResult; }
                        // If an @export directive is associated with the current field, store
                        // the `as` export variable name and current result for later use.
                        if (field.directives) {
                            field.directives.forEach(function (directive) {
                                if (directive.name.value === "export" && directive.arguments) {
                                    directive.arguments.forEach(function (arg) {
                                        if (arg.name.value === "as" && arg.value.kind === "StringValue") {
                                            execContext.exportedVariables[arg.value.value] = result;
                                        }
                                    });
                                }
                            });
                        }
                        // Handle all scalar types here.
                        if (!field.selectionSet) {
                            return result;
                        }
                        // From here down, the field has a selection set, which means it's trying
                        // to query a GraphQLObjectType.
                        if (result == null) {
                            // Basically any field in a GraphQL response can be null, or missing
                            return result;
                        }
                        var isClientField = (_b = (_a = field.directives) === null || _a === void 0 ? void 0 : _a.some(function (d) { return d.name.value === "client"; })) !== null && _b !== void 0 ? _b : false;
                        if (Array.isArray(result)) {
                            return _this.resolveSubSelectedArray(field, isClientFieldDescendant || isClientField, result, execContext);
                        }
                        // Returned value is an object, and the query has a sub-selection. Recurse.
                        if (field.selectionSet) {
                            return _this.resolveSelectionSet(field.selectionSet, isClientFieldDescendant || isClientField, result, execContext);
                        }
                    })];
            });
        });
    };
    LocalState.prototype.resolveSubSelectedArray = function (field, isClientFieldDescendant, result, execContext) {
        var _this = this;
        return Promise.all(result.map(function (item) {
            if (item === null) {
                return null;
            }
            // This is a nested array, recurse.
            if (Array.isArray(item)) {
                return _this.resolveSubSelectedArray(field, isClientFieldDescendant, item, execContext);
            }
            // This is an object, run the selection set on it.
            if (field.selectionSet) {
                return _this.resolveSelectionSet(field.selectionSet, isClientFieldDescendant, item, execContext);
            }
        }));
    };
    // Collect selection nodes on paths from document root down to all @client directives.
    // This function takes into account transitive fragment spreads.
    // Complexity equals to a single `visit` over the full document.
    LocalState.prototype.collectSelectionsToResolve = function (mainDefinition, fragmentMap) {
        var isSingleASTNode = function (node) { return !Array.isArray(node); };
        var selectionsToResolveCache = this.selectionsToResolveCache;
        function collectByDefinition(definitionNode) {
            if (!selectionsToResolveCache.has(definitionNode)) {
                var matches_1 = new Set();
                selectionsToResolveCache.set(definitionNode, matches_1);
                visit(definitionNode, {
                    Directive: function (node, _, __, ___, ancestors) {
                        if (node.name.value === "client") {
                            ancestors.forEach(function (node) {
                                if (isSingleASTNode(node) && isSelectionNode(node)) {
                                    matches_1.add(node);
                                }
                            });
                        }
                    },
                    FragmentSpread: function (spread, _, __, ___, ancestors) {
                        var fragment = fragmentMap[spread.name.value];
                        invariant(fragment, 19, spread.name.value);
                        var fragmentSelections = collectByDefinition(fragment);
                        if (fragmentSelections.size > 0) {
                            // Fragment for this spread contains @client directive (either directly or transitively)
                            // Collect selection nodes on paths from the root down to fields with the @client directive
                            ancestors.forEach(function (node) {
                                if (isSingleASTNode(node) && isSelectionNode(node)) {
                                    matches_1.add(node);
                                }
                            });
                            matches_1.add(spread);
                            fragmentSelections.forEach(function (selection) {
                                matches_1.add(selection);
                            });
                        }
                    },
                });
            }
            return selectionsToResolveCache.get(definitionNode);
        }
        return collectByDefinition(mainDefinition);
    };
    return LocalState;
}());
export { LocalState };
//# sourceMappingURL=LocalState.js.map