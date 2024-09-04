import type { ExecutionResult } from "graphql";
import type { NetworkError, GraphQLErrors } from "../../errors/index.js";
import { Observable } from "../../utilities/index.js";
import type { Operation, FetchResult, NextLink } from "../core/index.js";
import { ApolloLink } from "../core/index.js";
export interface ErrorResponse {
    graphQLErrors?: GraphQLErrors;
    networkError?: NetworkError;
    response?: ExecutionResult;
    operation: Operation;
    forward: NextLink;
}
export declare namespace ErrorLink {
    /**
     * Callback to be triggered when an error occurs within the link stack.
     */
    interface ErrorHandler {
        (error: ErrorResponse): Observable<FetchResult> | void;
    }
}
export import ErrorHandler = ErrorLink.ErrorHandler;
export declare function onError(errorHandler: ErrorHandler): ApolloLink;
export declare class ErrorLink extends ApolloLink {
    private link;
    constructor(errorHandler: ErrorLink.ErrorHandler);
    request(operation: Operation, forward: NextLink): Observable<FetchResult> | null;
}
//# sourceMappingURL=index.d.ts.map