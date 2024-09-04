import { __assign, __rest as __rest_1, __spreadArray } from "tslib";
import { __rest } from "tslib";
import { mergeDeep } from "../common/mergeDeep.js";
// A very basic pagination field policy that always concatenates new
// results onto the existing array, without examining options.args.
export function concatPagination(keyArgs) {
    if (keyArgs === void 0) { keyArgs = false; }
    return {
        keyArgs: keyArgs,
        merge: function (existing, incoming) {
            return existing ? __spreadArray(__spreadArray([], existing, true), incoming, true) : incoming;
        },
    };
}
// A basic field policy that uses options.args.{offset,limit} to splice
// the incoming data into the existing array. If your arguments are called
// something different (like args.{start,count}), feel free to copy/paste
// this implementation and make the appropriate changes.
export function offsetLimitPagination(keyArgs) {
    if (keyArgs === void 0) { keyArgs = false; }
    return {
        keyArgs: keyArgs,
        merge: function (existing, incoming, _a) {
            var args = _a.args;
            var merged = existing ? existing.slice(0) : [];
            if (incoming) {
                if (args) {
                    // Assume an offset of 0 if args.offset omitted.
                    var _b = args.offset, offset = _b === void 0 ? 0 : _b;
                    for (var i = 0; i < incoming.length; ++i) {
                        merged[offset + i] = incoming[i];
                    }
                }
                else {
                    // It's unusual (probably a mistake) for a paginated field not
                    // to receive any arguments, so you might prefer to throw an
                    // exception here, instead of recovering by appending incoming
                    // onto the existing array.
                    merged.push.apply(merged, incoming);
                }
            }
            return merged;
        },
    };
}
// As proof of the flexibility of field policies, this function generates
// one that handles Relay-style pagination, without Apollo Client knowing
// anything about connections, edges, cursors, or pageInfo objects.
export function relayStylePagination(keyArgs) {
    if (keyArgs === void 0) { keyArgs = false; }
    return {
        keyArgs: keyArgs,
        read: function (existing, _a) {
            var canRead = _a.canRead, readField = _a.readField;
            if (!existing)
                return existing;
            var edges = [];
            var firstEdgeCursor = "";
            var lastEdgeCursor = "";
            existing.edges.forEach(function (edge) {
                // Edges themselves could be Reference objects, so it's important
                // to use readField to access the edge.edge.node property.
                if (canRead(readField("node", edge))) {
                    edges.push(edge);
                    if (edge.cursor) {
                        firstEdgeCursor = firstEdgeCursor || edge.cursor || "";
                        lastEdgeCursor = edge.cursor || lastEdgeCursor;
                    }
                }
            });
            if (edges.length > 1 && firstEdgeCursor === lastEdgeCursor) {
                firstEdgeCursor = "";
            }
            var _b = existing.pageInfo || {}, startCursor = _b.startCursor, endCursor = _b.endCursor;
            return __assign(__assign({}, getExtras(existing)), { edges: edges, pageInfo: __assign(__assign({}, existing.pageInfo), { 
                    // If existing.pageInfo.{start,end}Cursor are undefined or "", default
                    // to firstEdgeCursor and/or lastEdgeCursor.
                    startCursor: startCursor || firstEdgeCursor, endCursor: endCursor || lastEdgeCursor }) });
        },
        merge: function (existing, incoming, _a) {
            var args = _a.args, isReference = _a.isReference, readField = _a.readField;
            if (!existing) {
                existing = makeEmptyData();
            }
            if (!incoming) {
                return existing;
            }
            var incomingEdges = incoming.edges ?
                incoming.edges.map(function (edge) {
                    if (isReference((edge = __assign({}, edge)))) {
                        // In case edge is a Reference, we read out its cursor field and
                        // store it as an extra property of the Reference object.
                        edge.cursor = readField("cursor", edge);
                    }
                    return edge;
                })
                : [];
            if (incoming.pageInfo) {
                var pageInfo_1 = incoming.pageInfo;
                var startCursor = pageInfo_1.startCursor, endCursor = pageInfo_1.endCursor;
                var firstEdge = incomingEdges[0];
                var lastEdge = incomingEdges[incomingEdges.length - 1];
                // In case we did not request the cursor field for edges in this
                // query, we can still infer cursors from pageInfo.
                if (firstEdge && startCursor) {
                    firstEdge.cursor = startCursor;
                }
                if (lastEdge && endCursor) {
                    lastEdge.cursor = endCursor;
                }
                // Cursors can also come from edges, so we default
                // pageInfo.{start,end}Cursor to {first,last}Edge.cursor.
                var firstCursor = firstEdge && firstEdge.cursor;
                if (firstCursor && !startCursor) {
                    incoming = mergeDeep(incoming, {
                        pageInfo: {
                            startCursor: firstCursor,
                        },
                    });
                }
                var lastCursor = lastEdge && lastEdge.cursor;
                if (lastCursor && !endCursor) {
                    incoming = mergeDeep(incoming, {
                        pageInfo: {
                            endCursor: lastCursor,
                        },
                    });
                }
            }
            var prefix = existing.edges;
            var suffix = [];
            if (args && args.after) {
                // This comparison does not need to use readField("cursor", edge),
                // because we stored the cursor field of any Reference edges as an
                // extra property of the Reference object.
                var index = prefix.findIndex(function (edge) { return edge.cursor === args.after; });
                if (index >= 0) {
                    prefix = prefix.slice(0, index + 1);
                    // suffix = []; // already true
                }
            }
            else if (args && args.before) {
                var index = prefix.findIndex(function (edge) { return edge.cursor === args.before; });
                suffix = index < 0 ? prefix : prefix.slice(index);
                prefix = [];
            }
            else if (incoming.edges) {
                // If we have neither args.after nor args.before, the incoming
                // edges cannot be spliced into the existing edges, so they must
                // replace the existing edges. See #6592 for a motivating example.
                prefix = [];
            }
            var edges = __spreadArray(__spreadArray(__spreadArray([], prefix, true), incomingEdges, true), suffix, true);
            var pageInfo = __assign(__assign({}, incoming.pageInfo), existing.pageInfo);
            if (incoming.pageInfo) {
                var _b = incoming.pageInfo, hasPreviousPage = _b.hasPreviousPage, hasNextPage = _b.hasNextPage, startCursor = _b.startCursor, endCursor = _b.endCursor, extras = __rest_1(_b, ["hasPreviousPage", "hasNextPage", "startCursor", "endCursor"]);
                // If incoming.pageInfo had any extra non-standard properties,
                // assume they should take precedence over any existing properties
                // of the same name, regardless of where this page falls with
                // respect to the existing data.
                Object.assign(pageInfo, extras);
                // Keep existing.pageInfo.has{Previous,Next}Page unless the
                // placement of the incoming edges means incoming.hasPreviousPage
                // or incoming.hasNextPage should become the new values for those
                // properties in existing.pageInfo. Note that these updates are
                // only permitted when the beginning or end of the incoming page
                // coincides with the beginning or end of the existing data, as
                // determined using prefix.length and suffix.length.
                if (!prefix.length) {
                    if (void 0 !== hasPreviousPage)
                        pageInfo.hasPreviousPage = hasPreviousPage;
                    if (void 0 !== startCursor)
                        pageInfo.startCursor = startCursor;
                }
                if (!suffix.length) {
                    if (void 0 !== hasNextPage)
                        pageInfo.hasNextPage = hasNextPage;
                    if (void 0 !== endCursor)
                        pageInfo.endCursor = endCursor;
                }
            }
            return __assign(__assign(__assign({}, getExtras(existing)), getExtras(incoming)), { edges: edges, pageInfo: pageInfo });
        },
    };
}
// Returns any unrecognized properties of the given object.
var getExtras = function (obj) { return __rest(obj, notExtras); };
var notExtras = ["edges", "pageInfo"];
function makeEmptyData() {
    return {
        edges: [],
        pageInfo: {
            hasPreviousPage: false,
            hasNextPage: true,
            startCursor: "",
            endCursor: "",
        },
    };
}
//# sourceMappingURL=pagination.js.map