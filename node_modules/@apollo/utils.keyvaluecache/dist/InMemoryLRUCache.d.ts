import LRUCache from "lru-cache";
import type { KeyValueCache, KeyValueCacheSetOptions } from "./KeyValueCache";
export declare class InMemoryLRUCache<T = string> implements KeyValueCache<T> {
    private cache;
    constructor(lruCacheOpts?: LRUCache.Options<string, T>);
    static sizeCalculation<T>(item: T): number;
    set(key: string, value: T, options?: KeyValueCacheSetOptions): Promise<void>;
    get(key: string): Promise<T | undefined>;
    delete(key: string): Promise<boolean>;
    clear(): void;
    keys(): string[];
}
//# sourceMappingURL=InMemoryLRUCache.d.ts.map