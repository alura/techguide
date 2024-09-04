import type { DocumentNode, GraphQLError } from "graphql";
import type { ApolloCache } from "../cache/index.js";
import type { FetchResult } from "../link/core/index.js";
import type { ApolloError } from "../errors/index.js";
import type { QueryInfo } from "./QueryInfo.js";
import type { NetworkStatus } from "./networkStatus.js";
import type { Resolver } from "./LocalState.js";
import type { ObservableQuery } from "./ObservableQuery.js";
import type { QueryOptions } from "./watchQueryOptions.js";
import type { Cache } from "../cache/index.js";
import type { IsStrictlyAny } from "../utilities/index.js";
export type { TypedDocumentNode } from "@graphql-typed-document-node/core";
export type MethodKeys<T> = {
    [P in keyof T]: T[P] extends Function ? P : never;
}[keyof T];
export interface DefaultContext extends Record<string, any> {
}
export type QueryListener = (queryInfo: QueryInfo) => void;
export type OnQueryUpdated<TResult> = (observableQuery: ObservableQuery<any>, diff: Cache.DiffResult<any>, lastDiff: Cache.DiffResult<any> | undefined) => boolean | TResult;
export type RefetchQueryDescriptor = string | DocumentNode;
export type InternalRefetchQueryDescriptor = RefetchQueryDescriptor | QueryOptions;
type RefetchQueriesIncludeShorthand = "all" | "active";
export type RefetchQueriesInclude = RefetchQueryDescriptor[] | RefetchQueriesIncludeShorthand;
export type InternalRefetchQueriesInclude = InternalRefetchQueryDescriptor[] | RefetchQueriesIncludeShorthand;
export interface RefetchQueriesOptions<TCache extends ApolloCache<any>, TResult> {
    updateCache?: (cache: TCache) => void;
    include?: RefetchQueriesInclude;
    optimistic?: boolean;
    onQueryUpdated?: OnQueryUpdated<TResult> | null;
}
export type RefetchQueriesPromiseResults<TResult> = IsStrictlyAny<TResult> extends true ? any[] : TResult extends boolean ? ApolloQueryResult<any>[] : TResult extends PromiseLike<infer U> ? U[] : TResult[];
export interface RefetchQueriesResult<TResult> extends Promise<RefetchQueriesPromiseResults<TResult>> {
    queries: ObservableQuery<any>[];
    results: InternalRefetchQueriesResult<TResult>[];
}
export interface InternalRefetchQueriesOptions<TCache extends ApolloCache<any>, TResult> extends Omit<RefetchQueriesOptions<TCache, TResult>, "include"> {
    include?: InternalRefetchQueriesInclude;
    removeOptimistic?: string;
}
export type InternalRefetchQueriesResult<TResult> = TResult extends boolean ? Promise<ApolloQueryResult<any>> : TResult;
export type InternalRefetchQueriesMap<TResult> = Map<ObservableQuery<any>, InternalRefetchQueriesResult<TResult>>;
export type { QueryOptions as PureQueryOptions };
export type OperationVariables = Record<string, any>;
export interface ApolloQueryResult<T> {
    data: T;
    /**
     * A list of any errors that occurred during server-side execution of a GraphQL operation.
     * See https://www.apollographql.com/docs/react/data/error-handling/ for more information.
     */
    errors?: ReadonlyArray<GraphQLError>;
    /**
     * The single Error object that is passed to onError and useQuery hooks, and is often thrown during manual `client.query` calls.
     * This will contain both a NetworkError field and any GraphQLErrors.
     * See https://www.apollographql.com/docs/react/data/error-handling/ for more information.
     */
    error?: ApolloError;
    loading: boolean;
    networkStatus: NetworkStatus;
    partial?: boolean;
}
export type MutationQueryReducer<T> = (previousResult: Record<string, any>, options: {
    mutationResult: FetchResult<T>;
    queryName: string | undefined;
    queryVariables: Record<string, any>;
}) => Record<string, any>;
export type MutationQueryReducersMap<T = {
    [key: string]: any;
}> = {
    [queryName: string]: MutationQueryReducer<T>;
};
/**
 * @deprecated Use `MutationUpdaterFunction` instead.
 */
export type MutationUpdaterFn<T = {
    [key: string]: any;
}> = (cache: ApolloCache<T>, mutationResult: FetchResult<T>) => void;
export type MutationUpdaterFunction<TData, TVariables, TContext, TCache extends ApolloCache<any>> = (cache: TCache, result: Omit<FetchResult<TData>, "context">, options: {
    context?: TContext;
    variables?: TVariables;
}) => void;
export interface Resolvers {
    [key: string]: {
        [field: string]: Resolver;
    };
}
//# sourceMappingURL=types.d.ts.map