import type { CommonCache } from "./common";
export declare class StrongCache<K = any, V = any> implements CommonCache<K, V> {
    private max;
    dispose: (value: V, key: K) => void;
    private map;
    private newest;
    private oldest;
    constructor(max?: number, dispose?: (value: V, key: K) => void);
    has(key: K): boolean;
    get(key: K): V | undefined;
    get size(): number;
    private getNode;
    set(key: K, value: V): V;
    clean(): void;
    delete(key: K): boolean;
}
