"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.iterateOverTrace = void 0;
function iterateOverTrace(trace, f, includePath) {
    const rootPath = includePath
        ? new RootCollectingPathsResponseNamePath()
        : notCollectingPathsResponseNamePath;
    if (trace.root) {
        if (iterateOverTraceNode(trace.root, rootPath, f))
            return;
    }
    if (trace.queryPlan) {
        if (iterateOverQueryPlan(trace.queryPlan, rootPath, f))
            return;
    }
}
exports.iterateOverTrace = iterateOverTrace;
function iterateOverQueryPlan(node, rootPath, f) {
    var _a, _b, _c, _d, _e;
    if (!node)
        return false;
    if (((_b = (_a = node.fetch) === null || _a === void 0 ? void 0 : _a.trace) === null || _b === void 0 ? void 0 : _b.root) && node.fetch.serviceName) {
        return iterateOverTraceNode(node.fetch.trace.root, rootPath.child(`service:${node.fetch.serviceName}`), f);
    }
    if ((_c = node.flatten) === null || _c === void 0 ? void 0 : _c.node) {
        return iterateOverQueryPlan(node.flatten.node, rootPath, f);
    }
    if ((_d = node.parallel) === null || _d === void 0 ? void 0 : _d.nodes) {
        return node.parallel.nodes.some((node) => iterateOverQueryPlan(node, rootPath, f));
    }
    if ((_e = node.sequence) === null || _e === void 0 ? void 0 : _e.nodes) {
        return node.sequence.nodes.some((node) => iterateOverQueryPlan(node, rootPath, f));
    }
    return false;
}
function iterateOverTraceNode(node, path, f) {
    var _a, _b;
    if (f(node, path)) {
        return true;
    }
    return ((_b = (_a = node.child) === null || _a === void 0 ? void 0 : _a.some((child) => {
        const childPath = child.responseName
            ? path.child(child.responseName)
            : path;
        return iterateOverTraceNode(child, childPath, f);
    })) !== null && _b !== void 0 ? _b : false);
}
const notCollectingPathsResponseNamePath = {
    toArray() {
        throw Error('not collecting paths!');
    },
    child() {
        return this;
    },
};
class RootCollectingPathsResponseNamePath {
    toArray() {
        return [];
    }
    child(responseName) {
        return new ChildCollectingPathsResponseNamePath(responseName, this);
    }
}
class ChildCollectingPathsResponseNamePath {
    constructor(responseName, prev) {
        this.responseName = responseName;
        this.prev = prev;
    }
    toArray() {
        const out = [];
        let curr = this;
        while (curr instanceof ChildCollectingPathsResponseNamePath) {
            out.push(curr.responseName);
            curr = curr.prev;
        }
        return out.reverse();
    }
    child(responseName) {
        return new ChildCollectingPathsResponseNamePath(responseName, this);
    }
}
//# sourceMappingURL=iterateOverTrace.js.map