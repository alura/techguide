import type { KeySpecifier, KeyFieldsFunction, KeyArgsFunction } from "./policies.js";
export declare function keyFieldsFnFromSpecifier(specifier: KeySpecifier): KeyFieldsFunction;
export declare function keyArgsFnFromSpecifier(specifier: KeySpecifier): KeyArgsFunction;
export declare function collectSpecifierPaths(specifier: KeySpecifier, extractor: (path: string[]) => any): Record<string, any>;
export declare function getSpecifierPaths(spec: KeySpecifier): string[][];
declare function extractKey<TObj extends Record<string, any>, TKey extends string>(object: TObj, key: TKey): TObj[TKey] | undefined;
export declare function extractKeyPath(object: Record<string, any>, path: string[], extract?: typeof extractKey): any;
export {};
//# sourceMappingURL=key-extractor.d.ts.map