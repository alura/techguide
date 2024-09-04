/// <reference types="node" />
import { Readable } from 'stream';
export declare class PonyfillReadableStream<T> implements ReadableStream<T> {
    readable: Readable;
    constructor(underlyingSource?: UnderlyingSource<T> | Readable | ReadableStream<T> | PonyfillReadableStream<T>);
    cancel(reason?: any): Promise<void>;
    locked: boolean;
    getReader(options: {
        mode: 'byob';
    }): ReadableStreamBYOBReader;
    getReader(): ReadableStreamDefaultReader<T>;
    [Symbol.asyncIterator](): AsyncIterableIterator<any>;
    tee(): [ReadableStream<T>, ReadableStream<T>];
    pipeTo(destination: WritableStream<T>): Promise<void>;
    pipeThrough<T2>({ writable, readable, }: {
        writable: WritableStream<T>;
        readable: ReadableStream<T2>;
    }): ReadableStream<T2>;
    static [Symbol.hasInstance](instance: unknown): instance is PonyfillReadableStream<unknown>;
}
