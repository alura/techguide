import { PonyfillAbortController } from './AbortController.js';
import { PonyfillBody } from './Body.js';
import { PonyfillHeaders } from './Headers.js';
import { getHeadersObj } from './utils.js';
function isRequest(input) {
    return input[Symbol.toStringTag] === 'Request';
}
export class PonyfillRequest extends PonyfillBody {
    constructor(input, options) {
        var _a;
        let url;
        let bodyInit = null;
        let requestInit;
        if (typeof input === 'string') {
            url = input;
        }
        else if ('href' in input) {
            url = input.toString();
        }
        else if (isRequest(input)) {
            url = input.url;
            bodyInit = input.body;
            requestInit = input;
        }
        if (options != null) {
            bodyInit = options.body || null;
            requestInit = options;
        }
        super(bodyInit, options);
        this.destination = '';
        this.priority = 'auto';
        this.cache = (requestInit === null || requestInit === void 0 ? void 0 : requestInit.cache) || 'default';
        this.credentials = (requestInit === null || requestInit === void 0 ? void 0 : requestInit.credentials) || 'same-origin';
        this.headers = new PonyfillHeaders(requestInit === null || requestInit === void 0 ? void 0 : requestInit.headers);
        this.integrity = (requestInit === null || requestInit === void 0 ? void 0 : requestInit.integrity) || '';
        this.keepalive = (requestInit === null || requestInit === void 0 ? void 0 : requestInit.keepalive) != null ? requestInit === null || requestInit === void 0 ? void 0 : requestInit.keepalive : false;
        this.method = ((_a = requestInit === null || requestInit === void 0 ? void 0 : requestInit.method) === null || _a === void 0 ? void 0 : _a.toUpperCase()) || 'GET';
        this.mode = (requestInit === null || requestInit === void 0 ? void 0 : requestInit.mode) || 'cors';
        this.redirect = (requestInit === null || requestInit === void 0 ? void 0 : requestInit.redirect) || 'follow';
        this.referrer = (requestInit === null || requestInit === void 0 ? void 0 : requestInit.referrer) || 'about:client';
        this.referrerPolicy = (requestInit === null || requestInit === void 0 ? void 0 : requestInit.referrerPolicy) || 'no-referrer';
        this.signal = (requestInit === null || requestInit === void 0 ? void 0 : requestInit.signal) || new PonyfillAbortController().signal;
        this.headersSerializer = (requestInit === null || requestInit === void 0 ? void 0 : requestInit.headersSerializer) || getHeadersObj;
        this.url = url || '';
        const contentTypeInHeaders = this.headers.get('content-type');
        if (!contentTypeInHeaders) {
            if (this.contentType) {
                this.headers.set('content-type', this.contentType);
            }
        }
        else {
            this.contentType = contentTypeInHeaders;
        }
        const contentLengthInHeaders = this.headers.get('content-length');
        if (!contentLengthInHeaders) {
            if (this.contentLength) {
                this.headers.set('content-length', this.contentLength.toString());
            }
        }
        else {
            this.contentLength = parseInt(contentLengthInHeaders, 10);
        }
    }
    clone() {
        return new Request(this);
    }
}
