"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchPonyfill = void 0;
const fs_1 = require("fs");
const http_1 = require("http");
const https_1 = require("https");
const stream_1 = require("stream");
const url_1 = require("url");
const zlib_1 = require("zlib");
const AbortError_js_1 = require("./AbortError.js");
const Blob_js_1 = require("./Blob.js");
const Request_js_1 = require("./Request.js");
const Response_js_1 = require("./Response.js");
const URL_js_1 = require("./URL.js");
const utils_js_1 = require("./utils.js");
function getResponseForFile(url) {
    const path = (0, url_1.fileURLToPath)(url);
    const readable = (0, fs_1.createReadStream)(path);
    return new Response_js_1.PonyfillResponse(readable);
}
function getRequestFnForProtocol(protocol) {
    switch (protocol) {
        case 'http:':
            return http_1.request;
        case 'https:':
            return https_1.request;
    }
    throw new Error(`Unsupported protocol: ${protocol}`);
}
const BASE64_SUFFIX = ';base64';
function fetchPonyfill(info, init) {
    if (typeof info === 'string' || 'href' in info) {
        const ponyfillRequest = new Request_js_1.PonyfillRequest(info, init);
        return fetchPonyfill(ponyfillRequest);
    }
    const fetchRequest = info;
    return new Promise((resolve, reject) => {
        try {
            const url = new URL_js_1.PonyfillURL(fetchRequest.url, 'http://localhost');
            if (url.protocol === 'data:') {
                const [mimeType = 'text/plain', ...datas] = url.pathname.split(',');
                const data = decodeURIComponent(datas.join(','));
                if (mimeType.endsWith(BASE64_SUFFIX)) {
                    const buffer = Buffer.from(data, 'base64url');
                    const realMimeType = mimeType.slice(0, -BASE64_SUFFIX.length);
                    const file = new Blob_js_1.PonyfillBlob([buffer], { type: realMimeType });
                    const response = new Response_js_1.PonyfillResponse(file, {
                        status: 200,
                        statusText: 'OK',
                    });
                    resolve(response);
                    return;
                }
                const response = new Response_js_1.PonyfillResponse(data, {
                    status: 200,
                    statusText: 'OK',
                    headers: {
                        'content-type': mimeType,
                    },
                });
                resolve(response);
                return;
            }
            if (url.protocol === 'file:') {
                const response = getResponseForFile(fetchRequest.url);
                resolve(response);
                return;
            }
            const requestFn = getRequestFnForProtocol(url.protocol);
            const nodeReadable = (fetchRequest.body != null
                ? 'pipe' in fetchRequest.body
                    ? fetchRequest.body
                    : stream_1.Readable.from(fetchRequest.body)
                : null);
            const headersSerializer = fetchRequest.headersSerializer || utils_js_1.getHeadersObj;
            const nodeHeaders = headersSerializer(fetchRequest.headers);
            const abortListener = function abortListener(event) {
                nodeRequest.destroy();
                const reason = event.detail;
                reject(new AbortError_js_1.PonyfillAbortError(reason));
            };
            fetchRequest.signal.addEventListener('abort', abortListener);
            const nodeRequest = requestFn(fetchRequest.url, {
                // signal: fetchRequest.signal will be added when v14 reaches EOL
                method: fetchRequest.method,
                headers: nodeHeaders,
            });
            nodeRequest.once('response', nodeResponse => {
                let responseBody = nodeResponse;
                const contentEncoding = nodeResponse.headers['content-encoding'];
                switch (contentEncoding) {
                    case 'x-gzip':
                    case 'gzip':
                        responseBody = nodeResponse.pipe((0, zlib_1.createGunzip)());
                        break;
                    case 'x-deflate':
                    case 'deflate':
                        responseBody = nodeResponse.pipe((0, zlib_1.createInflate)());
                        break;
                    case 'br':
                        responseBody = nodeResponse.pipe((0, zlib_1.createBrotliDecompress)());
                        break;
                }
                if (nodeResponse.headers.location) {
                    if (fetchRequest.redirect === 'error') {
                        const redirectError = new Error('Redirects are not allowed');
                        reject(redirectError);
                        nodeResponse.resume();
                        return;
                    }
                    if (fetchRequest.redirect === 'follow') {
                        const redirectedUrl = new URL_js_1.PonyfillURL(nodeResponse.headers.location, url);
                        const redirectResponse$ = fetchPonyfill(redirectedUrl, info);
                        resolve(redirectResponse$.then(redirectResponse => {
                            redirectResponse.redirected = true;
                            return redirectResponse;
                        }));
                        nodeResponse.resume();
                        return;
                    }
                }
                const responseHeaders = nodeResponse.headers;
                const ponyfillResponse = new Response_js_1.PonyfillResponse(responseBody, {
                    status: nodeResponse.statusCode,
                    statusText: nodeResponse.statusMessage,
                    headers: responseHeaders,
                    url: info.url,
                });
                resolve(ponyfillResponse);
            });
            nodeRequest.once('error', reject);
            if (nodeReadable) {
                nodeReadable.pipe(nodeRequest);
            }
            else {
                nodeRequest.end();
            }
        }
        catch (e) {
            reject(e);
        }
    });
}
exports.fetchPonyfill = fetchPonyfill;
