import { isNonNullObject } from "./objects.js";
export type TupleToIntersection<T extends any[]> = T extends [infer A] ? A : T extends [infer A, infer B] ? A & B : T extends [infer A, infer B, infer C] ? A & B & C : T extends [infer A, infer B, infer C, infer D] ? A & B & C & D : T extends [infer A, infer B, infer C, infer D, infer E] ? A & B & C & D & E : T extends (infer U)[] ? U : any;
export declare function mergeDeep<T extends any[]>(...sources: T): TupleToIntersection<T>;
export declare function mergeDeepArray<T>(sources: T[]): T;
export type ReconcilerFunction<TContextArgs extends any[]> = (this: DeepMerger<TContextArgs>, target: Record<string | number, any>, source: Record<string | number, any>, property: string | number, ...context: TContextArgs) => any;
export declare class DeepMerger<TContextArgs extends any[]> {
    private reconciler;
    constructor(reconciler?: ReconcilerFunction<TContextArgs>);
    merge(target: any, source: any, ...context: TContextArgs): any;
    isObject: typeof isNonNullObject;
    private pastCopies;
    shallowCopyForMerge<T>(value: T): T;
}
//# sourceMappingURL=mergeDeep.d.ts.map