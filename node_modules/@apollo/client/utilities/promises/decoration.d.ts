export interface PendingPromise<TValue> extends Promise<TValue> {
    status: "pending";
}
export interface FulfilledPromise<TValue> extends Promise<TValue> {
    status: "fulfilled";
    value: TValue;
}
export interface RejectedPromise<TValue> extends Promise<TValue> {
    status: "rejected";
    reason: unknown;
}
export type PromiseWithState<TValue> = PendingPromise<TValue> | FulfilledPromise<TValue> | RejectedPromise<TValue>;
export declare function createFulfilledPromise<TValue>(value: TValue): FulfilledPromise<TValue>;
export declare function createRejectedPromise<TValue = unknown>(reason: unknown): RejectedPromise<TValue>;
export declare function isStatefulPromise<TValue>(promise: Promise<TValue>): promise is PromiseWithState<TValue>;
export declare function wrapPromiseWithState<TValue>(promise: Promise<TValue>): PromiseWithState<TValue>;
//# sourceMappingURL=decoration.d.ts.map