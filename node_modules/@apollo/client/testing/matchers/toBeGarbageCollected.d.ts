import type { MatcherFunction } from "expect";
declare class WeakRef<T extends WeakKey> {
    constructor(target: T);
    deref(): T | undefined;
}
export declare const toBeGarbageCollected: MatcherFunction<[weakRef: WeakRef<any>]>;
export {};
//# sourceMappingURL=toBeGarbageCollected.d.ts.map