/**
 * Captures a StackTrace and (if passed) cuts off
 * the first lines including the calling function.
 */
export declare function captureStackTrace(callingFunction?: string | (() => {})): string;
export declare function applyStackTrace(error: Error, stackTrace: string): Error;
//# sourceMappingURL=traces.d.ts.map