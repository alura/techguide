import { PonyfillBlob } from './Blob.cjs';
import { PonyfillReadableStream } from './ReadableStream.cjs';
export declare class PonyfillFormData implements FormData {
    private map;
    append(name: string, value: PonyfillBlob | string, fileName?: string): void;
    delete(name: string): void;
    get(name: string): FormDataEntryValue | null;
    getAll(name: string): FormDataEntryValue[];
    has(name: string): boolean;
    set(name: string, value: PonyfillBlob | string, fileName?: string): void;
    [Symbol.iterator](): IterableIterator<[string, FormDataEntryValue]>;
    entries(): IterableIterator<[string, FormDataEntryValue]>;
    keys(): IterableIterator<string>;
    values(): IterableIterator<FormDataEntryValue>;
    forEach(callback: (value: FormDataEntryValue, key: string, parent: this) => void): void;
}
export declare function getStreamFromFormData(formData: FormData, boundary?: string): PonyfillReadableStream<Uint8Array>;
