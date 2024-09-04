export declare class PonyfillURLSearchParams implements URLSearchParams {
    private params;
    constructor(init?: string | string[][] | Record<string, string> | URLSearchParams);
    append(name: string, value: string): void;
    delete(name: string): void;
    get(name: string): string | null;
    getAll(name: string): string[];
    has(name: string): boolean;
    set(name: string, value: string): void;
    sort(): void;
    toString(): string;
    keys(): IterableIterator<string>;
    entries(): IterableIterator<[string, string]>;
    values(): IterableIterator<string>;
    [Symbol.iterator](): IterableIterator<[string, string]>;
    forEach(callback: (value: string, key: string, parent: URLSearchParams) => void): void;
    get size(): number;
}
