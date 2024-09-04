import type * as ReactTypes from "react";
import type { ApolloClient } from "../../core/index.js";
import type { RenderPromises } from "../ssr/index.js";
export interface ApolloContextValue {
    client?: ApolloClient<object>;
    renderPromises?: RenderPromises;
}
export declare function getApolloContext(): ReactTypes.Context<ApolloContextValue>;
/**
 * @deprecated This function has no "resetting" effect since Apollo Client 3.4.12,
 * and will be removed in the next major version of Apollo Client.
 * If you want to get the Apollo Context, use `getApolloContext` instead.
 */
export declare const resetApolloContext: typeof getApolloContext;
//# sourceMappingURL=ApolloContext.d.ts.map