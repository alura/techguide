import type { DocumentNode } from "graphql";
export type DocumentTransformCacheKey = ReadonlyArray<unknown>;
type TransformFn = (document: DocumentNode) => DocumentNode;
interface DocumentTransformOptions {
    /**
     * Determines whether to cache the transformed GraphQL document. Caching can speed up repeated calls to the document transform for the same input document. Set to `false` to completely disable caching for the document transform. When disabled, this option takes precedence over the [`getCacheKey`](#getcachekey) option.
     *
     * The default value is `true`.
     */
    cache?: boolean;
    /**
     * Defines a custom cache key for a GraphQL document that will determine whether to re-run the document transform when given the same input GraphQL document. Returns an array that defines the cache key. Return `undefined` to disable caching for that GraphQL document.
     *
     * > **Note:** The items in the array may be any type, but also need to be referentially stable to guarantee a stable cache key.
     *
     * The default implementation of this function returns the `document` as the cache key.
     */
    getCacheKey?: (document: DocumentNode) => DocumentTransformCacheKey | undefined;
}
export declare class DocumentTransform {
    private readonly transform;
    private cached;
    private readonly resultCache;
    private getCacheKey;
    static identity(): DocumentTransform;
    static split(predicate: (document: DocumentNode) => boolean, left: DocumentTransform, right?: DocumentTransform): DocumentTransform & {
        left: DocumentTransform;
        right: DocumentTransform;
    };
    constructor(transform: TransformFn, options?: DocumentTransformOptions);
    /**
     * Resets the internal cache of this transform, if it has one.
     */
    resetCache(): void;
    private performWork;
    transformDocument(document: DocumentNode): DocumentNode;
    concat(otherTransform: DocumentTransform): DocumentTransform;
    /**
     * @internal
     * Used to iterate through all transforms that are concatenations or `split` links.
     */
    readonly left?: DocumentTransform;
    /**
     * @internal
     * Used to iterate through all transforms that are concatenations or `split` links.
     */
    readonly right?: DocumentTransform;
}
export {};
//# sourceMappingURL=DocumentTransform.d.ts.map