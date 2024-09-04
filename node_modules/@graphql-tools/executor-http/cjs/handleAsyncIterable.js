"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAsyncIterable = void 0;
/* eslint-disable no-labels */
const fetch_1 = require("@whatwg-node/fetch");
async function* handleAsyncIterable(asyncIterable) {
    const textDecoder = new fetch_1.TextDecoder();
    outer: for await (const chunk of asyncIterable) {
        const chunkStr = typeof chunk === 'string' ? chunk : textDecoder.decode(chunk, { stream: true });
        for (const part of chunkStr.split('\n\n')) {
            if (part) {
                const eventStr = part.split('event: ')[1];
                const dataStr = part.split('data: ')[1];
                if (eventStr === 'complete') {
                    break outer;
                }
                if (dataStr) {
                    const data = JSON.parse(dataStr);
                    yield data.payload || data;
                }
            }
        }
    }
}
exports.handleAsyncIterable = handleAsyncIterable;
