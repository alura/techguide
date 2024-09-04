"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flattenAsyncIterable = void 0;
/**
 * Given an AsyncIterable of AsyncIterables, flatten all yielded results into a
 * single AsyncIterable.
 */
function flattenAsyncIterable(iterable) {
    // You might think this whole function could be replaced with
    //
    //    async function* flattenAsyncIterable(iterable) {
    //      for await (const subIterator of iterable) {
    //        yield* subIterator;
    //      }
    //    }
    //
    // but calling `.return()` on the iterator it returns won't interrupt the `for await`.
    const topIterator = iterable[Symbol.asyncIterator]();
    let currentNestedIterator;
    let waitForCurrentNestedIterator;
    let done = false;
    async function next() {
        if (done) {
            return { value: undefined, done: true };
        }
        try {
            if (!currentNestedIterator) {
                // Somebody else is getting it already.
                if (waitForCurrentNestedIterator) {
                    await waitForCurrentNestedIterator;
                    return await next();
                }
                // Nobody else is getting it. We should!
                let resolve;
                waitForCurrentNestedIterator = new Promise(r => {
                    resolve = r;
                });
                const topIteratorResult = await topIterator.next();
                if (topIteratorResult.done) {
                    // Given that done only ever transitions from false to true,
                    // require-atomic-updates is being unnecessarily cautious.
                    done = true;
                    return await next();
                }
                // eslint is making a reasonable point here, but we've explicitly protected
                // ourself from the race condition by ensuring that only the single call
                // that assigns to waitForCurrentNestedIterator is allowed to assign to
                // currentNestedIterator or waitForCurrentNestedIterator.
                currentNestedIterator = topIteratorResult.value[Symbol.asyncIterator]();
                waitForCurrentNestedIterator = undefined;
                resolve();
                return await next();
            }
            const rememberCurrentNestedIterator = currentNestedIterator;
            const nestedIteratorResult = await currentNestedIterator.next();
            if (!nestedIteratorResult.done) {
                return nestedIteratorResult;
            }
            // The nested iterator is done. If it's still the current one, make it not
            // current. (If it's not the current one, somebody else has made us move on.)
            if (currentNestedIterator === rememberCurrentNestedIterator) {
                currentNestedIterator = undefined;
            }
            return await next();
        }
        catch (err) {
            done = true;
            throw err;
        }
    }
    return {
        next,
        async return() {
            var _a, _b;
            done = true;
            await Promise.all([(_a = currentNestedIterator === null || currentNestedIterator === void 0 ? void 0 : currentNestedIterator.return) === null || _a === void 0 ? void 0 : _a.call(currentNestedIterator), (_b = topIterator.return) === null || _b === void 0 ? void 0 : _b.call(topIterator)]);
            return { value: undefined, done: true };
        },
        async throw(error) {
            var _a, _b;
            done = true;
            await Promise.all([(_a = currentNestedIterator === null || currentNestedIterator === void 0 ? void 0 : currentNestedIterator.throw) === null || _a === void 0 ? void 0 : _a.call(currentNestedIterator, error), (_b = topIterator.throw) === null || _b === void 0 ? void 0 : _b.call(topIterator, error)]);
            /* c8 ignore next */
            throw error;
        },
        [Symbol.asyncIterator]() {
            return this;
        },
    };
}
exports.flattenAsyncIterable = flattenAsyncIterable;
