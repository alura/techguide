"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleEventStreamResponse = exports.isReadableStream = void 0;
const utils_1 = require("@graphql-tools/utils");
const handleAsyncIterable_js_1 = require("./handleAsyncIterable.js");
const addCancelToResponseStream_js_1 = require("./addCancelToResponseStream.js");
const handleReadableStream_js_1 = require("./handleReadableStream.js");
function isReadableStream(value) {
    return value && typeof value.getReader === 'function';
}
exports.isReadableStream = isReadableStream;
function handleEventStreamResponse(response, controller) {
    // node-fetch returns body as a promise so we need to resolve it
    const body = response.body;
    if (body) {
        if ((0, utils_1.isAsyncIterable)(body)) {
            const resultStream = (0, handleAsyncIterable_js_1.handleAsyncIterable)(body);
            if (controller) {
                return (0, addCancelToResponseStream_js_1.addCancelToResponseStream)(resultStream, controller);
            }
            else {
                return resultStream;
            }
        }
        if (isReadableStream(body)) {
            return (0, handleReadableStream_js_1.handleReadableStream)(body);
        }
    }
    throw new Error('Response body is expected to be a readable stream but got; ' + (0, utils_1.inspect)(body));
}
exports.handleEventStreamResponse = handleEventStreamResponse;
