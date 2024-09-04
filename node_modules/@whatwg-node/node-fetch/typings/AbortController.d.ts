import { PonyfillAbortSignal } from './AbortSignal.js';
export declare class PonyfillAbortController implements AbortController {
    signal: PonyfillAbortSignal;
    abort(reason?: any): void;
}
