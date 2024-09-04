'use strict';

function defaultDispose$1() { }
var StrongCache = /** @class */ (function () {
    function StrongCache(max, dispose) {
        if (max === void 0) { max = Infinity; }
        if (dispose === void 0) { dispose = defaultDispose$1; }
        this.max = max;
        this.dispose = dispose;
        this.map = new Map();
        this.newest = null;
        this.oldest = null;
    }
    StrongCache.prototype.has = function (key) {
        return this.map.has(key);
    };
    StrongCache.prototype.get = function (key) {
        var node = this.getNode(key);
        return node && node.value;
    };
    Object.defineProperty(StrongCache.prototype, "size", {
        get: function () {
            return this.map.size;
        },
        enumerable: false,
        configurable: true
    });
    StrongCache.prototype.getNode = function (key) {
        var node = this.map.get(key);
        if (node && node !== this.newest) {
            var older = node.older, newer = node.newer;
            if (newer) {
                newer.older = older;
            }
            if (older) {
                older.newer = newer;
            }
            node.older = this.newest;
            node.older.newer = node;
            node.newer = null;
            this.newest = node;
            if (node === this.oldest) {
                this.oldest = newer;
            }
        }
        return node;
    };
    StrongCache.prototype.set = function (key, value) {
        var node = this.getNode(key);
        if (node) {
            return node.value = value;
        }
        node = {
            key: key,
            value: value,
            newer: null,
            older: this.newest
        };
        if (this.newest) {
            this.newest.newer = node;
        }
        this.newest = node;
        this.oldest = this.oldest || node;
        this.map.set(key, node);
        return node.value;
    };
    StrongCache.prototype.clean = function () {
        while (this.oldest && this.map.size > this.max) {
            this.delete(this.oldest.key);
        }
    };
    StrongCache.prototype.delete = function (key) {
        var node = this.map.get(key);
        if (node) {
            if (node === this.newest) {
                this.newest = node.older;
            }
            if (node === this.oldest) {
                this.oldest = node.newer;
            }
            if (node.newer) {
                node.newer.older = node.older;
            }
            if (node.older) {
                node.older.newer = node.newer;
            }
            this.map.delete(key);
            this.dispose(node.value, key);
            return true;
        }
        return false;
    };
    return StrongCache;
}());

function noop() { }
var defaultDispose = noop;
var _WeakRef = typeof WeakRef !== "undefined"
    ? WeakRef
    : function (value) {
        return { deref: function () { return value; } };
    };
var _WeakMap = typeof WeakMap !== "undefined" ? WeakMap : Map;
var _FinalizationRegistry = typeof FinalizationRegistry !== "undefined"
    ? FinalizationRegistry
    : function () {
        return {
            register: noop,
            unregister: noop,
        };
    };
var finalizationBatchSize = 10024;
var WeakCache = /** @class */ (function () {
    function WeakCache(max, dispose) {
        if (max === void 0) { max = Infinity; }
        if (dispose === void 0) { dispose = defaultDispose; }
        var _this = this;
        this.max = max;
        this.dispose = dispose;
        this.map = new _WeakMap();
        this.newest = null;
        this.oldest = null;
        this.unfinalizedNodes = new Set();
        this.finalizationScheduled = false;
        this.size = 0;
        this.finalize = function () {
            var iterator = _this.unfinalizedNodes.values();
            for (var i = 0; i < finalizationBatchSize; i++) {
                var node = iterator.next().value;
                if (!node)
                    break;
                _this.unfinalizedNodes.delete(node);
                var key = node.key;
                delete node.key;
                node.keyRef = new _WeakRef(key);
                _this.registry.register(key, node, node);
            }
            if (_this.unfinalizedNodes.size > 0) {
                queueMicrotask(_this.finalize);
            }
            else {
                _this.finalizationScheduled = false;
            }
        };
        this.registry = new _FinalizationRegistry(this.deleteNode.bind(this));
    }
    WeakCache.prototype.has = function (key) {
        return this.map.has(key);
    };
    WeakCache.prototype.get = function (key) {
        var node = this.getNode(key);
        return node && node.value;
    };
    WeakCache.prototype.getNode = function (key) {
        var node = this.map.get(key);
        if (node && node !== this.newest) {
            var older = node.older, newer = node.newer;
            if (newer) {
                newer.older = older;
            }
            if (older) {
                older.newer = newer;
            }
            node.older = this.newest;
            node.older.newer = node;
            node.newer = null;
            this.newest = node;
            if (node === this.oldest) {
                this.oldest = newer;
            }
        }
        return node;
    };
    WeakCache.prototype.set = function (key, value) {
        var node = this.getNode(key);
        if (node) {
            return (node.value = value);
        }
        node = {
            key: key,
            value: value,
            newer: null,
            older: this.newest,
        };
        if (this.newest) {
            this.newest.newer = node;
        }
        this.newest = node;
        this.oldest = this.oldest || node;
        this.scheduleFinalization(node);
        this.map.set(key, node);
        this.size++;
        return node.value;
    };
    WeakCache.prototype.clean = function () {
        while (this.oldest && this.size > this.max) {
            this.deleteNode(this.oldest);
        }
    };
    WeakCache.prototype.deleteNode = function (node) {
        if (node === this.newest) {
            this.newest = node.older;
        }
        if (node === this.oldest) {
            this.oldest = node.newer;
        }
        if (node.newer) {
            node.newer.older = node.older;
        }
        if (node.older) {
            node.older.newer = node.newer;
        }
        this.size--;
        var key = node.key || (node.keyRef && node.keyRef.deref());
        this.dispose(node.value, key);
        if (!node.keyRef) {
            this.unfinalizedNodes.delete(node);
        }
        else {
            this.registry.unregister(node);
        }
        if (key)
            this.map.delete(key);
    };
    WeakCache.prototype.delete = function (key) {
        var node = this.map.get(key);
        if (node) {
            this.deleteNode(node);
            return true;
        }
        return false;
    };
    WeakCache.prototype.scheduleFinalization = function (node) {
        this.unfinalizedNodes.add(node);
        if (!this.finalizationScheduled) {
            this.finalizationScheduled = true;
            queueMicrotask(this.finalize);
        }
    };
    return WeakCache;
}());

exports.StrongCache = StrongCache;
exports.WeakCache = WeakCache;
//# sourceMappingURL=bundle.cjs.map
