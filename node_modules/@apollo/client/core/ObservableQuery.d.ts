import { NetworkStatus } from "./networkStatus.js";
import type { Concast, Observer, ObservableSubscription } from "../utilities/index.js";
import { Observable } from "../utilities/index.js";
import type { ApolloError } from "../errors/index.js";
import type { QueryManager } from "./QueryManager.js";
import type { ApolloQueryResult, OperationVariables, TypedDocumentNode } from "./types.js";
import type { WatchQueryOptions, FetchMoreQueryOptions, SubscribeToMoreOptions } from "./watchQueryOptions.js";
import type { QueryInfo } from "./QueryInfo.js";
import type { MissingFieldError } from "../cache/index.js";
import type { MissingTree } from "../cache/core/types/common.js";
export interface FetchMoreOptions<TData = any, TVariables = OperationVariables> {
    updateQuery?: (previousQueryResult: TData, options: {
        fetchMoreResult?: TData;
        variables?: TVariables;
    }) => TData;
}
export interface UpdateQueryOptions<TVariables> {
    variables?: TVariables;
}
export declare class ObservableQuery<TData = any, TVariables extends OperationVariables = OperationVariables> extends Observable<ApolloQueryResult<TData>> {
    readonly options: WatchQueryOptions<TVariables, TData>;
    readonly queryId: string;
    readonly queryName?: string;
    get query(): TypedDocumentNode<TData, TVariables>;
    /**
     * An object containing the variables that were provided for the query.
     */
    get variables(): TVariables | undefined;
    private isTornDown;
    private queryManager;
    private observers;
    private subscriptions;
    private waitForOwnResult;
    private last?;
    private lastQuery?;
    private queryInfo;
    private concast?;
    private observer?;
    private pollingInfo?;
    constructor({ queryManager, queryInfo, options, }: {
        queryManager: QueryManager<any>;
        queryInfo: QueryInfo;
        options: WatchQueryOptions<TVariables, TData>;
    });
    result(): Promise<ApolloQueryResult<TData>>;
    /** @internal */
    resetDiff(): void;
    getCurrentResult(saveAsLastResult?: boolean): ApolloQueryResult<TData>;
    isDifferentFromLastResult(newResult: ApolloQueryResult<TData>, variables?: TVariables): boolean | undefined;
    private getLast;
    getLastResult(variablesMustMatch?: boolean): ApolloQueryResult<TData> | undefined;
    getLastError(variablesMustMatch?: boolean): ApolloError | undefined;
    resetLastResults(): void;
    resetQueryStoreErrors(): void;
    /**
     * Update the variables of this observable query, and fetch the new results.
     * This method should be preferred over `setVariables` in most use cases.
     *
     * @param variables - The new set of variables. If there are missing variables,
     * the previous values of those variables will be used.
     */
    refetch(variables?: Partial<TVariables>): Promise<ApolloQueryResult<TData>>;
    /**
     * A function that helps you fetch the next set of results for a [paginated list field](https://www.apollographql.com/docs/react/pagination/core-api/).
     */
    fetchMore<TFetchData = TData, TFetchVars extends OperationVariables = TVariables>(fetchMoreOptions: FetchMoreQueryOptions<TFetchVars, TFetchData> & {
        updateQuery?: (previousQueryResult: TData, options: {
            fetchMoreResult: TFetchData;
            variables: TFetchVars;
        }) => TData;
    }): Promise<ApolloQueryResult<TFetchData>>;
    /**
     * A function that enables you to execute a [subscription](https://www.apollographql.com/docs/react/data/subscriptions/), usually to subscribe to specific fields that were included in the query.
     *
     * This function returns _another_ function that you can call to terminate the subscription.
     */
    subscribeToMore<TSubscriptionData = TData, TSubscriptionVariables extends OperationVariables = TVariables>(options: SubscribeToMoreOptions<TData, TSubscriptionVariables, TSubscriptionData>): () => void;
    setOptions(newOptions: Partial<WatchQueryOptions<TVariables, TData>>): Promise<ApolloQueryResult<TData>>;
    silentSetOptions(newOptions: Partial<WatchQueryOptions<TVariables, TData>>): void;
    /**
     * Update the variables of this observable query, and fetch the new results
     * if they've changed. Most users should prefer `refetch` instead of
     * `setVariables` in order to to be properly notified of results even when
     * they come from the cache.
     *
     * Note: the `next` callback will *not* fire if the variables have not changed
     * or if the result is coming from cache.
     *
     * Note: the promise will return the old results immediately if the variables
     * have not changed.
     *
     * Note: the promise will return null immediately if the query is not active
     * (there are no subscribers).
     *
     * @param variables - The new set of variables. If there are missing variables,
     * the previous values of those variables will be used.
     */
    setVariables(variables: TVariables): Promise<ApolloQueryResult<TData> | void>;
    /**
     * A function that enables you to update the query's cached result without executing a followup GraphQL operation.
     *
     * See [using updateQuery and updateFragment](https://www.apollographql.com/docs/react/caching/cache-interaction/#using-updatequery-and-updatefragment) for additional information.
     */
    updateQuery<TVars extends OperationVariables = TVariables>(mapFn: (previousQueryResult: TData, options: Pick<WatchQueryOptions<TVars, TData>, "variables">) => TData): void;
    /**
     * A function that instructs the query to begin re-executing at a specified interval (in milliseconds).
     */
    startPolling(pollInterval: number): void;
    /**
     * A function that instructs the query to stop polling after a previous call to `startPolling`.
     */
    stopPolling(): void;
    private applyNextFetchPolicy;
    private fetch;
    private updatePolling;
    private updateLastResult;
    reobserveAsConcast(newOptions?: Partial<WatchQueryOptions<TVariables, TData>>, newNetworkStatus?: NetworkStatus): Concast<ApolloQueryResult<TData>>;
    reobserve(newOptions?: Partial<WatchQueryOptions<TVariables, TData>>, newNetworkStatus?: NetworkStatus): Promise<ApolloQueryResult<TData>>;
    resubscribeAfterError(onNext: (value: ApolloQueryResult<TData>) => void, onError?: (error: any) => void, onComplete?: () => void): ObservableSubscription;
    resubscribeAfterError(observer: Observer<ApolloQueryResult<TData>>): ObservableSubscription;
    private observe;
    private reportResult;
    private reportError;
    hasObservers(): boolean;
    private tearDownQuery;
    private transformDocument;
}
export declare function reobserveCacheFirst<TData, TVars extends OperationVariables>(obsQuery: ObservableQuery<TData, TVars>): Promise<ApolloQueryResult<TData>>;
export declare function logMissingFieldErrors(missing: MissingFieldError[] | MissingTree | undefined): void;
//# sourceMappingURL=ObservableQuery.d.ts.map