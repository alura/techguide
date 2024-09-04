"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PonyfillAbortController = void 0;
const AbortSignal_js_1 = require("./AbortSignal.js");
// Will be removed after v14 reaches EOL
class PonyfillAbortController {
    constructor() {
        this.signal = new AbortSignal_js_1.PonyfillAbortSignal();
    }
    abort(reason) {
        this.signal.abort(reason);
    }
}
exports.PonyfillAbortController = PonyfillAbortController;
