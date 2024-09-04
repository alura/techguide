"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClusterNotFound = void 0;
class ClusterNotFound extends Error {
    constructor(name) {
        super(`Cluster '${name}' is neither a known shared cluster nor defined in your global .prismarc.`);
    }
}
exports.ClusterNotFound = ClusterNotFound;
