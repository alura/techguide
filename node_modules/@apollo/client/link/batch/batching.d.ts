import type { FetchResult, NextLink, Operation } from "../core/index.js";
import { Observable } from "../../utilities/index.js";
export type BatchHandler = (operations: Operation[], forward?: (NextLink | undefined)[]) => Observable<FetchResult[]> | null;
export interface BatchableRequest {
    operation: Operation;
    forward?: NextLink;
}
export declare class OperationBatcher {
    private batchesByKey;
    private scheduledBatchTimerByKey;
    private batchDebounce?;
    private batchInterval?;
    private batchMax;
    private batchHandler;
    private batchKey;
    constructor({ batchDebounce, batchInterval, batchMax, batchHandler, batchKey, }: {
        batchDebounce?: boolean;
        batchInterval?: number;
        batchMax?: number;
        batchHandler: BatchHandler;
        batchKey?: (operation: Operation) => string;
    });
    enqueueRequest(request: BatchableRequest): Observable<FetchResult>;
    consumeQueue(key?: string): (Observable<FetchResult> | undefined)[] | undefined;
    private scheduleQueueConsumption;
}
//# sourceMappingURL=batching.d.ts.map