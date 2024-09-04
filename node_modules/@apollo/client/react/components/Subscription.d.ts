import * as PropTypes from "prop-types";
import type * as ReactTypes from "react";
import type { OperationVariables } from "../../core/index.js";
import type { SubscriptionComponentOptions } from "./types.js";
/**
 * @deprecated
 * Official support for React Apollo render prop components ended in March 2020.
 * This library is still included in the `@apollo/client` package,
 * but it no longer receives feature updates or bug fixes.
 */
export declare function Subscription<TData = any, TVariables extends OperationVariables = OperationVariables>(props: SubscriptionComponentOptions<TData, TVariables>): ReactTypes.JSX.Element | null;
export declare namespace Subscription {
    var propTypes: PropTypes.InferProps<SubscriptionComponentOptions<any, any>>;
}
export interface Subscription<TData, TVariables extends OperationVariables> {
    propTypes: PropTypes.InferProps<SubscriptionComponentOptions<TData, TVariables>>;
}
//# sourceMappingURL=Subscription.d.ts.map