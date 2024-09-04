"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultAsyncFetch = void 0;
const fetch_1 = require("@whatwg-node/fetch");
const defaultAsyncFetch = async (input, init) => {
    return (0, fetch_1.fetch)(input, init);
};
exports.defaultAsyncFetch = defaultAsyncFetch;
