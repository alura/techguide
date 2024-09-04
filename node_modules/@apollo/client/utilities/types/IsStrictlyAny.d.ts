export type IsStrictlyAny<T> = UnionToIntersection<UnionForAny<T>> extends never ? true : false;
type UnionForAny<T> = T extends never ? "a" : 1;
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
export {};
//# sourceMappingURL=IsStrictlyAny.d.ts.map