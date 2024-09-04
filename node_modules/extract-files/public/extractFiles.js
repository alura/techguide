'use strict';

const defaultIsExtractableFile = require('./isExtractableFile.js');

/**
 * Clones a value, recursively extracting
 * [`File`](https://developer.mozilla.org/en-US/docs/Web/API/File),
 * [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob) and
 * [`ReactNativeFile`]{@link ReactNativeFile} instances with their
 * [object paths]{@link ObjectPath}, replacing them with `null`.
 * [`FileList`](https://developer.mozilla.org/en-US/docs/Web/API/Filelist) instances
 * are treated as [`File`](https://developer.mozilla.org/en-US/docs/Web/API/File)
 * instance arrays.
 * @kind function
 * @name extractFiles
 * @param {*} value Value (typically an object tree) to extract files from.
 * @param {ObjectPath} [path=''] Prefix for object paths for extracted files.
 * @param {ExtractableFileMatcher} [isExtractableFile=isExtractableFile] The function used to identify extractable files.
 * @returns {ExtractFilesResult} Result.
 * @example <caption>Ways to `import`.</caption>
 * ```js
 * import { extractFiles } from 'extract-files';
 * ```
 *
 * ```js
 * import extractFiles from 'extract-files/public/extractFiles.js';
 * ```
 * @example <caption>Ways to `require`.</caption>
 * ```js
 * const { extractFiles } = require('extract-files');
 * ```
 *
 * ```js
 * const extractFiles = require('extract-files/public/extractFiles.js');
 * ```
 * @example <caption>Extract files from an object.</caption>
 * For the following:
 *
 * ```js
 * const file1 = new File(['1'], '1.txt', { type: 'text/plain' });
 * const file2 = new File(['2'], '2.txt', { type: 'text/plain' });
 * const value = {
 *   a: file1,
 *   b: [file1, file2],
 * };
 *
 * const { clone, files } = extractFiles(value, 'prefix');
 * ```
 *
 * `value` remains the same.
 *
 * `clone` is:
 *
 * ```json
 * {
 *   "a": null,
 *   "b": [null, null]
 * }
 * ```
 *
 * `files` is a [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) instance containing:
 *
 * | Key     | Value                        |
 * | :------ | :--------------------------- |
 * | `file1` | `['prefix.a', 'prefix.b.0']` |
 * | `file2` | `['prefix.b.1']`             |
 */
module.exports = function extractFiles(
  value,
  path = '',
  isExtractableFile = defaultIsExtractableFile
) {
  // Map of extracted files and their object paths within the input value.
  const files = new Map();

  // Map of arrays and objects recursed within the input value and their clones,
  // for reusing clones of values that are referenced multiple times within the
  // input value.
  const clones = new Map();

  /**
   * Recursively clones the value, extracting files.
   * @kind function
   * @name extractFiles~recurse
   * @param {*} value Value to extract files from.
   * @param {ObjectPath} path Prefix for object paths for extracted files.
   * @param {Set} recursed Recursed arrays and objects for avoiding infinite recursion of circular references within the input value.
   * @returns {*} Clone of the value with files replaced with `null`.
   * @ignore
   */
  function recurse(value, path, recursed) {
    let clone = value;

    if (isExtractableFile(value)) {
      clone = null;

      const filePaths = files.get(value);

      filePaths ? filePaths.push(path) : files.set(value, [path]);
    } else {
      const isList =
        Array.isArray(value) ||
        (typeof FileList !== 'undefined' && value instanceof FileList);
      const isObject = value && value.constructor === Object;

      if (isList || isObject) {
        const hasClone = clones.has(value);

        if (hasClone) clone = clones.get(value);
        else {
          clone = isList ? [] : {};

          clones.set(value, clone);
        }

        if (!recursed.has(value)) {
          const pathPrefix = path ? `${path}.` : '';
          const recursedDeeper = new Set(recursed).add(value);

          if (isList) {
            let index = 0;

            for (const item of value) {
              const itemClone = recurse(
                item,
                pathPrefix + index++,
                recursedDeeper
              );

              if (!hasClone) clone.push(itemClone);
            }
          } else
            for (const key in value) {
              const propertyClone = recurse(
                value[key],
                pathPrefix + key,
                recursedDeeper
              );

              if (!hasClone) clone[key] = propertyClone;
            }
        }
      }
    }

    return clone;
  }

  return {
    clone: recurse(value, path, new Set()),
    files,
  };
};
