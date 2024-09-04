import { __assign, __spreadArray } from "tslib";
import { visit } from "graphql";
import { wrap } from "optimism";
import { cacheSizes, getFragmentDefinitions, } from "../../utilities/index.js";
import { WeakCache } from "@wry/caches";
// As long as createFragmentRegistry is not imported or used, the
// FragmentRegistry example implementation provided below should not be bundled
// (by tree-shaking bundlers like Rollup), because the implementation of
// InMemoryCache refers only to the TypeScript interface FragmentRegistryAPI,
// never the concrete implementation FragmentRegistry (which is deliberately not
// exported from this module).
export function createFragmentRegistry() {
    var fragments = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        fragments[_i] = arguments[_i];
    }
    return new (FragmentRegistry.bind.apply(FragmentRegistry, __spreadArray([void 0], fragments, false)))();
}
var FragmentRegistry = /** @class */ (function () {
    // Call `createFragmentRegistry` instead of invoking the
    // FragmentRegistry constructor directly. This reserves the constructor for
    // future configuration of the FragmentRegistry.
    function FragmentRegistry() {
        var fragments = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            fragments[_i] = arguments[_i];
        }
        this.registry = Object.create(null);
        this.resetCaches();
        if (fragments.length) {
            this.register.apply(this, fragments);
        }
    }
    FragmentRegistry.prototype.register = function () {
        var _this = this;
        var fragments = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            fragments[_i] = arguments[_i];
        }
        var definitions = new Map();
        fragments.forEach(function (doc) {
            getFragmentDefinitions(doc).forEach(function (node) {
                definitions.set(node.name.value, node);
            });
        });
        definitions.forEach(function (node, name) {
            if (node !== _this.registry[name]) {
                _this.registry[name] = node;
                _this.invalidate(name);
            }
        });
        return this;
    };
    // Overridden in the resetCaches method below.
    FragmentRegistry.prototype.invalidate = function (name) { };
    FragmentRegistry.prototype.resetCaches = function () {
        var proto = FragmentRegistry.prototype;
        this.invalidate = (this.lookup = wrap(proto.lookup.bind(this), {
            makeCacheKey: function (arg) { return arg; },
            max: cacheSizes["fragmentRegistry.lookup"] ||
                1000 /* defaultCacheSizes["fragmentRegistry.lookup"] */,
        })).dirty; // This dirty function is bound to the wrapped lookup method.
        this.transform = wrap(proto.transform.bind(this), {
            cache: WeakCache,
            max: cacheSizes["fragmentRegistry.transform"] ||
                2000 /* defaultCacheSizes["fragmentRegistry.transform"] */,
        });
        this.findFragmentSpreads = wrap(proto.findFragmentSpreads.bind(this), {
            cache: WeakCache,
            max: cacheSizes["fragmentRegistry.findFragmentSpreads"] ||
                4000 /* defaultCacheSizes["fragmentRegistry.findFragmentSpreads"] */,
        });
    };
    /*
     * Note:
     * This method is only memoized so it can serve as a dependency to `tranform`,
     * so calling `invalidate` will invalidate cache entries for `transform`.
     */
    FragmentRegistry.prototype.lookup = function (fragmentName) {
        return this.registry[fragmentName] || null;
    };
    FragmentRegistry.prototype.transform = function (document) {
        var _this = this;
        var defined = new Map();
        getFragmentDefinitions(document).forEach(function (def) {
            defined.set(def.name.value, def);
        });
        var unbound = new Set();
        var enqueue = function (spreadName) {
            if (!defined.has(spreadName)) {
                unbound.add(spreadName);
            }
        };
        var enqueueChildSpreads = function (node) {
            return Object.keys(_this.findFragmentSpreads(node)).forEach(enqueue);
        };
        enqueueChildSpreads(document);
        var missing = [];
        var map = Object.create(null);
        // This Set forEach loop can be extended during iteration by adding
        // additional strings to the unbound set.
        unbound.forEach(function (fragmentName) {
            var knownFragmentDef = defined.get(fragmentName);
            if (knownFragmentDef) {
                enqueueChildSpreads((map[fragmentName] = knownFragmentDef));
            }
            else {
                missing.push(fragmentName);
                var def = _this.lookup(fragmentName);
                if (def) {
                    enqueueChildSpreads((map[fragmentName] = def));
                }
            }
        });
        if (missing.length) {
            var defsToAppend_1 = [];
            missing.forEach(function (name) {
                var def = map[name];
                if (def) {
                    defsToAppend_1.push(def);
                }
            });
            if (defsToAppend_1.length) {
                document = __assign(__assign({}, document), { definitions: document.definitions.concat(defsToAppend_1) });
            }
        }
        return document;
    };
    FragmentRegistry.prototype.findFragmentSpreads = function (root) {
        var spreads = Object.create(null);
        visit(root, {
            FragmentSpread: function (node) {
                spreads[node.name.value] = node;
            },
        });
        return spreads;
    };
    return FragmentRegistry;
}());
//# sourceMappingURL=fragmentRegistry.js.map