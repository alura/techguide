import type { CommonCache } from "./common";
export declare class WeakCache<K extends object = any, V = any> implements CommonCache<K, V> {
    private max;
    dispose: (value: V, key?: K) => void;
    private map;
    private registry;
    private newest;
    private oldest;
    private unfinalizedNodes;
    private finalizationScheduled;
    size: number;
    constructor(max?: number, dispose?: (value: V, key?: K) => void);
    has(key: K): boolean;
    get(key: K): V | undefined;
    private getNode;
    set(key: K, value: V): V;
    clean(): void;
    private deleteNode;
    delete(key: K): boolean;
    private scheduleFinalization;
    private finalize;
}
