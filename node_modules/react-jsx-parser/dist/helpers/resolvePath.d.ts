/**
 * Returns the result of a path query from an object
 * @param {any} object the object to search
 * @param {string} path the path, whose value will be retrieved
 * @returns {any} the value (undefined if the path doesn't exist)
 * @example
 * resolvePath({ foo: { bar: { baz: 3 } } }, 'foo.bar.baz') // 3
 */
export declare const resolvePath: (object: any, path: string) => any;
