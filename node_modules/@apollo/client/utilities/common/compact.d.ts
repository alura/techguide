import type { TupleToIntersection } from "./mergeDeep.js";
/**
 * Merges the provided objects shallowly and removes
 * all properties with an `undefined` value
 */
export declare function compact<TArgs extends any[]>(...objects: TArgs): TupleToIntersection<TArgs>;
//# sourceMappingURL=compact.d.ts.map