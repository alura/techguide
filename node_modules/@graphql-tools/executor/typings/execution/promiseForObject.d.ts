type ResolvedObject<TData> = {
    [TKey in keyof TData]: TData[TKey] extends Promise<infer TValue> ? TValue : TData[TKey];
};
/**
 * This function transforms a JS object `Record<string, Promise<T>>` into
 * a `Promise<Record<string, T>>`
 *
 * This is akin to bluebird's `Promise.props`, but implemented only using
 * `Promise.all` so it will work with any implementation of ES6 promises.
 */
export declare function promiseForObject<TData>(object: TData): Promise<ResolvedObject<TData>>;
export {};
