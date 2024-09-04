import type { FieldPolicy, Reference } from "../../cache/index.js";
type KeyArgs = FieldPolicy<any>["keyArgs"];
export declare function concatPagination<T = Reference>(keyArgs?: KeyArgs): FieldPolicy<T[]>;
export declare function offsetLimitPagination<T = Reference>(keyArgs?: KeyArgs): FieldPolicy<T[]>;
export type TRelayEdge<TNode> = {
    cursor?: string;
    node: TNode;
} | (Reference & {
    cursor?: string;
});
export type TRelayPageInfo = {
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    startCursor: string;
    endCursor: string;
};
export type TExistingRelay<TNode> = Readonly<{
    edges: TRelayEdge<TNode>[];
    pageInfo: TRelayPageInfo;
}>;
export type TIncomingRelay<TNode> = {
    edges?: TRelayEdge<TNode>[];
    pageInfo?: TRelayPageInfo;
};
export type RelayFieldPolicy<TNode> = FieldPolicy<TExistingRelay<TNode> | null, TIncomingRelay<TNode> | null, TIncomingRelay<TNode> | null>;
export declare function relayStylePagination<TNode extends Reference = Reference>(keyArgs?: KeyArgs): RelayFieldPolicy<TNode>;
export {};
//# sourceMappingURL=pagination.d.ts.map