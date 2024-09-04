import type * as ReactTypes from "react";
import type { OperationOption, WithApolloClient } from "./types.js";
/**
 * @deprecated
 * Official support for React Apollo higher order components ended in March 2020.
 * This library is still included in the `@apollo/client` package, but it no longer receives feature updates or bug fixes.
 */
export declare function withApollo<TProps, TResult = any>(WrappedComponent: ReactTypes.ComponentType<WithApolloClient<Omit<TProps, "client">>>, operationOptions?: OperationOption<TProps, TResult>): ReactTypes.ComponentClass<Omit<TProps, "client">>;
//# sourceMappingURL=withApollo.d.ts.map