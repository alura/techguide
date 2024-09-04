"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClusterNotSet = void 0;
class ClusterNotSet extends Error {
    constructor() {
        super(`No cluster set. In order to run this command, please set the "cluster" property in your prisma.yml`);
    }
}
exports.ClusterNotSet = ClusterNotSet;
