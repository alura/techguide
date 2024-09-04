import { __assign, __extends, __rest } from "tslib";
import { invariant } from "../../utilities/globals/index.js";
import { dep } from "optimism";
import { equal } from "@wry/equality";
import { Trie } from "@wry/trie";
import { isReference, makeReference, DeepMerger, maybeDeepFreeze, canUseWeakMap, isNonNullObject, } from "../../utilities/index.js";
import { hasOwn, fieldNameFromStoreName } from "./helpers.js";
var DELETE = Object.create(null);
var delModifier = function () { return DELETE; };
var INVALIDATE = Object.create(null);
var EntityStore = /** @class */ (function () {
    function EntityStore(policies, group) {
        var _this = this;
        this.policies = policies;
        this.group = group;
        this.data = Object.create(null);
        // Maps root entity IDs to the number of times they have been retained, minus
        // the number of times they have been released. Retained entities keep other
        // entities they reference (even indirectly) from being garbage collected.
        this.rootIds = Object.create(null);
        // Lazily tracks { __ref: <dataId> } strings contained by this.data[dataId].
        this.refs = Object.create(null);
        // Bound function that can be passed around to provide easy access to fields
        // of Reference objects as well as ordinary objects.
        this.getFieldValue = function (objectOrReference, storeFieldName) {
            return maybeDeepFreeze(isReference(objectOrReference) ?
                _this.get(objectOrReference.__ref, storeFieldName)
                : objectOrReference && objectOrReference[storeFieldName]);
        };
        // Returns true for non-normalized StoreObjects and non-dangling
        // References, indicating that readField(name, objOrRef) has a chance of
        // working. Useful for filtering out dangling references from lists.
        this.canRead = function (objOrRef) {
            return isReference(objOrRef) ?
                _this.has(objOrRef.__ref)
                : typeof objOrRef === "object";
        };
        // Bound function that converts an id or an object with a __typename and
        // primary key fields to a Reference object. If called with a Reference object,
        // that same Reference object is returned. Pass true for mergeIntoStore to persist
        // an object into the store.
        this.toReference = function (objOrIdOrRef, mergeIntoStore) {
            if (typeof objOrIdOrRef === "string") {
                return makeReference(objOrIdOrRef);
            }
            if (isReference(objOrIdOrRef)) {
                return objOrIdOrRef;
            }
            var id = _this.policies.identify(objOrIdOrRef)[0];
            if (id) {
                var ref = makeReference(id);
                if (mergeIntoStore) {
                    _this.merge(id, objOrIdOrRef);
                }
                return ref;
            }
        };
    }
    // Although the EntityStore class is abstract, it contains concrete
    // implementations of the various NormalizedCache interface methods that
    // are inherited by the Root and Layer subclasses.
    EntityStore.prototype.toObject = function () {
        return __assign({}, this.data);
    };
    EntityStore.prototype.has = function (dataId) {
        return this.lookup(dataId, true) !== void 0;
    };
    EntityStore.prototype.get = function (dataId, fieldName) {
        this.group.depend(dataId, fieldName);
        if (hasOwn.call(this.data, dataId)) {
            var storeObject = this.data[dataId];
            if (storeObject && hasOwn.call(storeObject, fieldName)) {
                return storeObject[fieldName];
            }
        }
        if (fieldName === "__typename" &&
            hasOwn.call(this.policies.rootTypenamesById, dataId)) {
            return this.policies.rootTypenamesById[dataId];
        }
        if (this instanceof Layer) {
            return this.parent.get(dataId, fieldName);
        }
    };
    EntityStore.prototype.lookup = function (dataId, dependOnExistence) {
        // The has method (above) calls lookup with dependOnExistence = true, so
        // that it can later be invalidated when we add or remove a StoreObject for
        // this dataId. Any consumer who cares about the contents of the StoreObject
        // should not rely on this dependency, since the contents could change
        // without the object being added or removed.
        if (dependOnExistence)
            this.group.depend(dataId, "__exists");
        if (hasOwn.call(this.data, dataId)) {
            return this.data[dataId];
        }
        if (this instanceof Layer) {
            return this.parent.lookup(dataId, dependOnExistence);
        }
        if (this.policies.rootTypenamesById[dataId]) {
            return Object.create(null);
        }
    };
    EntityStore.prototype.merge = function (older, newer) {
        var _this = this;
        var dataId;
        // Convert unexpected references to ID strings.
        if (isReference(older))
            older = older.__ref;
        if (isReference(newer))
            newer = newer.__ref;
        var existing = typeof older === "string" ? this.lookup((dataId = older)) : older;
        var incoming = typeof newer === "string" ? this.lookup((dataId = newer)) : newer;
        // If newer was a string ID, but that ID was not defined in this store,
        // then there are no fields to be merged, so we're done.
        if (!incoming)
            return;
        invariant(typeof dataId === "string", 1);
        var merged = new DeepMerger(storeObjectReconciler).merge(existing, incoming);
        // Even if merged === existing, existing may have come from a lower
        // layer, so we always need to set this.data[dataId] on this level.
        this.data[dataId] = merged;
        if (merged !== existing) {
            delete this.refs[dataId];
            if (this.group.caching) {
                var fieldsToDirty_1 = Object.create(null);
                // If we added a new StoreObject where there was previously none, dirty
                // anything that depended on the existence of this dataId, such as the
                // EntityStore#has method.
                if (!existing)
                    fieldsToDirty_1.__exists = 1;
                // Now invalidate dependents who called getFieldValue for any fields
                // that are changing as a result of this merge.
                Object.keys(incoming).forEach(function (storeFieldName) {
                    if (!existing ||
                        existing[storeFieldName] !== merged[storeFieldName]) {
                        // Always dirty the full storeFieldName, which may include
                        // serialized arguments following the fieldName prefix.
                        fieldsToDirty_1[storeFieldName] = 1;
                        // Also dirty fieldNameFromStoreName(storeFieldName) if it's
                        // different from storeFieldName and this field does not have
                        // keyArgs configured, because that means the cache can't make
                        // any assumptions about how field values with the same field
                        // name but different arguments might be interrelated, so it
                        // must err on the side of invalidating all field values that
                        // share the same short fieldName, regardless of arguments.
                        var fieldName = fieldNameFromStoreName(storeFieldName);
                        if (fieldName !== storeFieldName &&
                            !_this.policies.hasKeyArgs(merged.__typename, fieldName)) {
                            fieldsToDirty_1[fieldName] = 1;
                        }
                        // If merged[storeFieldName] has become undefined, and this is the
                        // Root layer, actually delete the property from the merged object,
                        // which is guaranteed to have been created fresh in this method.
                        if (merged[storeFieldName] === void 0 && !(_this instanceof Layer)) {
                            delete merged[storeFieldName];
                        }
                    }
                });
                if (fieldsToDirty_1.__typename &&
                    !(existing && existing.__typename) &&
                    // Since we return default root __typename strings
                    // automatically from store.get, we don't need to dirty the
                    // ROOT_QUERY.__typename field if merged.__typename is equal
                    // to the default string (usually "Query").
                    this.policies.rootTypenamesById[dataId] === merged.__typename) {
                    delete fieldsToDirty_1.__typename;
                }
                Object.keys(fieldsToDirty_1).forEach(function (fieldName) {
                    return _this.group.dirty(dataId, fieldName);
                });
            }
        }
    };
    EntityStore.prototype.modify = function (dataId, fields) {
        var _this = this;
        var storeObject = this.lookup(dataId);
        if (storeObject) {
            var changedFields_1 = Object.create(null);
            var needToMerge_1 = false;
            var allDeleted_1 = true;
            var sharedDetails_1 = {
                DELETE: DELETE,
                INVALIDATE: INVALIDATE,
                isReference: isReference,
                toReference: this.toReference,
                canRead: this.canRead,
                readField: function (fieldNameOrOptions, from) {
                    return _this.policies.readField(typeof fieldNameOrOptions === "string" ?
                        {
                            fieldName: fieldNameOrOptions,
                            from: from || makeReference(dataId),
                        }
                        : fieldNameOrOptions, { store: _this });
                },
            };
            Object.keys(storeObject).forEach(function (storeFieldName) {
                var fieldName = fieldNameFromStoreName(storeFieldName);
                var fieldValue = storeObject[storeFieldName];
                if (fieldValue === void 0)
                    return;
                var modify = typeof fields === "function" ? fields : (fields[storeFieldName] || fields[fieldName]);
                if (modify) {
                    var newValue = modify === delModifier ? DELETE : (modify(maybeDeepFreeze(fieldValue), __assign(__assign({}, sharedDetails_1), { fieldName: fieldName, storeFieldName: storeFieldName, storage: _this.getStorage(dataId, storeFieldName) })));
                    if (newValue === INVALIDATE) {
                        _this.group.dirty(dataId, storeFieldName);
                    }
                    else {
                        if (newValue === DELETE)
                            newValue = void 0;
                        if (newValue !== fieldValue) {
                            changedFields_1[storeFieldName] = newValue;
                            needToMerge_1 = true;
                            fieldValue = newValue;
                            if (globalThis.__DEV__ !== false) {
                                var checkReference = function (ref) {
                                    if (_this.lookup(ref.__ref) === undefined) {
                                        globalThis.__DEV__ !== false && invariant.warn(2, ref);
                                        return true;
                                    }
                                };
                                if (isReference(newValue)) {
                                    checkReference(newValue);
                                }
                                else if (Array.isArray(newValue)) {
                                    // Warn about writing "mixed" arrays of Reference and non-Reference objects
                                    var seenReference = false;
                                    var someNonReference = void 0;
                                    for (var _i = 0, newValue_1 = newValue; _i < newValue_1.length; _i++) {
                                        var value = newValue_1[_i];
                                        if (isReference(value)) {
                                            seenReference = true;
                                            if (checkReference(value))
                                                break;
                                        }
                                        else {
                                            // Do not warn on primitive values, since those could never be represented
                                            // by a reference. This is a valid (albeit uncommon) use case.
                                            if (typeof value === "object" && !!value) {
                                                var id = _this.policies.identify(value)[0];
                                                // check if object could even be referenced, otherwise we are not interested in it for this warning
                                                if (id) {
                                                    someNonReference = value;
                                                }
                                            }
                                        }
                                        if (seenReference && someNonReference !== undefined) {
                                            globalThis.__DEV__ !== false && invariant.warn(3, someNonReference);
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                if (fieldValue !== void 0) {
                    allDeleted_1 = false;
                }
            });
            if (needToMerge_1) {
                this.merge(dataId, changedFields_1);
                if (allDeleted_1) {
                    if (this instanceof Layer) {
                        this.data[dataId] = void 0;
                    }
                    else {
                        delete this.data[dataId];
                    }
                    this.group.dirty(dataId, "__exists");
                }
                return true;
            }
        }
        return false;
    };
    // If called with only one argument, removes the entire entity
    // identified by dataId. If called with a fieldName as well, removes all
    // fields of that entity whose names match fieldName according to the
    // fieldNameFromStoreName helper function. If called with a fieldName
    // and variables, removes all fields of that entity whose names match fieldName
    // and whose arguments when cached exactly match the variables passed.
    EntityStore.prototype.delete = function (dataId, fieldName, args) {
        var _a;
        var storeObject = this.lookup(dataId);
        if (storeObject) {
            var typename = this.getFieldValue(storeObject, "__typename");
            var storeFieldName = fieldName && args ?
                this.policies.getStoreFieldName({ typename: typename, fieldName: fieldName, args: args })
                : fieldName;
            return this.modify(dataId, storeFieldName ? (_a = {},
                _a[storeFieldName] = delModifier,
                _a) : delModifier);
        }
        return false;
    };
    EntityStore.prototype.evict = function (options, limit) {
        var evicted = false;
        if (options.id) {
            if (hasOwn.call(this.data, options.id)) {
                evicted = this.delete(options.id, options.fieldName, options.args);
            }
            if (this instanceof Layer && this !== limit) {
                evicted = this.parent.evict(options, limit) || evicted;
            }
            // Always invalidate the field to trigger rereading of watched
            // queries, even if no cache data was modified by the eviction,
            // because queries may depend on computed fields with custom read
            // functions, whose values are not stored in the EntityStore.
            if (options.fieldName || evicted) {
                this.group.dirty(options.id, options.fieldName || "__exists");
            }
        }
        return evicted;
    };
    EntityStore.prototype.clear = function () {
        this.replace(null);
    };
    EntityStore.prototype.extract = function () {
        var _this = this;
        var obj = this.toObject();
        var extraRootIds = [];
        this.getRootIdSet().forEach(function (id) {
            if (!hasOwn.call(_this.policies.rootTypenamesById, id)) {
                extraRootIds.push(id);
            }
        });
        if (extraRootIds.length) {
            obj.__META = { extraRootIds: extraRootIds.sort() };
        }
        return obj;
    };
    EntityStore.prototype.replace = function (newData) {
        var _this = this;
        Object.keys(this.data).forEach(function (dataId) {
            if (!(newData && hasOwn.call(newData, dataId))) {
                _this.delete(dataId);
            }
        });
        if (newData) {
            var __META = newData.__META, rest_1 = __rest(newData, ["__META"]);
            Object.keys(rest_1).forEach(function (dataId) {
                _this.merge(dataId, rest_1[dataId]);
            });
            if (__META) {
                __META.extraRootIds.forEach(this.retain, this);
            }
        }
    };
    EntityStore.prototype.retain = function (rootId) {
        return (this.rootIds[rootId] = (this.rootIds[rootId] || 0) + 1);
    };
    EntityStore.prototype.release = function (rootId) {
        if (this.rootIds[rootId] > 0) {
            var count = --this.rootIds[rootId];
            if (!count)
                delete this.rootIds[rootId];
            return count;
        }
        return 0;
    };
    // Return a Set<string> of all the ID strings that have been retained by
    // this layer/root *and* any layers/roots beneath it.
    EntityStore.prototype.getRootIdSet = function (ids) {
        if (ids === void 0) { ids = new Set(); }
        Object.keys(this.rootIds).forEach(ids.add, ids);
        if (this instanceof Layer) {
            this.parent.getRootIdSet(ids);
        }
        else {
            // Official singleton IDs like ROOT_QUERY and ROOT_MUTATION are
            // always considered roots for garbage collection, regardless of
            // their retainment counts in this.rootIds.
            Object.keys(this.policies.rootTypenamesById).forEach(ids.add, ids);
        }
        return ids;
    };
    // The goal of garbage collection is to remove IDs from the Root layer of the
    // store that are no longer reachable starting from any IDs that have been
    // explicitly retained (see retain and release, above). Returns an array of
    // dataId strings that were removed from the store.
    EntityStore.prototype.gc = function () {
        var _this = this;
        var ids = this.getRootIdSet();
        var snapshot = this.toObject();
        ids.forEach(function (id) {
            if (hasOwn.call(snapshot, id)) {
                // Because we are iterating over an ECMAScript Set, the IDs we add here
                // will be visited in later iterations of the forEach loop only if they
                // were not previously contained by the Set.
                Object.keys(_this.findChildRefIds(id)).forEach(ids.add, ids);
                // By removing IDs from the snapshot object here, we protect them from
                // getting removed from the root store layer below.
                delete snapshot[id];
            }
        });
        var idsToRemove = Object.keys(snapshot);
        if (idsToRemove.length) {
            var root_1 = this;
            while (root_1 instanceof Layer)
                root_1 = root_1.parent;
            idsToRemove.forEach(function (id) { return root_1.delete(id); });
        }
        return idsToRemove;
    };
    EntityStore.prototype.findChildRefIds = function (dataId) {
        if (!hasOwn.call(this.refs, dataId)) {
            var found_1 = (this.refs[dataId] = Object.create(null));
            var root = this.data[dataId];
            if (!root)
                return found_1;
            var workSet_1 = new Set([root]);
            // Within the store, only arrays and objects can contain child entity
            // references, so we can prune the traversal using this predicate:
            workSet_1.forEach(function (obj) {
                if (isReference(obj)) {
                    found_1[obj.__ref] = true;
                    // In rare cases, a { __ref } Reference object may have other fields.
                    // This often indicates a mismerging of References with StoreObjects,
                    // but garbage collection should not be fooled by a stray __ref
                    // property in a StoreObject (ignoring all the other fields just
                    // because the StoreObject looks like a Reference). To avoid this
                    // premature termination of findChildRefIds recursion, we fall through
                    // to the code below, which will handle any other properties of obj.
                }
                if (isNonNullObject(obj)) {
                    Object.keys(obj).forEach(function (key) {
                        var child = obj[key];
                        // No need to add primitive values to the workSet, since they cannot
                        // contain reference objects.
                        if (isNonNullObject(child)) {
                            workSet_1.add(child);
                        }
                    });
                }
            });
        }
        return this.refs[dataId];
    };
    EntityStore.prototype.makeCacheKey = function () {
        return this.group.keyMaker.lookupArray(arguments);
    };
    return EntityStore;
}());
export { EntityStore };
// A single CacheGroup represents a set of one or more EntityStore objects,
// typically the Root store in a CacheGroup by itself, and all active Layer
// stores in a group together. A single EntityStore object belongs to only
// one CacheGroup, store.group. The CacheGroup is responsible for tracking
// dependencies, so store.group is helpful for generating unique keys for
// cached results that need to be invalidated when/if those dependencies
// change. If we used the EntityStore objects themselves as cache keys (that
// is, store rather than store.group), the cache would become unnecessarily
// fragmented by all the different Layer objects. Instead, the CacheGroup
// approach allows all optimistic Layer objects in the same linked list to
// belong to one CacheGroup, with the non-optimistic Root object belonging
// to another CacheGroup, allowing resultCaching dependencies to be tracked
// separately for optimistic and non-optimistic entity data.
var CacheGroup = /** @class */ (function () {
    function CacheGroup(caching, parent) {
        if (parent === void 0) { parent = null; }
        this.caching = caching;
        this.parent = parent;
        this.d = null;
        this.resetCaching();
    }
    CacheGroup.prototype.resetCaching = function () {
        this.d = this.caching ? dep() : null;
        this.keyMaker = new Trie(canUseWeakMap);
    };
    CacheGroup.prototype.depend = function (dataId, storeFieldName) {
        if (this.d) {
            this.d(makeDepKey(dataId, storeFieldName));
            var fieldName = fieldNameFromStoreName(storeFieldName);
            if (fieldName !== storeFieldName) {
                // Fields with arguments that contribute extra identifying
                // information to the fieldName (thus forming the storeFieldName)
                // depend not only on the full storeFieldName but also on the
                // short fieldName, so the field can be invalidated using either
                // level of specificity.
                this.d(makeDepKey(dataId, fieldName));
            }
            if (this.parent) {
                this.parent.depend(dataId, storeFieldName);
            }
        }
    };
    CacheGroup.prototype.dirty = function (dataId, storeFieldName) {
        if (this.d) {
            this.d.dirty(makeDepKey(dataId, storeFieldName), 
            // When storeFieldName === "__exists", that means the entity identified
            // by dataId has either disappeared from the cache or was newly added,
            // so the result caching system would do well to "forget everything it
            // knows" about that object. To achieve that kind of invalidation, we
            // not only dirty the associated result cache entry, but also remove it
            // completely from the dependency graph. For the optimism implementation
            // details, see https://github.com/benjamn/optimism/pull/195.
            storeFieldName === "__exists" ? "forget" : "setDirty");
        }
    };
    return CacheGroup;
}());
function makeDepKey(dataId, storeFieldName) {
    // Since field names cannot have '#' characters in them, this method
    // of joining the field name and the ID should be unambiguous, and much
    // cheaper than JSON.stringify([dataId, fieldName]).
    return storeFieldName + "#" + dataId;
}
export function maybeDependOnExistenceOfEntity(store, entityId) {
    if (supportsResultCaching(store)) {
        // We use this pseudo-field __exists elsewhere in the EntityStore code to
        // represent changes in the existence of the entity object identified by
        // entityId. This dependency gets reliably dirtied whenever an object with
        // this ID is deleted (or newly created) within this group, so any result
        // cache entries (for example, StoreReader#executeSelectionSet results) that
        // depend on __exists for this entityId will get dirtied as well, leading to
        // the eventual recomputation (instead of reuse) of those result objects the
        // next time someone reads them from the cache.
        store.group.depend(entityId, "__exists");
    }
}
(function (EntityStore) {
    // Refer to this class as EntityStore.Root outside this namespace.
    var Root = /** @class */ (function (_super) {
        __extends(Root, _super);
        function Root(_a) {
            var policies = _a.policies, _b = _a.resultCaching, resultCaching = _b === void 0 ? true : _b, seed = _a.seed;
            var _this = _super.call(this, policies, new CacheGroup(resultCaching)) || this;
            _this.stump = new Stump(_this);
            _this.storageTrie = new Trie(canUseWeakMap);
            if (seed)
                _this.replace(seed);
            return _this;
        }
        Root.prototype.addLayer = function (layerId, replay) {
            // Adding an optimistic Layer on top of the Root actually adds the Layer
            // on top of the Stump, so the Stump always comes between the Root and
            // any Layer objects that we've added.
            return this.stump.addLayer(layerId, replay);
        };
        Root.prototype.removeLayer = function () {
            // Never remove the root layer.
            return this;
        };
        Root.prototype.getStorage = function () {
            return this.storageTrie.lookupArray(arguments);
        };
        return Root;
    }(EntityStore));
    EntityStore.Root = Root;
})(EntityStore || (EntityStore = {}));
// Not exported, since all Layer instances are created by the addLayer method
// of the EntityStore.Root class.
var Layer = /** @class */ (function (_super) {
    __extends(Layer, _super);
    function Layer(id, parent, replay, group) {
        var _this = _super.call(this, parent.policies, group) || this;
        _this.id = id;
        _this.parent = parent;
        _this.replay = replay;
        _this.group = group;
        replay(_this);
        return _this;
    }
    Layer.prototype.addLayer = function (layerId, replay) {
        return new Layer(layerId, this, replay, this.group);
    };
    Layer.prototype.removeLayer = function (layerId) {
        var _this = this;
        // Remove all instances of the given id, not just the first one.
        var parent = this.parent.removeLayer(layerId);
        if (layerId === this.id) {
            if (this.group.caching) {
                // Dirty every ID we're removing. Technically we might be able to avoid
                // dirtying fields that have values in higher layers, but we don't have
                // easy access to higher layers here, and we're about to recreate those
                // layers anyway (see parent.addLayer below).
                Object.keys(this.data).forEach(function (dataId) {
                    var ownStoreObject = _this.data[dataId];
                    var parentStoreObject = parent["lookup"](dataId);
                    if (!parentStoreObject) {
                        // The StoreObject identified by dataId was defined in this layer
                        // but will be undefined in the parent layer, so we can delete the
                        // whole entity using this.delete(dataId). Since we're about to
                        // throw this layer away, the only goal of this deletion is to dirty
                        // the removed fields.
                        _this.delete(dataId);
                    }
                    else if (!ownStoreObject) {
                        // This layer had an entry for dataId but it was undefined, which
                        // means the entity was deleted in this layer, and it's about to
                        // become undeleted when we remove this layer, so we need to dirty
                        // all fields that are about to be reexposed.
                        _this.group.dirty(dataId, "__exists");
                        Object.keys(parentStoreObject).forEach(function (storeFieldName) {
                            _this.group.dirty(dataId, storeFieldName);
                        });
                    }
                    else if (ownStoreObject !== parentStoreObject) {
                        // If ownStoreObject is not exactly the same as parentStoreObject,
                        // dirty any fields whose values will change as a result of this
                        // removal.
                        Object.keys(ownStoreObject).forEach(function (storeFieldName) {
                            if (!equal(ownStoreObject[storeFieldName], parentStoreObject[storeFieldName])) {
                                _this.group.dirty(dataId, storeFieldName);
                            }
                        });
                    }
                });
            }
            return parent;
        }
        // No changes are necessary if the parent chain remains identical.
        if (parent === this.parent)
            return this;
        // Recreate this layer on top of the new parent.
        return parent.addLayer(this.id, this.replay);
    };
    Layer.prototype.toObject = function () {
        return __assign(__assign({}, this.parent.toObject()), this.data);
    };
    Layer.prototype.findChildRefIds = function (dataId) {
        var fromParent = this.parent.findChildRefIds(dataId);
        return hasOwn.call(this.data, dataId) ? __assign(__assign({}, fromParent), _super.prototype.findChildRefIds.call(this, dataId)) : fromParent;
    };
    Layer.prototype.getStorage = function () {
        var p = this.parent;
        while (p.parent)
            p = p.parent;
        return p.getStorage.apply(p, 
        // @ts-expect-error
        arguments);
    };
    return Layer;
}(EntityStore));
// Represents a Layer permanently installed just above the Root, which allows
// reading optimistically (and registering optimistic dependencies) even when
// no optimistic layers are currently active. The stump.group CacheGroup object
// is shared by any/all Layer objects added on top of the Stump.
var Stump = /** @class */ (function (_super) {
    __extends(Stump, _super);
    function Stump(root) {
        return _super.call(this, "EntityStore.Stump", root, function () { }, new CacheGroup(root.group.caching, root.group)) || this;
    }
    Stump.prototype.removeLayer = function () {
        // Never remove the Stump layer.
        return this;
    };
    Stump.prototype.merge = function (older, newer) {
        // We never want to write any data into the Stump, so we forward any merge
        // calls to the Root instead. Another option here would be to throw an
        // exception, but the toReference(object, true) function can sometimes
        // trigger Stump writes (which used to be Root writes, before the Stump
        // concept was introduced).
        return this.parent.merge(older, newer);
    };
    return Stump;
}(Layer));
function storeObjectReconciler(existingObject, incomingObject, property) {
    var existingValue = existingObject[property];
    var incomingValue = incomingObject[property];
    // Wherever there is a key collision, prefer the incoming value, unless
    // it is deeply equal to the existing value. It's worth checking deep
    // equality here (even though blindly returning incoming would be
    // logically correct) because preserving the referential identity of
    // existing data can prevent needless rereading and rerendering.
    return equal(existingValue, incomingValue) ? existingValue : incomingValue;
}
export function supportsResultCaching(store) {
    // When result caching is disabled, store.depend will be null.
    return !!(store instanceof EntityStore && store.group.caching);
}
//# sourceMappingURL=entityStore.js.map