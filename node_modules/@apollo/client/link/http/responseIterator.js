/**
 * Original source:
 * https://github.com/kmalakoff/response-iterator/blob/master/src/index.ts
 */
import { canUseAsyncIteratorSymbol } from "../../utilities/index.js";
import asyncIterator from "./iterators/async.js";
import nodeStreamIterator from "./iterators/nodeStream.js";
import promiseIterator from "./iterators/promise.js";
import readerIterator from "./iterators/reader.js";
function isNodeResponse(value) {
    return !!value.body;
}
function isReadableStream(value) {
    return !!value.getReader;
}
function isAsyncIterableIterator(value) {
    return !!(canUseAsyncIteratorSymbol &&
        value[Symbol.asyncIterator]);
}
function isStreamableBlob(value) {
    return !!value.stream;
}
function isBlob(value) {
    return !!value.arrayBuffer;
}
function isNodeReadableStream(value) {
    return !!value.pipe;
}
export function responseIterator(response) {
    var body = response;
    if (isNodeResponse(response))
        body = response.body;
    if (isAsyncIterableIterator(body))
        return asyncIterator(body);
    if (isReadableStream(body))
        return readerIterator(body.getReader());
    // this errors without casting to ReadableStream<T>
    // because Blob.stream() returns a NodeJS ReadableStream
    if (isStreamableBlob(body)) {
        return readerIterator(body.stream().getReader());
    }
    if (isBlob(body))
        return promiseIterator(body.arrayBuffer());
    if (isNodeReadableStream(body))
        return nodeStreamIterator(body);
    throw new Error("Unknown body type for responseIterator. Please pass a streamable response.");
}
//# sourceMappingURL=responseIterator.js.map