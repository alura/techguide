import { WeakCache, StrongCache } from "@wry/caches";
/**
 * @internal
 * A version of WeakCache that will auto-schedule a cleanup of the cache when
 * a new item is added and the cache reached maximum size.
 * Throttled to once per 100ms.
 *
 * @privateRemarks
 * Should be used throughout the rest of the codebase instead of WeakCache,
 * with the notable exception of usage in `wrap` from `optimism` - that one
 * already handles cleanup and should remain a `WeakCache`.
 */
export declare const AutoCleanedWeakCache: typeof WeakCache;
/**
 * @internal
 */
export type AutoCleanedWeakCache<K extends object, V> = WeakCache<K, V>;
/**
 * @internal
 * A version of StrongCache that will auto-schedule a cleanup of the cache when
 * a new item is added and the cache reached maximum size.
 * Throttled to once per 100ms.
 *
 * @privateRemarks
 * Should be used throughout the rest of the codebase instead of StrongCache,
 * with the notable exception of usage in `wrap` from `optimism` - that one
 * already handles cleanup and should remain a `StrongCache`.
 */
export declare const AutoCleanedStrongCache: typeof StrongCache;
/**
 * @internal
 */
export type AutoCleanedStrongCache<K, V> = StrongCache<K, V>;
//# sourceMappingURL=caches.d.ts.map