// @ts-ignore
import asyncIterator from './iterators/async.mjs';
// @ts-ignore
import nodeStreamIterator from './iterators/nodeStream.mjs';
// @ts-ignore
import promiseIterator from './iterators/promise.mjs';
// @ts-ignore
import readerIterator from './iterators/reader.mjs';
const hasIterator = typeof Symbol !== 'undefined' && Symbol.asyncIterator;
/**
 * @param response A response. Supports fetch, node-fetch, and cross-fetch
 */ export default function responseIterator(response) {
    if (response === undefined) throw new Error('Missing response for responseIterator');
    // determine the body
    let body = response;
    if (response.body) body = response.body;
    else if (response.data) body = response.data;
    else if (response._bodyBlob) body = response._bodyBlob; // cross-fetch
    /* c8 ignore stop */ // adapt the body
    if (hasIterator && body[Symbol.asyncIterator]) return asyncIterator(body);
    /* c8 ignore start */ if (body.getReader) return readerIterator(body.getReader());
    if (body.stream) return readerIterator(body.stream().getReader());
    if (body.arrayBuffer) return promiseIterator(body.arrayBuffer());
    if (body.pipe) return nodeStreamIterator(body);
    /* c8 ignore stop */ throw new Error('Unknown body type for responseIterator. Maybe you are not passing a streamable response');
};
