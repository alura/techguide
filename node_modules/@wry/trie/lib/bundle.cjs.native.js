'use strict';

// A [trie](https://en.wikipedia.org/wiki/Trie) data structure that holds
// object keys weakly, yet can also hold non-object keys, unlike the
// native `WeakMap`.
// If no makeData function is supplied, the looked-up data will be an empty,
// null-prototype Object.
var defaultMakeData = function () { return Object.create(null); };
// Useful for processing arguments objects as well as arrays.
var _a = Array.prototype, forEach = _a.forEach, slice = _a.slice;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var Trie = /** @class */ (function () {
    function Trie(weakness, makeData) {
        if (weakness === void 0) { weakness = true; }
        if (makeData === void 0) { makeData = defaultMakeData; }
        this.weakness = weakness;
        this.makeData = makeData;
    }
    Trie.prototype.lookup = function () {
        return this.lookupArray(arguments);
    };
    Trie.prototype.lookupArray = function (array) {
        var node = this;
        forEach.call(array, function (key) { return node = node.getChildTrie(key); });
        return hasOwnProperty.call(node, "data")
            ? node.data
            : node.data = this.makeData(slice.call(array));
    };
    Trie.prototype.peek = function () {
        return this.peekArray(arguments);
    };
    Trie.prototype.peekArray = function (array) {
        var node = this;
        for (var i = 0, len = array.length; node && i < len; ++i) {
            var map = node.mapFor(array[i], false);
            node = map && map.get(array[i]);
        }
        return node && node.data;
    };
    Trie.prototype.remove = function () {
        return this.removeArray(arguments);
    };
    Trie.prototype.removeArray = function (array) {
        var data;
        if (array.length) {
            var head = array[0];
            var map = this.mapFor(head, false);
            var child = map && map.get(head);
            if (child) {
                data = child.removeArray(slice.call(array, 1));
                if (!child.data && !child.weak && !(child.strong && child.strong.size)) {
                    map.delete(head);
                }
            }
        }
        else {
            data = this.data;
            delete this.data;
        }
        return data;
    };
    Trie.prototype.getChildTrie = function (key) {
        var map = this.mapFor(key, true);
        var child = map.get(key);
        if (!child)
            map.set(key, child = new Trie(this.weakness, this.makeData));
        return child;
    };
    Trie.prototype.mapFor = function (key, create) {
        return this.weakness && isObjRef(key)
            ? this.weak || (create ? this.weak = new WeakMap : void 0)
            : this.strong || (create ? this.strong = new Map : void 0);
    };
    return Trie;
}());
function isObjRef(value) {
    switch (typeof value) {
        case "object":
            if (value === null)
                break;
        // Fall through to return true...
        case "function":
            return true;
    }
    return false;
}

exports.Trie = Trie;
//# sourceMappingURL=bundle.cjs.map
