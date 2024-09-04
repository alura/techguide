import type { DocumentNode, GraphQLError } from "graphql";
import type { Cache } from "../cache/index.js";
import type { WatchQueryOptions, ErrorPolicy } from "./watchQueryOptions.js";
import type { ObservableQuery } from "./ObservableQuery.js";
import type { QueryListener } from "./types.js";
import type { FetchResult } from "../link/core/index.js";
import { NetworkStatus } from "./networkStatus.js";
import type { ApolloError } from "../errors/index.js";
import type { QueryManager } from "./QueryManager.js";
export type QueryStoreValue = Pick<QueryInfo, "variables" | "networkStatus" | "networkError" | "graphQLErrors">;
export declare const enum CacheWriteBehavior {
    FORBID = 0,
    OVERWRITE = 1,
    MERGE = 2
}
export declare class QueryInfo {
    readonly queryId: string;
    listeners: Set<QueryListener>;
    document: DocumentNode | null;
    lastRequestId: number;
    variables?: Record<string, any>;
    networkStatus?: NetworkStatus;
    networkError?: Error | null;
    graphQLErrors?: ReadonlyArray<GraphQLError>;
    stopped: boolean;
    private cache;
    constructor(queryManager: QueryManager<any>, queryId?: string);
    init(query: {
        document: DocumentNode;
        variables: Record<string, any> | undefined;
        networkStatus?: NetworkStatus;
        observableQuery?: ObservableQuery<any, any>;
        lastRequestId?: number;
    }): this;
    private dirty;
    private notifyTimeout?;
    reset(): void;
    resetDiff(): void;
    getDiff(): Cache.DiffResult<any>;
    private lastDiff?;
    private updateLastDiff;
    private getDiffOptions;
    setDiff(diff: Cache.DiffResult<any> | null): void;
    readonly observableQuery: ObservableQuery<any, any> | null;
    private oqListener?;
    setObservableQuery(oq: ObservableQuery<any, any> | null): void;
    notify(): void;
    private shouldNotify;
    stop(): void;
    private cancel;
    private lastWatch?;
    private updateWatch;
    private lastWrite?;
    resetLastWrite(): void;
    private shouldWrite;
    markResult<T>(result: FetchResult<T>, document: DocumentNode, options: Pick<WatchQueryOptions, "variables" | "fetchPolicy" | "errorPolicy">, cacheWriteBehavior: CacheWriteBehavior): void;
    markReady(): NetworkStatus;
    markError(error: ApolloError): ApolloError;
}
export declare function shouldWriteResult<T>(result: FetchResult<T>, errorPolicy?: ErrorPolicy): boolean;
//# sourceMappingURL=QueryInfo.d.ts.map