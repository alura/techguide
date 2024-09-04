import { Observable } from "../../index.js";
import type { CreateMultipartSubscriptionOptions } from "../shared.js";
export declare function createFetchMultipartSubscription(uri: string, { fetch: preferredFetch, headers }?: CreateMultipartSubscriptionOptions): ({ query, variables, }: {
    query?: string;
    variables: undefined | Record<string, any>;
}) => Observable<unknown>;
//# sourceMappingURL=index.d.ts.map