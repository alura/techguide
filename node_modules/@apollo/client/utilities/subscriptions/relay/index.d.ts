import { Observable } from "relay-runtime";
import type { RequestParameters, GraphQLResponse } from "relay-runtime";
import type { OperationVariables } from "../../../core/index.js";
import type { CreateMultipartSubscriptionOptions } from "../shared.js";
export declare function createFetchMultipartSubscription(uri: string, { fetch: preferredFetch, headers }?: CreateMultipartSubscriptionOptions): (operation: RequestParameters, variables: OperationVariables) => Observable<GraphQLResponse>;
//# sourceMappingURL=index.d.ts.map