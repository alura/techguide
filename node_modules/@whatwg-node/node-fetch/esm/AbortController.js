import { PonyfillAbortSignal } from './AbortSignal.js';
// Will be removed after v14 reaches EOL
export class PonyfillAbortController {
    constructor() {
        this.signal = new PonyfillAbortSignal();
    }
    abort(reason) {
        this.signal.abort(reason);
    }
}
