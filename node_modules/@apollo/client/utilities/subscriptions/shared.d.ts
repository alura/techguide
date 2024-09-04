export type CreateMultipartSubscriptionOptions = {
    fetch?: WindowOrWorkerGlobalScope["fetch"];
    headers?: Record<string, string>;
};
export declare function generateOptionsForMultipartSubscription(headers: Record<string, string>): {
    headers: Record<string, any>;
    body?: string;
};
//# sourceMappingURL=shared.d.ts.map