import type { Operation, FetchResult, NextLink } from "../core/index.js";
import { ApolloLink } from "../core/index.js";
import { Observable } from "../../utilities/index.js";
import type { DelayFunction, DelayFunctionOptions } from "./delayFunction.js";
import type { RetryFunction, RetryFunctionOptions } from "./retryFunction.js";
export declare namespace RetryLink {
    interface Options {
        /**
         * Configuration for the delay strategy to use, or a custom delay strategy.
         */
        delay?: DelayFunctionOptions | DelayFunction;
        /**
         * Configuration for the retry strategy to use, or a custom retry strategy.
         */
        attempts?: RetryFunctionOptions | RetryFunction;
    }
}
export declare class RetryLink extends ApolloLink {
    private delayFor;
    private retryIf;
    constructor(options?: RetryLink.Options);
    request(operation: Operation, nextLink: NextLink): Observable<FetchResult>;
}
//# sourceMappingURL=retryLink.d.ts.map