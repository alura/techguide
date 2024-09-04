"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.relayStylePaginationMock = void 0;
const utils_js_1 = require("./utils.js");
/**
 * Produces a resolver that'll mock a [Relay-style cursor pagination](https://relay.dev/graphql/connections.htm).
 *
 * ```ts
 * const schemaWithMocks = addMocksToSchema({
 *   schema,
 *   resolvers: (store) => ({
 *     User: {
 *       friends: relayStylePaginationMock(store),
 *     }
 *   }),
 * })
 * ```
 * @param store the MockStore
 */
const relayStylePaginationMock = (store, { cursorFn = node => `${node.$ref.key}`, applyOnNodes, allNodesFn, } = {}) => {
    return (parent, args, context, info) => {
        const source = (0, utils_js_1.isRootType)(info.parentType, info.schema) ? (0, utils_js_1.makeRef)(info.parentType.name, 'ROOT') : parent;
        const allNodesFn_ = allNodesFn !== null && allNodesFn !== void 0 ? allNodesFn : defaultAllNodesFn(store);
        let allNodes = allNodesFn_(source, args, context, info);
        if (applyOnNodes) {
            allNodes = applyOnNodes(allNodes, args);
        }
        const allEdges = allNodes.map(node => ({
            node,
            cursor: cursorFn(node),
        }));
        let start, end;
        const { first, after, last, before } = args;
        if (typeof first === 'number') {
            // forward pagination
            if (last || before) {
                throw new Error("if `first` is provided, `last` or `before` can't be provided");
            }
            const afterIndex = after ? allEdges.findIndex(e => e.cursor === after) : -1;
            start = afterIndex + 1;
            end = afterIndex + 1 + first;
        }
        else if (typeof last === 'number') {
            // backward pagination
            if (first || after) {
                throw new Error("if `last` is provided, `first` or `after` can't be provided");
            }
            const foundBeforeIndex = before ? allEdges.findIndex(e => e.cursor === before) : -1;
            const beforeIndex = foundBeforeIndex !== -1 ? foundBeforeIndex : allNodes.length;
            start = allEdges.length - (allEdges.length - beforeIndex) - last;
            // negative index on Array.slice indicate offset from end of sequence => we don't want
            if (start < 0)
                start = 0;
            end = beforeIndex;
        }
        else {
            throw new Error('A `first` or a `last` arguments should be provided');
        }
        const edges = allEdges.slice(start, end);
        const pageInfo = {
            startCursor: edges.length > 0 ? edges[0].cursor : '',
            endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : '',
            hasNextPage: end < allEdges.length - 1,
            hasPreviousPage: start > 0,
        };
        return {
            edges,
            pageInfo,
            totalCount: allEdges.length,
        };
    };
};
exports.relayStylePaginationMock = relayStylePaginationMock;
const defaultAllNodesFn = (store) => (parent, _, __, info) => store.get(parent, [info.fieldName, 'edges']).map(e => store.get(e, 'node'));
