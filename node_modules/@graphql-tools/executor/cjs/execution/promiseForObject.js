"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.promiseForObject = void 0;
/**
 * This function transforms a JS object `Record<string, Promise<T>>` into
 * a `Promise<Record<string, T>>`
 *
 * This is akin to bluebird's `Promise.props`, but implemented only using
 * `Promise.all` so it will work with any implementation of ES6 promises.
 */
async function promiseForObject(object) {
    const resolvedObject = Object.create(null);
    await Promise.all(Object.entries(object).map(async ([key, value]) => {
        resolvedObject[key] = await value;
    }));
    return resolvedObject;
}
exports.promiseForObject = promiseForObject;
