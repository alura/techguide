import type { DocumentNode, FieldNode } from "graphql";
import type { Reference, StoreObject, StoreValue, isReference, AsStoreObject } from "../../../utilities/index.js";
import type { StorageType } from "../../inmemory/policies.js";
export type SafeReadonly<T> = T extends object ? Readonly<T> : T;
export type MissingTree = string | {
    readonly [key: string]: MissingTree;
};
export declare class MissingFieldError extends Error {
    readonly message: string;
    readonly path: MissingTree | Array<string | number>;
    readonly query: DocumentNode;
    readonly variables?: Record<string, any> | undefined;
    constructor(message: string, path: MissingTree | Array<string | number>, query: DocumentNode, variables?: Record<string, any> | undefined);
    readonly missing: MissingTree;
}
export interface FieldSpecifier {
    typename?: string;
    fieldName: string;
    field?: FieldNode;
    args?: Record<string, any>;
    variables?: Record<string, any>;
}
export interface ReadFieldOptions extends FieldSpecifier {
    from?: StoreObject | Reference;
}
export interface ReadFieldFunction {
    <V = StoreValue>(options: ReadFieldOptions): SafeReadonly<V> | undefined;
    <V = StoreValue>(fieldName: string, from?: StoreObject | Reference): SafeReadonly<V> | undefined;
}
export type ToReferenceFunction = (objOrIdOrRef: StoreObject | string | Reference, mergeIntoStore?: boolean) => Reference | undefined;
export type CanReadFunction = (value: StoreValue) => boolean;
declare const _deleteModifier: unique symbol;
export interface DeleteModifier {
    [_deleteModifier]: true;
}
declare const _invalidateModifier: unique symbol;
export interface InvalidateModifier {
    [_invalidateModifier]: true;
}
declare const _ignoreModifier: unique symbol;
export interface IgnoreModifier {
    [_ignoreModifier]: true;
}
export type ModifierDetails = {
    DELETE: DeleteModifier;
    INVALIDATE: InvalidateModifier;
    fieldName: string;
    storeFieldName: string;
    readField: ReadFieldFunction;
    canRead: CanReadFunction;
    isReference: typeof isReference;
    toReference: ToReferenceFunction;
    storage: StorageType;
};
export type Modifier<T> = (value: T, details: ModifierDetails) => T | DeleteModifier | InvalidateModifier;
type StoreObjectValueMaybeReference<StoreVal> = StoreVal extends Array<Record<string, any>> ? StoreVal extends Array<infer Item> ? Item extends Record<string, any> ? ReadonlyArray<AsStoreObject<Item> | Reference> : never : never : StoreVal extends Record<string, any> ? AsStoreObject<StoreVal> | Reference : StoreVal;
export type AllFieldsModifier<Entity extends Record<string, any>> = Modifier<Entity[keyof Entity] extends infer Value ? StoreObjectValueMaybeReference<Exclude<Value, undefined>> : never>;
export type Modifiers<T extends Record<string, any> = Record<string, unknown>> = Partial<{
    [FieldName in keyof T]: Modifier<StoreObjectValueMaybeReference<Exclude<T[FieldName], undefined>>>;
}>;
export {};
//# sourceMappingURL=common.d.ts.map