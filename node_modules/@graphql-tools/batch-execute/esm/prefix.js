// adapted from https://github.com/gatsbyjs/gatsby/blob/master/packages/gatsby-source-graphql/src/batching/merge-queries.js
export function createPrefix(index) {
    return `_${index}_`;
}
export function parseKey(prefixedKey) {
    const match = /^_([\d]+)_(.*)$/.exec(prefixedKey);
    if (match && match.length === 3 && !isNaN(Number(match[1])) && match[2]) {
        return { index: Number(match[1]), originalKey: match[2] };
    }
    throw new Error(`Key ${prefixedKey} is not correctly prefixed`);
}
