'use strict';

var trie = require('@wry/trie');
var caches$1 = require('@wry/caches');
var context = require('@wry/context');

var parentEntrySlot = new context.Slot();
function nonReactive(fn) {
    return parentEntrySlot.withValue(void 0, fn);
}

var hasOwnProperty = Object.prototype.hasOwnProperty;
var arrayFromSet = Array.from ||
    function (set) {
        var array = [];
        set.forEach(function (item) { return array.push(item); });
        return array;
    };
function maybeUnsubscribe(entryOrDep) {
    var unsubscribe = entryOrDep.unsubscribe;
    if (typeof unsubscribe === "function") {
        entryOrDep.unsubscribe = void 0;
        unsubscribe();
    }
}

var emptySetPool = [];
var POOL_TARGET_SIZE = 100;
// Since this package might be used browsers, we should avoid using the
// Node built-in assert module.
function assert(condition, optionalMessage) {
    if (!condition) {
        throw new Error(optionalMessage || "assertion failure");
    }
}
function valueIs(a, b) {
    var len = a.length;
    return (
    // Unknown values are not equal to each other.
    len > 0 &&
        // Both values must be ordinary (or both exceptional) to be equal.
        len === b.length &&
        // The underlying value or exception must be the same.
        a[len - 1] === b[len - 1]);
}
function valueGet(value) {
    switch (value.length) {
        case 0: throw new Error("unknown value");
        case 1: return value[0];
        case 2: throw value[1];
    }
}
function valueCopy(value) {
    return value.slice(0);
}
var Entry = /** @class */ (function () {
    function Entry(fn) {
        this.fn = fn;
        this.parents = new Set();
        this.childValues = new Map();
        // When this Entry has children that are dirty, this property becomes
        // a Set containing other Entry objects, borrowed from emptySetPool.
        // When the set becomes empty, it gets recycled back to emptySetPool.
        this.dirtyChildren = null;
        this.dirty = true;
        this.recomputing = false;
        this.value = [];
        this.deps = null;
        ++Entry.count;
    }
    Entry.prototype.peek = function () {
        if (this.value.length === 1 && !mightBeDirty(this)) {
            rememberParent(this);
            return this.value[0];
        }
    };
    // This is the most important method of the Entry API, because it
    // determines whether the cached this.value can be returned immediately,
    // or must be recomputed. The overall performance of the caching system
    // depends on the truth of the following observations: (1) this.dirty is
    // usually false, (2) this.dirtyChildren is usually null/empty, and thus
    // (3) valueGet(this.value) is usually returned without recomputation.
    Entry.prototype.recompute = function (args) {
        assert(!this.recomputing, "already recomputing");
        rememberParent(this);
        return mightBeDirty(this)
            ? reallyRecompute(this, args)
            : valueGet(this.value);
    };
    Entry.prototype.setDirty = function () {
        if (this.dirty)
            return;
        this.dirty = true;
        reportDirty(this);
        // We can go ahead and unsubscribe here, since any further dirty
        // notifications we receive will be redundant, and unsubscribing may
        // free up some resources, e.g. file watchers.
        maybeUnsubscribe(this);
    };
    Entry.prototype.dispose = function () {
        var _this = this;
        this.setDirty();
        // Sever any dependency relationships with our own children, so those
        // children don't retain this parent Entry in their child.parents sets,
        // thereby preventing it from being fully garbage collected.
        forgetChildren(this);
        // Because this entry has been kicked out of the cache (in index.js),
        // we've lost the ability to find out if/when this entry becomes dirty,
        // whether that happens through a subscription, because of a direct call
        // to entry.setDirty(), or because one of its children becomes dirty.
        // Because of this loss of future information, we have to assume the
        // worst (that this entry might have become dirty very soon), so we must
        // immediately mark this entry's parents as dirty. Normally we could
        // just call entry.setDirty() rather than calling parent.setDirty() for
        // each parent, but that would leave this entry in parent.childValues
        // and parent.dirtyChildren, which would prevent the child from being
        // truly forgotten.
        eachParent(this, function (parent, child) {
            parent.setDirty();
            forgetChild(parent, _this);
        });
    };
    Entry.prototype.forget = function () {
        // The code that creates Entry objects in index.ts will replace this method
        // with one that actually removes the Entry from the cache, which will also
        // trigger the entry.dispose method.
        this.dispose();
    };
    Entry.prototype.dependOn = function (dep) {
        dep.add(this);
        if (!this.deps) {
            this.deps = emptySetPool.pop() || new Set();
        }
        this.deps.add(dep);
    };
    Entry.prototype.forgetDeps = function () {
        var _this = this;
        if (this.deps) {
            arrayFromSet(this.deps).forEach(function (dep) { return dep.delete(_this); });
            this.deps.clear();
            emptySetPool.push(this.deps);
            this.deps = null;
        }
    };
    Entry.count = 0;
    return Entry;
}());
function rememberParent(child) {
    var parent = parentEntrySlot.getValue();
    if (parent) {
        child.parents.add(parent);
        if (!parent.childValues.has(child)) {
            parent.childValues.set(child, []);
        }
        if (mightBeDirty(child)) {
            reportDirtyChild(parent, child);
        }
        else {
            reportCleanChild(parent, child);
        }
        return parent;
    }
}
function reallyRecompute(entry, args) {
    forgetChildren(entry);
    // Set entry as the parent entry while calling recomputeNewValue(entry).
    parentEntrySlot.withValue(entry, recomputeNewValue, [entry, args]);
    if (maybeSubscribe(entry, args)) {
        // If we successfully recomputed entry.value and did not fail to
        // (re)subscribe, then this Entry is no longer explicitly dirty.
        setClean(entry);
    }
    return valueGet(entry.value);
}
function recomputeNewValue(entry, args) {
    entry.recomputing = true;
    var normalizeResult = entry.normalizeResult;
    var oldValueCopy;
    if (normalizeResult && entry.value.length === 1) {
        oldValueCopy = valueCopy(entry.value);
    }
    // Make entry.value an empty array, representing an unknown value.
    entry.value.length = 0;
    try {
        // If entry.fn succeeds, entry.value will become a normal Value.
        entry.value[0] = entry.fn.apply(null, args);
        // If we have a viable oldValueCopy to compare with the (successfully
        // recomputed) new entry.value, and they are not already === identical, give
        // normalizeResult a chance to pick/choose/reuse parts of oldValueCopy[0]
        // and/or entry.value[0] to determine the final cached entry.value.
        if (normalizeResult && oldValueCopy && !valueIs(oldValueCopy, entry.value)) {
            try {
                entry.value[0] = normalizeResult(entry.value[0], oldValueCopy[0]);
            }
            catch (_a) {
                // If normalizeResult throws, just use the newer value, rather than
                // saving the exception as entry.value[1].
            }
        }
    }
    catch (e) {
        // If entry.fn throws, entry.value will hold that exception.
        entry.value[1] = e;
    }
    // Either way, this line is always reached.
    entry.recomputing = false;
}
function mightBeDirty(entry) {
    return entry.dirty || !!(entry.dirtyChildren && entry.dirtyChildren.size);
}
function setClean(entry) {
    entry.dirty = false;
    if (mightBeDirty(entry)) {
        // This Entry may still have dirty children, in which case we can't
        // let our parents know we're clean just yet.
        return;
    }
    reportClean(entry);
}
function reportDirty(child) {
    eachParent(child, reportDirtyChild);
}
function reportClean(child) {
    eachParent(child, reportCleanChild);
}
function eachParent(child, callback) {
    var parentCount = child.parents.size;
    if (parentCount) {
        var parents = arrayFromSet(child.parents);
        for (var i = 0; i < parentCount; ++i) {
            callback(parents[i], child);
        }
    }
}
// Let a parent Entry know that one of its children may be dirty.
function reportDirtyChild(parent, child) {
    // Must have called rememberParent(child) before calling
    // reportDirtyChild(parent, child).
    assert(parent.childValues.has(child));
    assert(mightBeDirty(child));
    var parentWasClean = !mightBeDirty(parent);
    if (!parent.dirtyChildren) {
        parent.dirtyChildren = emptySetPool.pop() || new Set;
    }
    else if (parent.dirtyChildren.has(child)) {
        // If we already know this child is dirty, then we must have already
        // informed our own parents that we are dirty, so we can terminate
        // the recursion early.
        return;
    }
    parent.dirtyChildren.add(child);
    // If parent was clean before, it just became (possibly) dirty (according to
    // mightBeDirty), since we just added child to parent.dirtyChildren.
    if (parentWasClean) {
        reportDirty(parent);
    }
}
// Let a parent Entry know that one of its children is no longer dirty.
function reportCleanChild(parent, child) {
    // Must have called rememberChild(child) before calling
    // reportCleanChild(parent, child).
    assert(parent.childValues.has(child));
    assert(!mightBeDirty(child));
    var childValue = parent.childValues.get(child);
    if (childValue.length === 0) {
        parent.childValues.set(child, valueCopy(child.value));
    }
    else if (!valueIs(childValue, child.value)) {
        parent.setDirty();
    }
    removeDirtyChild(parent, child);
    if (mightBeDirty(parent)) {
        return;
    }
    reportClean(parent);
}
function removeDirtyChild(parent, child) {
    var dc = parent.dirtyChildren;
    if (dc) {
        dc.delete(child);
        if (dc.size === 0) {
            if (emptySetPool.length < POOL_TARGET_SIZE) {
                emptySetPool.push(dc);
            }
            parent.dirtyChildren = null;
        }
    }
}
// Removes all children from this entry and returns an array of the
// removed children.
function forgetChildren(parent) {
    if (parent.childValues.size > 0) {
        parent.childValues.forEach(function (_value, child) {
            forgetChild(parent, child);
        });
    }
    // Remove this parent Entry from any sets to which it was added by the
    // addToSet method.
    parent.forgetDeps();
    // After we forget all our children, this.dirtyChildren must be empty
    // and therefore must have been reset to null.
    assert(parent.dirtyChildren === null);
}
function forgetChild(parent, child) {
    child.parents.delete(parent);
    parent.childValues.delete(child);
    removeDirtyChild(parent, child);
}
function maybeSubscribe(entry, args) {
    if (typeof entry.subscribe === "function") {
        try {
            maybeUnsubscribe(entry); // Prevent double subscriptions.
            entry.unsubscribe = entry.subscribe.apply(null, args);
        }
        catch (e) {
            // If this Entry has a subscribe function and it threw an exception
            // (or an unsubscribe function it previously returned now throws),
            // return false to indicate that we were not able to subscribe (or
            // unsubscribe), and this Entry should remain dirty.
            entry.setDirty();
            return false;
        }
    }
    // Returning true indicates either that there was no entry.subscribe
    // function or that it succeeded.
    return true;
}

var EntryMethods = {
    setDirty: true,
    dispose: true,
    forget: true, // Fully remove parent Entry from LRU cache and computation graph
};
function dep(options) {
    var depsByKey = new Map();
    var subscribe = options && options.subscribe;
    function depend(key) {
        var parent = parentEntrySlot.getValue();
        if (parent) {
            var dep_1 = depsByKey.get(key);
            if (!dep_1) {
                depsByKey.set(key, dep_1 = new Set);
            }
            parent.dependOn(dep_1);
            if (typeof subscribe === "function") {
                maybeUnsubscribe(dep_1);
                dep_1.unsubscribe = subscribe(key);
            }
        }
    }
    depend.dirty = function dirty(key, entryMethodName) {
        var dep = depsByKey.get(key);
        if (dep) {
            var m_1 = (entryMethodName &&
                hasOwnProperty.call(EntryMethods, entryMethodName)) ? entryMethodName : "setDirty";
            // We have to use arrayFromSet(dep).forEach instead of dep.forEach,
            // because modifying a Set while iterating over it can cause elements in
            // the Set to be removed from the Set before they've been iterated over.
            arrayFromSet(dep).forEach(function (entry) { return entry[m_1](); });
            depsByKey.delete(key);
            maybeUnsubscribe(dep);
        }
    };
    return depend;
}

// The defaultMakeCacheKey function is remarkably powerful, because it gives
// a unique object for any shallow-identical list of arguments. If you need
// to implement a custom makeCacheKey function, you may find it helpful to
// delegate the final work to defaultMakeCacheKey, which is why we export it
// here. However, you may want to avoid defaultMakeCacheKey if your runtime
// does not support WeakMap, or you have the ability to return a string key.
// In those cases, just write your own custom makeCacheKey functions.
var defaultKeyTrie;
function defaultMakeCacheKey() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var trie$1 = defaultKeyTrie || (defaultKeyTrie = new trie.Trie(typeof WeakMap === "function"));
    return trie$1.lookupArray(args);
}
var caches = new Set();
function wrap(originalFunction, _a) {
    var _b = _a === void 0 ? Object.create(null) : _a, _c = _b.max, max = _c === void 0 ? Math.pow(2, 16) : _c, keyArgs = _b.keyArgs, _d = _b.makeCacheKey, makeCacheKey = _d === void 0 ? defaultMakeCacheKey : _d, normalizeResult = _b.normalizeResult, subscribe = _b.subscribe, _e = _b.cache, cacheOption = _e === void 0 ? caches$1.StrongCache : _e;
    var cache = typeof cacheOption === "function"
        ? new cacheOption(max, function (entry) { return entry.dispose(); })
        : cacheOption;
    var optimistic = function () {
        var key = makeCacheKey.apply(null, keyArgs ? keyArgs.apply(null, arguments) : arguments);
        if (key === void 0) {
            return originalFunction.apply(null, arguments);
        }
        var entry = cache.get(key);
        if (!entry) {
            cache.set(key, entry = new Entry(originalFunction));
            entry.normalizeResult = normalizeResult;
            entry.subscribe = subscribe;
            // Give the Entry the ability to trigger cache.delete(key), even though
            // the Entry itself does not know about key or cache.
            entry.forget = function () { return cache.delete(key); };
        }
        var value = entry.recompute(Array.prototype.slice.call(arguments));
        // Move this entry to the front of the least-recently used queue,
        // since we just finished computing its value.
        cache.set(key, entry);
        caches.add(cache);
        // Clean up any excess entries in the cache, but only if there is no
        // active parent entry, meaning we're not in the middle of a larger
        // computation that might be flummoxed by the cleaning.
        if (!parentEntrySlot.hasValue()) {
            caches.forEach(function (cache) { return cache.clean(); });
            caches.clear();
        }
        return value;
    };
    Object.defineProperty(optimistic, "size", {
        get: function () { return cache.size; },
        configurable: false,
        enumerable: false,
    });
    Object.freeze(optimistic.options = {
        max: max,
        keyArgs: keyArgs,
        makeCacheKey: makeCacheKey,
        normalizeResult: normalizeResult,
        subscribe: subscribe,
        cache: cache,
    });
    function dirtyKey(key) {
        var entry = key && cache.get(key);
        if (entry) {
            entry.setDirty();
        }
    }
    optimistic.dirtyKey = dirtyKey;
    optimistic.dirty = function dirty() {
        dirtyKey(makeCacheKey.apply(null, arguments));
    };
    function peekKey(key) {
        var entry = key && cache.get(key);
        if (entry) {
            return entry.peek();
        }
    }
    optimistic.peekKey = peekKey;
    optimistic.peek = function peek() {
        return peekKey(makeCacheKey.apply(null, arguments));
    };
    function forgetKey(key) {
        return key ? cache.delete(key) : false;
    }
    optimistic.forgetKey = forgetKey;
    optimistic.forget = function forget() {
        return forgetKey(makeCacheKey.apply(null, arguments));
    };
    optimistic.makeCacheKey = makeCacheKey;
    optimistic.getKey = keyArgs ? function getKey() {
        return makeCacheKey.apply(null, keyArgs.apply(null, arguments));
    } : makeCacheKey;
    return Object.freeze(optimistic);
}

Object.defineProperty(exports, 'KeyTrie', {
    enumerable: true,
    get: function () { return trie.Trie; }
});
Object.defineProperty(exports, 'Slot', {
    enumerable: true,
    get: function () { return context.Slot; }
});
Object.defineProperty(exports, 'asyncFromGen', {
    enumerable: true,
    get: function () { return context.asyncFromGen; }
});
Object.defineProperty(exports, 'bindContext', {
    enumerable: true,
    get: function () { return context.bind; }
});
Object.defineProperty(exports, 'noContext', {
    enumerable: true,
    get: function () { return context.noContext; }
});
Object.defineProperty(exports, 'setTimeout', {
    enumerable: true,
    get: function () { return context.setTimeout; }
});
exports.defaultMakeCacheKey = defaultMakeCacheKey;
exports.dep = dep;
exports.nonReactive = nonReactive;
exports.wrap = wrap;
//# sourceMappingURL=bundle.cjs.map
