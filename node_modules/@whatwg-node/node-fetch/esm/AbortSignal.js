// Will be removed after v14 reaches EOL
import { CustomEvent, EventTarget } from '@whatwg-node/events';
import { PonyfillAbortError } from './AbortError.js';
export class PonyfillAbortSignal extends EventTarget {
    constructor() {
        super(...arguments);
        this.aborted = false;
        this._onabort = null;
    }
    throwIfAborted() {
        if (this.aborted) {
            throw new PonyfillAbortError();
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
        const abortEvent = new CustomEvent('abort', { detail: reason });
        this.dispatchEvent(abortEvent);
    }
    static timeout(milliseconds) {
        const signal = new PonyfillAbortSignal();
        setTimeout(() => signal.abort(`timeout in ${milliseconds} ms`), milliseconds);
        return signal;
    }
}
