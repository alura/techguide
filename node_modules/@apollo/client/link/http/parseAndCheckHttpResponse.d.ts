import type { Operation } from "../core/index.js";
import type { SubscriptionObserver } from "zen-observable-ts";
export type ServerParseError = Error & {
    response: Response;
    statusCode: number;
    bodyText: string;
};
export declare function readMultipartBody<T extends object = Record<string, unknown>>(response: Response, nextValue: (value: T) => void): Promise<void>;
export declare function parseHeaders(headerText: string): Record<string, string>;
export declare function parseJsonBody<T>(response: Response, bodyText: string): T;
export declare function handleError(err: any, observer: SubscriptionObserver<any>): void;
export declare function parseAndCheckHttpResponse(operations: Operation | Operation[]): (response: Response) => Promise<any>;
//# sourceMappingURL=parseAndCheckHttpResponse.d.ts.map