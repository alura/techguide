"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PonyfillResponse = void 0;
const http_1 = require("http");
const Body_js_1 = require("./Body.js");
const Headers_js_1 = require("./Headers.js");
class PonyfillResponse extends Body_js_1.PonyfillBody {
    constructor(body, init) {
        super(body || null, init);
        this.headers = new Headers_js_1.PonyfillHeaders();
        this.status = 200;
        this.statusText = 'OK';
        this.url = '';
        this.redirected = false;
        this.type = 'default';
        if (init) {
            this.headers = new Headers_js_1.PonyfillHeaders(init.headers);
            this.status = init.status || 200;
            this.statusText = init.statusText || http_1.STATUS_CODES[this.status] || 'OK';
            this.url = init.url || '';
            this.redirected = init.redirected || false;
            this.type = init.type || 'default';
        }
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
    get ok() {
        return this.status >= 200 && this.status < 300;
    }
    clone() {
        return new PonyfillResponse(this.body, this);
    }
    static error() {
        return new PonyfillResponse(null, {
            status: 500,
            statusText: 'Internal Server Error',
        });
    }
    static redirect(url, status = 301) {
        if (status < 300 || status > 399) {
            throw new RangeError('Invalid status code');
        }
        return new PonyfillResponse(null, {
            headers: {
                location: url,
            },
            status,
        });
    }
    static json(data, init = {}) {
        return new PonyfillResponse(JSON.stringify(data), {
            ...init,
            headers: {
                'Content-Type': 'application/json',
                ...init === null || init === void 0 ? void 0 : init.headers,
            },
        });
    }
}
exports.PonyfillResponse = PonyfillResponse;
