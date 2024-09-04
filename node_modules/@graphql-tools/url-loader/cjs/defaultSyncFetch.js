"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultSyncFetch = void 0;
const tslib_1 = require("tslib");
const sync_fetch_1 = tslib_1.__importDefault(require("@ardatan/sync-fetch"));
const defaultSyncFetch = (input, init) => {
    if (typeof input === 'string') {
        init === null || init === void 0 ? true : delete init.signal;
    }
    else {
        delete input.signal;
    }
    return (0, sync_fetch_1.default)(input, init);
};
exports.defaultSyncFetch = defaultSyncFetch;
