"use strict";
// adapted from https://github.com/gatsbyjs/gatsby/blob/master/packages/gatsby-source-graphql/src/batching/merge-queries.js
Object.defineProperty(exports, "__esModule", { value: true });
exports.splitResult = void 0;
const utils_1 = require("@graphql-tools/utils");
const prefix_js_1 = require("./prefix.js");
/**
 * Split and transform result of the query produced by the `merge` function
 */
function splitResult({ data, errors }, numResults) {
    const splitResults = [];
    for (let i = 0; i < numResults; i++) {
        splitResults.push({});
    }
    if (data) {
        for (const prefixedKey in data) {
            const { index, originalKey } = (0, prefix_js_1.parseKey)(prefixedKey);
            const result = splitResults[index];
            if (result == null) {
                continue;
            }
            if (result.data == null) {
                result.data = { [originalKey]: data[prefixedKey] };
            }
            else {
                result.data[originalKey] = data[prefixedKey];
            }
        }
    }
    if (errors) {
        for (const error of errors) {
            if (error.path) {
                const parsedKey = (0, prefix_js_1.parseKey)(error.path[0]);
                const { index, originalKey } = parsedKey;
                const newError = (0, utils_1.relocatedError)(error, [originalKey, ...error.path.slice(1)]);
                const resultErrors = (splitResults[index].errors = (splitResults[index].errors || []));
                resultErrors.push(newError);
            }
            else {
                splitResults.forEach(result => {
                    const resultErrors = (result.errors = (result.errors || []));
                    resultErrors.push(error);
                });
            }
        }
    }
    return splitResults;
}
exports.splitResult = splitResult;
