
const createNodePonyfill = require('./create-node-ponyfill');
const ponyfills = createNodePonyfill();

module.exports.fetch = ponyfills.fetch;
module.exports.Headers = ponyfills.Headers;
module.exports.Request = ponyfills.Request;
module.exports.Response = ponyfills.Response;
module.exports.FormData = ponyfills.FormData;
module.exports.AbortSignal = ponyfills.AbortSignal;
module.exports.AbortController = ponyfills.AbortController;
module.exports.ReadableStream = ponyfills.ReadableStream;
module.exports.WritableStream = ponyfills.WritableStream;
module.exports.TransformStream = ponyfills.TransformStream;
module.exports.Blob = ponyfills.Blob;
module.exports.File = ponyfills.File;
module.exports.crypto = ponyfills.crypto;
module.exports.btoa = ponyfills.btoa;
module.exports.TextEncoder = ponyfills.TextEncoder;
module.exports.TextDecoder = ponyfills.TextDecoder;
module.exports.URLPattern = ponyfills.URLPattern;
module.exports.URL = ponyfills.URL;
module.exports.URLSearchParams = ponyfills.URLSearchParams;

exports.createFetch = createNodePonyfill;
