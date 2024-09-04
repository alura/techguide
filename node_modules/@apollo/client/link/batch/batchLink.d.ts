import type { Operation, FetchResult, NextLink } from "../core/index.js";
import { ApolloLink } from "../core/index.js";
import type { Observable } from "../../utilities/index.js";
import type { BatchHandler } from "./batching.js";
export type { BatchableRequest, BatchHandler } from "./batching.js";
export { OperationBatcher } from "./batching.js";
export declare namespace BatchLink {
    interface Options {
        /**
         * The interval at which to batch, in milliseconds.
         *
         * Defaults to 10.
         */
        batchInterval?: number;
        /**
         * "batchInterval" is a throttling behavior by default, if you instead wish
         * to debounce outbound requests, set "batchDebounce" to true. More useful
         * for mutations than queries.
         */
        batchDebounce?: boolean;
        /**
         * The maximum number of operations to include in one fetch.
         *
         * Defaults to 0 (infinite operations within the interval).
         */
        batchMax?: number;
        /**
         * The handler that should execute a batch of operations.
         */
        batchHandler?: BatchHandler;
        /**
         * creates the key for a batch
         */
        batchKey?: (operation: Operation) => string;
    }
}
export declare class BatchLink extends ApolloLink {
    private batcher;
    constructor(fetchParams?: BatchLink.Options);
    request(operation: Operation, forward?: NextLink): Observable<FetchResult> | null;
}
//# sourceMappingURL=batchLink.d.ts.map