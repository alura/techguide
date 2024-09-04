import type { ApolloClient, ApolloQueryResult, DocumentNode, OperationVariables, TypedDocumentNode, FetchMoreQueryOptions, WatchQueryOptions } from "../../core/index.js";
import { ApolloError, NetworkStatus } from "../../core/index.js";
import type { DeepPartial } from "../../utilities/index.js";
import type { SuspenseQueryHookOptions, ObservableQueryFields, NoInfer } from "../types/types.js";
import type { SkipToken } from "./constants.js";
export interface UseSuspenseQueryResult<TData = unknown, TVariables extends OperationVariables = OperationVariables> {
    client: ApolloClient<any>;
    data: TData;
    error: ApolloError | undefined;
    fetchMore: FetchMoreFunction<TData, TVariables>;
    networkStatus: NetworkStatus;
    refetch: RefetchFunction<TData, TVariables>;
    subscribeToMore: SubscribeToMoreFunction<TData, TVariables>;
}
export type FetchMoreFunction<TData, TVariables extends OperationVariables> = (fetchMoreOptions: FetchMoreQueryOptions<TVariables, TData> & {
    updateQuery?: (previousQueryResult: TData, options: {
        fetchMoreResult: TData;
        variables: TVariables;
    }) => TData;
}) => Promise<ApolloQueryResult<TData>>;
export type RefetchFunction<TData, TVariables extends OperationVariables> = ObservableQueryFields<TData, TVariables>["refetch"];
export type SubscribeToMoreFunction<TData, TVariables extends OperationVariables> = ObservableQueryFields<TData, TVariables>["subscribeToMore"];
export declare function useSuspenseQuery<TData, TVariables extends OperationVariables, TOptions extends Omit<SuspenseQueryHookOptions<TData>, "variables">>(query: DocumentNode | TypedDocumentNode<TData, TVariables>, options?: SuspenseQueryHookOptions<NoInfer<TData>, NoInfer<TVariables>> & TOptions): UseSuspenseQueryResult<TOptions["errorPolicy"] extends "ignore" | "all" ? TOptions["returnPartialData"] extends true ? DeepPartial<TData> | undefined : TData | undefined : TOptions["returnPartialData"] extends true ? TOptions["skip"] extends boolean ? DeepPartial<TData> | undefined : DeepPartial<TData> : TOptions["skip"] extends boolean ? TData | undefined : TData, TVariables>;
export declare function useSuspenseQuery<TData = unknown, TVariables extends OperationVariables = OperationVariables>(query: DocumentNode | TypedDocumentNode<TData, TVariables>, options: SuspenseQueryHookOptions<NoInfer<TData>, NoInfer<TVariables>> & {
    returnPartialData: true;
    errorPolicy: "ignore" | "all";
}): UseSuspenseQueryResult<DeepPartial<TData> | undefined, TVariables>;
export declare function useSuspenseQuery<TData = unknown, TVariables extends OperationVariables = OperationVariables>(query: DocumentNode | TypedDocumentNode<TData, TVariables>, options: SuspenseQueryHookOptions<NoInfer<TData>, NoInfer<TVariables>> & {
    errorPolicy: "ignore" | "all";
}): UseSuspenseQueryResult<TData | undefined, TVariables>;
export declare function useSuspenseQuery<TData = unknown, TVariables extends OperationVariables = OperationVariables>(query: DocumentNode | TypedDocumentNode<TData, TVariables>, options: SuspenseQueryHookOptions<NoInfer<TData>, NoInfer<TVariables>> & {
    skip: boolean;
    returnPartialData: true;
}): UseSuspenseQueryResult<DeepPartial<TData> | undefined, TVariables>;
export declare function useSuspenseQuery<TData = unknown, TVariables extends OperationVariables = OperationVariables>(query: DocumentNode | TypedDocumentNode<TData, TVariables>, options: SuspenseQueryHookOptions<NoInfer<TData>, NoInfer<TVariables>> & {
    returnPartialData: true;
}): UseSuspenseQueryResult<DeepPartial<TData>, TVariables>;
export declare function useSuspenseQuery<TData = unknown, TVariables extends OperationVariables = OperationVariables>(query: DocumentNode | TypedDocumentNode<TData, TVariables>, options: SuspenseQueryHookOptions<NoInfer<TData>, NoInfer<TVariables>> & {
    skip: boolean;
}): UseSuspenseQueryResult<TData | undefined, TVariables>;
export declare function useSuspenseQuery<TData = unknown, TVariables extends OperationVariables = OperationVariables>(query: DocumentNode | TypedDocumentNode<TData, TVariables>, options?: SuspenseQueryHookOptions<NoInfer<TData>, NoInfer<TVariables>>): UseSuspenseQueryResult<TData, TVariables>;
export declare function useSuspenseQuery<TData = unknown, TVariables extends OperationVariables = OperationVariables>(query: DocumentNode | TypedDocumentNode<TData, TVariables>, options: SkipToken | (SuspenseQueryHookOptions<NoInfer<TData>, NoInfer<TVariables>> & {
    returnPartialData: true;
})): UseSuspenseQueryResult<DeepPartial<TData> | undefined, TVariables>;
export declare function useSuspenseQuery<TData = unknown, TVariables extends OperationVariables = OperationVariables>(query: DocumentNode | TypedDocumentNode<TData, TVariables>, options?: SkipToken | SuspenseQueryHookOptions<NoInfer<TData>, NoInfer<TVariables>>): UseSuspenseQueryResult<TData | undefined, TVariables>;
export declare function toApolloError(result: ApolloQueryResult<any>): ApolloError | undefined;
interface UseWatchQueryOptionsHookOptions<TData, TVariables extends OperationVariables> {
    client: ApolloClient<unknown>;
    query: DocumentNode | TypedDocumentNode<TData, TVariables>;
    options: SkipToken | SuspenseQueryHookOptions<TData, TVariables>;
}
export declare function useWatchQueryOptions<TData, TVariables extends OperationVariables>({ client, query, options, }: UseWatchQueryOptionsHookOptions<TData, TVariables>): WatchQueryOptions<TVariables, TData>;
export {};
//# sourceMappingURL=useSuspenseQuery.d.ts.map