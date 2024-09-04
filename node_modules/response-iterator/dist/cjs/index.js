"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
module.exports = responseIterator;
var _asyncTs = _interopRequireDefault(require("./iterators/async.js"));
var _nodeStreamTs = _interopRequireDefault(require("./iterators/nodeStream.js"));
var _promiseTs = _interopRequireDefault(require("./iterators/promise.js"));
var _readerTs = _interopRequireDefault(require("./iterators/reader.js"));
function responseIterator(response) {
    if (response === undefined) throw new Error("Missing response for responseIterator");
    // determine the body
    var body = response;
    if (response.body) body = response.body;
    else if (response.data) body = response.data;
    else if (response._bodyBlob) body = response._bodyBlob; // cross-fetch
    /* c8 ignore stop */ // adapt the body
    if (hasIterator && body[Symbol.asyncIterator]) return (0, _asyncTs).default(body);
    /* c8 ignore start */ if (body.getReader) return (0, _readerTs).default(body.getReader());
    if (body.stream) return (0, _readerTs).default(body.stream().getReader());
    if (body.arrayBuffer) return (0, _promiseTs).default(body.arrayBuffer());
    if (body.pipe) return (0, _nodeStreamTs).default(body);
    /* c8 ignore stop */ throw new Error("Unknown body type for responseIterator. Maybe you are not passing a streamable response");
}
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
var hasIterator = typeof Symbol !== "undefined" && Symbol.asyncIterator;
