import { PonyfillAbortSignal } from './AbortSignal.cjs';
export declare class PonyfillAbortController implements AbortController {
    signal: PonyfillAbortSignal;
    abort(reason?: any): void;
}
