import type { KeyValueCache } from '@apollo/utils.keyvaluecache';
export declare class UnboundedCache<T = string> implements KeyValueCache<T> {
    private cache;
    constructor(cache?: Map<string, {
        value: T;
        deadline: number | null;
    }>);
    get(key: string): Promise<T | undefined>;
    set(key: string, value: T, { ttl }?: {
        ttl: number | null;
    }): Promise<void>;
    delete(key: string): Promise<void>;
}
//# sourceMappingURL=UnboundedCache.d.ts.map