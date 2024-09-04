'use strict';

const ReactNativeFile = require('./ReactNativeFile.js');

/**
 * Checks if a value is an [extractable file]{@link ExtractableFile}.
 * @kind function
 * @name isExtractableFile
 * @type {ExtractableFileMatcher}
 * @param {*} value Value to check.
 * @returns {boolean} Is the value an [extractable file]{@link ExtractableFile}.
 * @example <caption>Ways to `import`.</caption>
 * ```js
 * import { isExtractableFile } from 'extract-files';
 * ```
 *
 * ```js
 * import isExtractableFile from 'extract-files/public/isExtractableFile.js';
 * ```
 * @example <caption>Ways to `require`.</caption>
 * ```js
 * const { isExtractableFile } = require('extract-files');
 * ```
 *
 * ```js
 * const isExtractableFile = require('extract-files/public/isExtractableFile.js');
 * ```
 */
module.exports = function isExtractableFile(value) {
  return (
    (typeof File !== 'undefined' && value instanceof File) ||
    (typeof Blob !== 'undefined' && value instanceof Blob) ||
    value instanceof ReactNativeFile
  );
};
