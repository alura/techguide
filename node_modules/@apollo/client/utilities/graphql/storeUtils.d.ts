import type { DirectiveNode, FieldNode, VariableNode, InlineFragmentNode, ValueNode, SelectionNode, NameNode, SelectionSetNode, DocumentNode } from "graphql";
import type { FragmentMap } from "./fragments.js";
export interface Reference {
    readonly __ref: string;
}
export declare function makeReference(id: string): Reference;
export declare function isReference(obj: any): obj is Reference;
export type StoreValue = number | string | string[] | Reference | Reference[] | null | undefined | void | Object;
export interface StoreObject {
    __typename?: string;
    [storeFieldName: string]: StoreValue;
}
/**
 * Workaround for a TypeScript quirk:
 * types per default have an implicit index signature that makes them
 * assignable to `StoreObject`.
 * interfaces do not have that implicit index signature, so they cannot
 * be assigned to `StoreObject`.
 * This type just maps over a type or interface that is passed in,
 * implicitly adding the index signature.
 * That way, the result can be assigned to `StoreObject`.
 *
 * This is important if some user-defined interface is used e.g.
 * in cache.modify, where the `toReference` method expects a
 * `StoreObject` as input.
 */
export type AsStoreObject<T extends {
    __typename?: string;
}> = {
    [K in keyof T]: T[K];
};
export declare function isDocumentNode(value: any): value is DocumentNode;
export declare function valueToObjectRepresentation(argObj: any, name: NameNode, value: ValueNode, variables?: Object): void;
export declare function storeKeyNameFromField(field: FieldNode, variables?: Object): string;
export type Directives = {
    [directiveName: string]: {
        [argName: string]: any;
    };
};
declare let storeKeyNameStringify: (value: any) => string;
export declare const getStoreKeyName: ((fieldName: string, args?: Record<string, any> | null, directives?: Directives) => string) & {
    setStringify(s: typeof storeKeyNameStringify): (value: any) => string;
};
export declare function argumentsObjectFromField(field: FieldNode | DirectiveNode, variables?: Record<string, any>): Object | null;
export declare function resultKeyNameFromField(field: FieldNode): string;
export declare function getTypenameFromResult(result: Record<string, any>, selectionSet: SelectionSetNode, fragmentMap?: FragmentMap): string | undefined;
export declare function isField(selection: SelectionNode): selection is FieldNode;
export declare function isInlineFragment(selection: SelectionNode): selection is InlineFragmentNode;
export type VariableValue = (node: VariableNode) => any;
export {};
//# sourceMappingURL=storeUtils.d.ts.map