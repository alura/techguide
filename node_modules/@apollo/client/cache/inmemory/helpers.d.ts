import type { DocumentNode, SelectionSetNode } from "graphql";
import type { NormalizedCache, InMemoryCacheConfig } from "./types.js";
import type { KeyFieldsContext } from "./policies.js";
import type { FragmentRegistryAPI } from "./fragmentRegistry.js";
import type { Reference, StoreValue, StoreObject, FragmentMap, FragmentMapFunction } from "../../utilities/index.js";
import { DeepMerger, isArray } from "../../utilities/index.js";
export declare const hasOwn: (v: PropertyKey) => boolean;
export declare function isNullish(value: any): value is null | undefined;
export { isArray };
export declare function defaultDataIdFromObject({ __typename, id, _id }: Readonly<StoreObject>, context?: KeyFieldsContext): string | undefined;
export declare function normalizeConfig(config: InMemoryCacheConfig): {
    dataIdFromObject: typeof defaultDataIdFromObject;
    addTypename: boolean;
    resultCaching: boolean;
    canonizeResults: boolean;
} & InMemoryCacheConfig;
export declare function shouldCanonizeResults(config: Pick<InMemoryCacheConfig, "canonizeResults">): boolean;
export declare function getTypenameFromStoreObject(store: NormalizedCache, objectOrReference: StoreObject | Reference): string | undefined;
export declare const TypeOrFieldNameRegExp: RegExp;
export declare function fieldNameFromStoreName(storeFieldName: string): string;
export declare function selectionSetMatchesResult(selectionSet: SelectionSetNode, result: Record<string, any>, variables?: Record<string, any>): boolean;
export declare function storeValueIsStoreObject(value: StoreValue): value is StoreObject;
export declare function makeProcessedFieldsMerger(): DeepMerger<any[]>;
export declare function extractFragmentContext(document: DocumentNode, fragments?: FragmentRegistryAPI): {
    fragmentMap: FragmentMap;
    lookupFragment: FragmentMapFunction;
};
//# sourceMappingURL=helpers.d.ts.map