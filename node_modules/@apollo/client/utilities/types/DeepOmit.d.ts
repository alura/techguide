import type { Primitive } from "./Primitive.js";
type DeepOmitPrimitive = Primitive | Function;
export type DeepOmitArray<T extends any[], K> = {
    [P in keyof T]: DeepOmit<T[P], K>;
};
export type DeepOmit<T, K> = T extends DeepOmitPrimitive ? T : {
    [P in Exclude<keyof T, K>]: T[P] extends infer TP ? TP extends DeepOmitPrimitive ? TP : TP extends any[] ? DeepOmitArray<TP, K> : DeepOmit<TP, K> : never;
};
export {};
//# sourceMappingURL=DeepOmit.d.ts.map