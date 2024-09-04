import type { ExecutionPatchIncrementalResult, ExecutionPatchInitialResult, ExecutionPatchResult, ApolloPayloadResult, FetchResult } from "../../link/core/index.js";
export declare function isExecutionPatchIncrementalResult<T>(value: FetchResult<T>): value is ExecutionPatchIncrementalResult;
export declare function isExecutionPatchInitialResult<T>(value: FetchResult<T>): value is ExecutionPatchInitialResult<T>;
export declare function isExecutionPatchResult<T>(value: FetchResult<T>): value is ExecutionPatchResult<T>;
export declare function isApolloPayloadResult(value: unknown): value is ApolloPayloadResult;
export declare function mergeIncrementalData<TData extends object>(prevResult: TData, result: ExecutionPatchResult<TData>): TData;
//# sourceMappingURL=incrementalResult.d.ts.map