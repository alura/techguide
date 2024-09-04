"use strict";

/**
 * removeTrailingSpaces
 * Remove the trailing spaces from a string.
 *
 * @name removeTrailingSpaces
 * @function
 * @param {String} input The input string.
 * @returns {String} The output string.
 */

module.exports = function removeTrailingSpaces(input) {
  // TODO If possible, use a regex
  return input.split("\n").map(function (x) {
    return x.trimRight();
  }).join("\n");
};