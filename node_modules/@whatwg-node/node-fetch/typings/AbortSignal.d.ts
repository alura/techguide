import { EventTarget } from '@whatwg-node/events';
export declare class PonyfillAbortSignal extends EventTarget implements AbortSignal {
    aborted: boolean;
    _onabort: ((this: AbortSignal, ev: Event) => any) | null;
    reason: any;
    throwIfAborted(): void;
    get onabort(): ((this: AbortSignal, ev: Event) => any) | null;
    set onabort(value: ((this: AbortSignal, ev: Event) => any) | null);
    abort(reason?: any): void;
    static timeout(milliseconds: number): PonyfillAbortSignal;
}
