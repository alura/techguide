"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StageNotFound = void 0;
class StageNotFound extends Error {
    constructor(name) {
        if (name) {
            super(`Stage '${name}' could not be found in the local prisma.yml`);
        }
        else {
            super(`No stage provided and no default stage set`);
        }
    }
}
exports.StageNotFound = StageNotFound;
