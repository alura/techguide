"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PonyfillAbortSignal = void 0;
// Will be removed after v14 reaches EOL
const events_1 = require("@whatwg-node/events");
const AbortError_js_1 = require("./AbortError.js");
class PonyfillAbortSignal extends events_1.EventTarget {
    constructor() {
        super(...arguments);
        this.aborted = false;
        this._onabort = null;
    }
    throwIfAborted() {
        if (this.aborted) {
            throw new AbortError_js_1.PonyfillAbortError();
        }
    }
    get onabort() {
        return this._onabort;
    }
    set onabort(value) {
        if (this._onabort) {
            this.removeEventListener('abort', this._onabort);
        }
        this.addEventListener('abort', value);
    }
    abort(reason) {
        const abortEvent = new events_1.CustomEvent('abort', { detail: reason });
        this.dispatchEvent(abortEvent);
    }
    static timeout(milliseconds) {
        const signal = new PonyfillAbortSignal();
        setTimeout(() => signal.abort(`timeout in ${milliseconds} ms`), milliseconds);
        return signal;
    }
}
exports.PonyfillAbortSignal = PonyfillAbortSignal;
