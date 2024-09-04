/**
 * Like JSON.stringify, but with object keys always sorted in the same order.
 *
 * To achieve performant sorting, this function uses a Map from JSON-serialized
 * arrays of keys (in any order) to sorted arrays of the same keys, with a
 * single sorted array reference shared by all permutations of the keys.
 *
 * As a drawback, this function will add a little bit more memory for every
 * object encountered that has different (more, less, a different order of) keys
 * than in the past.
 *
 * In a typical application, this extra memory usage should not play a
 * significant role, as `canonicalStringify` will be called for only a limited
 * number of object shapes, and the cache will not grow beyond a certain point.
 * But in some edge cases, this could be a problem, so we provide
 * canonicalStringify.reset() as a way of clearing the cache.
 * */
export declare const canonicalStringify: ((value: any) => string) & {
    reset(): void;
};
//# sourceMappingURL=canonicalStringify.d.ts.map