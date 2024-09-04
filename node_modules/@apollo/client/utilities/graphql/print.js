import { print as origPrint } from "graphql";
import { AutoCleanedWeakCache, cacheSizes, } from "../caching/index.js";
import { registerGlobalCache } from "../caching/getMemoryInternals.js";
var printCache;
export var print = Object.assign(function (ast) {
    var result = printCache.get(ast);
    if (!result) {
        result = origPrint(ast);
        printCache.set(ast, result);
    }
    return result;
}, {
    reset: function () {
        printCache = new AutoCleanedWeakCache(cacheSizes.print || 2000 /* defaultCacheSizes.print */);
    },
});
print.reset();
if (globalThis.__DEV__ !== false) {
    registerGlobalCache("print", function () { return (printCache ? printCache.size : 0); });
}
//# sourceMappingURL=print.js.map