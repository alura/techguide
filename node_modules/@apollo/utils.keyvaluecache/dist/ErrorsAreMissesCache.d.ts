import type { KeyValueCache } from "./KeyValueCache";
import type { Logger } from "@apollo/utils.logger";
export declare class ErrorsAreMissesCache<V = string> implements KeyValueCache<V> {
    private cache;
    private logger?;
    constructor(cache: KeyValueCache<V>, logger?: Logger | undefined);
    get(key: string): Promise<V | undefined>;
    set(key: string, value: V, opts?: {
        ttl?: number;
    }): Promise<void>;
    delete(key: string): Promise<boolean | void>;
}
//# sourceMappingURL=ErrorsAreMissesCache.d.ts.map