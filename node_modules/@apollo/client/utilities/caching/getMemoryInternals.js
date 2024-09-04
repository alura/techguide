import { __assign, __spreadArray } from "tslib";
import { cacheSizes } from "./sizes.js";
var globalCaches = {};
export function registerGlobalCache(name, getSize) {
    globalCaches[name] = getSize;
}
/**
 * For internal purposes only - please call `ApolloClient.getMemoryInternals` instead
 * @internal
 */
export var getApolloClientMemoryInternals = globalThis.__DEV__ !== false ?
    _getApolloClientMemoryInternals
    : undefined;
/**
 * For internal purposes only - please call `ApolloClient.getMemoryInternals` instead
 * @internal
 */
export var getInMemoryCacheMemoryInternals = globalThis.__DEV__ !== false ?
    _getInMemoryCacheMemoryInternals
    : undefined;
/**
 * For internal purposes only - please call `ApolloClient.getMemoryInternals` instead
 * @internal
 */
export var getApolloCacheMemoryInternals = globalThis.__DEV__ !== false ?
    _getApolloCacheMemoryInternals
    : undefined;
function getCurrentCacheSizes() {
    // `defaultCacheSizes` is a `const enum` that will be inlined during build, so we have to reconstruct it's shape here
    var defaults = {
        parser: 1000 /* defaultCacheSizes["parser"] */,
        canonicalStringify: 1000 /* defaultCacheSizes["canonicalStringify"] */,
        print: 2000 /* defaultCacheSizes["print"] */,
        "documentTransform.cache": 2000 /* defaultCacheSizes["documentTransform.cache"] */,
        "queryManager.getDocumentInfo": 2000 /* defaultCacheSizes["queryManager.getDocumentInfo"] */,
        "PersistedQueryLink.persistedQueryHashes": 2000 /* defaultCacheSizes["PersistedQueryLink.persistedQueryHashes"] */,
        "fragmentRegistry.transform": 2000 /* defaultCacheSizes["fragmentRegistry.transform"] */,
        "fragmentRegistry.lookup": 1000 /* defaultCacheSizes["fragmentRegistry.lookup"] */,
        "fragmentRegistry.findFragmentSpreads": 4000 /* defaultCacheSizes["fragmentRegistry.findFragmentSpreads"] */,
        "cache.fragmentQueryDocuments": 1000 /* defaultCacheSizes["cache.fragmentQueryDocuments"] */,
        "removeTypenameFromVariables.getVariableDefinitions": 2000 /* defaultCacheSizes["removeTypenameFromVariables.getVariableDefinitions"] */,
        "inMemoryCache.maybeBroadcastWatch": 5000 /* defaultCacheSizes["inMemoryCache.maybeBroadcastWatch"] */,
        "inMemoryCache.executeSelectionSet": 50000 /* defaultCacheSizes["inMemoryCache.executeSelectionSet"] */,
        "inMemoryCache.executeSubSelectedArray": 10000 /* defaultCacheSizes["inMemoryCache.executeSubSelectedArray"] */,
    };
    return Object.fromEntries(Object.entries(defaults).map(function (_a) {
        var k = _a[0], v = _a[1];
        return [
            k,
            cacheSizes[k] || v,
        ];
    }));
}
function _getApolloClientMemoryInternals() {
    var _a, _b, _c, _d, _e;
    if (!(globalThis.__DEV__ !== false))
        throw new Error("only supported in development mode");
    return {
        limits: getCurrentCacheSizes(),
        sizes: __assign({ print: (_a = globalCaches.print) === null || _a === void 0 ? void 0 : _a.call(globalCaches), parser: (_b = globalCaches.parser) === null || _b === void 0 ? void 0 : _b.call(globalCaches), canonicalStringify: (_c = globalCaches.canonicalStringify) === null || _c === void 0 ? void 0 : _c.call(globalCaches), links: linkInfo(this.link), queryManager: {
                getDocumentInfo: this["queryManager"]["transformCache"].size,
                documentTransforms: transformInfo(this["queryManager"].documentTransform),
            } }, (_e = (_d = this.cache).getMemoryInternals) === null || _e === void 0 ? void 0 : _e.call(_d)),
    };
}
function _getApolloCacheMemoryInternals() {
    return {
        cache: {
            fragmentQueryDocuments: getWrapperInformation(this["getFragmentDoc"]),
        },
    };
}
function _getInMemoryCacheMemoryInternals() {
    var fragments = this.config.fragments;
    return __assign(__assign({}, _getApolloCacheMemoryInternals.apply(this)), { addTypenameDocumentTransform: transformInfo(this["addTypenameTransform"]), inMemoryCache: {
            executeSelectionSet: getWrapperInformation(this["storeReader"]["executeSelectionSet"]),
            executeSubSelectedArray: getWrapperInformation(this["storeReader"]["executeSubSelectedArray"]),
            maybeBroadcastWatch: getWrapperInformation(this["maybeBroadcastWatch"]),
        }, fragmentRegistry: {
            findFragmentSpreads: getWrapperInformation(fragments === null || fragments === void 0 ? void 0 : fragments.findFragmentSpreads),
            lookup: getWrapperInformation(fragments === null || fragments === void 0 ? void 0 : fragments.lookup),
            transform: getWrapperInformation(fragments === null || fragments === void 0 ? void 0 : fragments.transform),
        } });
}
function isWrapper(f) {
    return !!f && "dirtyKey" in f;
}
function getWrapperInformation(f) {
    return isWrapper(f) ? f.size : undefined;
}
function isDefined(value) {
    return value != null;
}
function transformInfo(transform) {
    return recurseTransformInfo(transform).map(function (cache) { return ({ cache: cache }); });
}
function recurseTransformInfo(transform) {
    return transform ?
        __spreadArray(__spreadArray([
            getWrapperInformation(transform === null || transform === void 0 ? void 0 : transform["performWork"])
        ], recurseTransformInfo(transform === null || transform === void 0 ? void 0 : transform["left"]), true), recurseTransformInfo(transform === null || transform === void 0 ? void 0 : transform["right"]), true).filter(isDefined)
        : [];
}
function linkInfo(link) {
    var _a;
    return link ?
        __spreadArray(__spreadArray([
            (_a = link === null || link === void 0 ? void 0 : link.getMemoryInternals) === null || _a === void 0 ? void 0 : _a.call(link)
        ], linkInfo(link === null || link === void 0 ? void 0 : link.left), true), linkInfo(link === null || link === void 0 ? void 0 : link.right), true).filter(isDefined)
        : [];
}
//# sourceMappingURL=getMemoryInternals.js.map