import type { ApolloQueryResult, ObservableQuery, OperationVariables, WatchQueryOptions } from "../../../core/index.js";
import type { PromiseWithState } from "../../../utilities/index.js";
import type { QueryKey } from "./types.js";
type QueryRefPromise<TData> = PromiseWithState<ApolloQueryResult<TData>>;
type Listener<TData> = (promise: QueryRefPromise<TData>) => void;
type FetchMoreOptions<TData> = Parameters<ObservableQuery<TData>["fetchMore"]>[0];
declare const QUERY_REFERENCE_SYMBOL: unique symbol;
declare const PROMISE_SYMBOL: unique symbol;
declare const QUERY_REF_BRAND: unique symbol;
/**
 * A `QueryReference` is an opaque object returned by `useBackgroundQuery`.
 * A child component reading the `QueryReference` via `useReadQuery` will
 * suspend until the promise resolves.
 */
export interface QueryRef<TData = unknown, TVariables = unknown> {
    /** @internal */
    [QUERY_REF_BRAND]?(variables: TVariables): TData;
}
/**
 * @internal
 * For usage in internal helpers only.
 */
interface WrappedQueryRef<TData = unknown, TVariables = unknown> extends QueryRef<TData, TVariables> {
    /** @internal */
    readonly [QUERY_REFERENCE_SYMBOL]: InternalQueryReference<TData>;
    /** @internal */
    [PROMISE_SYMBOL]: QueryRefPromise<TData>;
    /** @internal */
    toPromise?(): Promise<unknown>;
}
/**
 * @deprecated Please use the `QueryRef` interface instead of `QueryReference`.
 * 
 * A `QueryReference` is an opaque object returned by `useBackgroundQuery`. A child component reading the `QueryReference` via `useReadQuery` will suspend until the promise resolves.
 */
export interface QueryReference<TData = unknown, TVariables = unknown> extends QueryRef<TData, TVariables> {
    /**
     * @deprecated Please use the `QueryRef` interface instead of `QueryReference`.
     * 
     * A function that returns a promise that resolves when the query has finished loading. The promise resolves with the `QueryReference` itself.
     * 
     * @remarks
     * 
     * This method is useful for preloading queries in data loading routers, such as [React Router](https://reactrouter.com/en/main) or [TanStack Router](https://tanstack.com/router), to prevent routes from transitioning until the query has finished loading. `data` is not exposed on the promise to discourage using the data in `loader` functions and exposing it to your route components. Instead, we prefer you rely on `useReadQuery` to access the data to ensure your component can rerender with cache updates. If you need to access raw query data, use `client.query()` directly.
     * 
     * @example
     * 
     * Here's an example using React Router's `loader` function:
     * ```ts
     * import { createQueryPreloader } from "@apollo/client";
     * 
     * const preloadQuery = createQueryPreloader(client);
     * 
     * export async function loader() {
     *   const queryRef = preloadQuery(GET_DOGS_QUERY);
     * 
     *   return queryRef.toPromise();
     * }
     * 
     * export function RouteComponent() {
     *   const queryRef = useLoaderData();
     *   const { data } = useReadQuery(queryRef);
     * 
     *   // ...
     * }
     * ```
     * 
     * @since
     * 
     * 3.9.0
     */
    toPromise?: unknown;
}
/**
 * A `QueryReference` is an opaque object returned by `useBackgroundQuery`. A child component reading the `QueryReference` via `useReadQuery` will suspend until the promise resolves.
 */
export interface PreloadedQueryRef<TData = unknown, TVariables = unknown> extends QueryRef<TData, TVariables> {
    /**
     * A function that returns a promise that resolves when the query has finished
     * loading. The promise resolves with the `QueryReference` itself.
     *
     * @remarks
     * This method is useful for preloading queries in data loading routers, such
     * as [React Router](https://reactrouter.com/en/main) or [TanStack Router](https://tanstack.com/router),
     * to prevent routes from transitioning until the query has finished loading.
     * `data` is not exposed on the promise to discourage using the data in
     * `loader` functions and exposing it to your route components. Instead, we
     * prefer you rely on `useReadQuery` to access the data to ensure your
     * component can rerender with cache updates. If you need to access raw query
     * data, use `client.query()` directly.
     *
     * @example
     * Here's an example using React Router's `loader` function:
     * ```ts
     * import { createQueryPreloader } from "@apollo/client";
     *
     * const preloadQuery = createQueryPreloader(client);
     *
     * export async function loader() {
     *   const queryRef = preloadQuery(GET_DOGS_QUERY);
     *
     *   return queryRef.toPromise();
     * }
     *
     * export function RouteComponent() {
     *   const queryRef = useLoaderData();
     *   const { data } = useReadQuery(queryRef);
     *
     *   // ...
     * }
     * ```
     *
     * @since 3.9.0
     */
    toPromise(): Promise<PreloadedQueryRef<TData, TVariables>>;
}
interface InternalQueryReferenceOptions {
    onDispose?: () => void;
    autoDisposeTimeoutMs?: number;
}
export declare function wrapQueryRef<TData, TVariables extends OperationVariables>(internalQueryRef: InternalQueryReference<TData>): WrappedQueryRef<TData, TVariables>;
export declare function assertWrappedQueryRef<TData, TVariables>(queryRef: QueryRef<TData, TVariables>): asserts queryRef is WrappedQueryRef<TData, TVariables>;
export declare function assertWrappedQueryRef<TData, TVariables>(queryRef: QueryRef<TData, TVariables> | undefined | null): asserts queryRef is WrappedQueryRef<TData, TVariables> | undefined | null;
export declare function getWrappedPromise<TData>(queryRef: WrappedQueryRef<TData, any>): QueryRefPromise<TData>;
export declare function unwrapQueryRef<TData>(queryRef: WrappedQueryRef<TData>): InternalQueryReference<TData>;
export declare function unwrapQueryRef<TData>(queryRef: Partial<WrappedQueryRef<TData>>): undefined | InternalQueryReference<TData>;
export declare function updateWrappedQueryRef<TData>(queryRef: WrappedQueryRef<TData>, promise: QueryRefPromise<TData>): void;
declare const OBSERVED_CHANGED_OPTIONS: readonly ["canonizeResults", "context", "errorPolicy", "fetchPolicy", "refetchWritePolicy", "returnPartialData"];
type ObservedOptions = Pick<WatchQueryOptions, (typeof OBSERVED_CHANGED_OPTIONS)[number]>;
export declare class InternalQueryReference<TData = unknown> {
    result: ApolloQueryResult<TData>;
    readonly key: QueryKey;
    readonly observable: ObservableQuery<TData>;
    promise: QueryRefPromise<TData>;
    private subscription;
    private listeners;
    private autoDisposeTimeoutId?;
    private resolve;
    private reject;
    private references;
    private softReferences;
    constructor(observable: ObservableQuery<TData, any>, options: InternalQueryReferenceOptions);
    get disposed(): boolean;
    get watchQueryOptions(): WatchQueryOptions<OperationVariables, TData>;
    reinitialize(): void;
    retain(): () => void;
    softRetain(): () => void;
    didChangeOptions(watchQueryOptions: ObservedOptions): boolean;
    applyOptions(watchQueryOptions: ObservedOptions): QueryRefPromise<TData>;
    listen(listener: Listener<TData>): () => void;
    refetch(variables: OperationVariables | undefined): Promise<ApolloQueryResult<TData>>;
    fetchMore(options: FetchMoreOptions<TData>): Promise<ApolloQueryResult<TData>>;
    private dispose;
    private onDispose;
    private handleNext;
    private handleError;
    private deliver;
    private initiateFetch;
    private subscribeToQuery;
    private setResult;
    private createPendingPromise;
}
export {};
//# sourceMappingURL=QueryReference.d.ts.map