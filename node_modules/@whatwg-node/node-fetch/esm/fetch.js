import { createReadStream } from 'fs';
import { request as httpRequest } from 'http';
import { request as httpsRequest } from 'https';
import { Readable } from 'stream';
import { fileURLToPath } from 'url';
import { createBrotliDecompress, createGunzip, createInflate } from 'zlib';
import { PonyfillAbortError } from './AbortError.js';
import { PonyfillBlob } from './Blob.js';
import { PonyfillRequest } from './Request.js';
import { PonyfillResponse } from './Response.js';
import { PonyfillURL } from './URL.js';
import { getHeadersObj } from './utils.js';
function getResponseForFile(url) {
    const path = fileURLToPath(url);
    const readable = createReadStream(path);
    return new PonyfillResponse(readable);
}
function getRequestFnForProtocol(protocol) {
    switch (protocol) {
        case 'http:':
            return httpRequest;
        case 'https:':
            return httpsRequest;
    }
    throw new Error(`Unsupported protocol: ${protocol}`);
}
const BASE64_SUFFIX = ';base64';
export function fetchPonyfill(info, init) {
    if (typeof info === 'string' || 'href' in info) {
        const ponyfillRequest = new PonyfillRequest(info, init);
        return fetchPonyfill(ponyfillRequest);
    }
    const fetchRequest = info;
    return new Promise((resolve, reject) => {
        try {
            const url = new PonyfillURL(fetchRequest.url, 'http://localhost');
            if (url.protocol === 'data:') {
                const [mimeType = 'text/plain', ...datas] = url.pathname.split(',');
                const data = decodeURIComponent(datas.join(','));
                if (mimeType.endsWith(BASE64_SUFFIX)) {
                    const buffer = Buffer.from(data, 'base64url');
                    const realMimeType = mimeType.slice(0, -BASE64_SUFFIX.length);
                    const file = new PonyfillBlob([buffer], { type: realMimeType });
                    const response = new PonyfillResponse(file, {
                        status: 200,
                        statusText: 'OK',
                    });
                    resolve(response);
                    return;
                }
                const response = new PonyfillResponse(data, {
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
                    : Readable.from(fetchRequest.body)
                : null);
            const headersSerializer = fetchRequest.headersSerializer || getHeadersObj;
            const nodeHeaders = headersSerializer(fetchRequest.headers);
            const abortListener = function abortListener(event) {
                nodeRequest.destroy();
                const reason = event.detail;
                reject(new PonyfillAbortError(reason));
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
                        responseBody = nodeResponse.pipe(createGunzip());
                        break;
                    case 'x-deflate':
                    case 'deflate':
                        responseBody = nodeResponse.pipe(createInflate());
                        break;
                    case 'br':
                        responseBody = nodeResponse.pipe(createBrotliDecompress());
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
                        const redirectedUrl = new PonyfillURL(nodeResponse.headers.location, url);
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
                const ponyfillResponse = new PonyfillResponse(responseBody, {
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
