"use strict";
// adapted from https://github.com/gatsbyjs/gatsby/blob/master/packages/gatsby-source-graphql/src/batching/merge-queries.js
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseKey = exports.createPrefix = void 0;
function createPrefix(index) {
    return `_${index}_`;
}
exports.createPrefix = createPrefix;
function parseKey(prefixedKey) {
    const match = /^_([\d]+)_(.*)$/.exec(prefixedKey);
    if (match && match.length === 3 && !isNaN(Number(match[1])) && match[2]) {
        return { index: Number(match[1]), originalKey: match[2] };
    }
    throw new Error(`Key ${prefixedKey} is not correctly prefixed`);
}
exports.parseKey = parseKey;
