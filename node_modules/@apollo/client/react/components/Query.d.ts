import * as PropTypes from "prop-types";
import type * as ReactTypes from "react";
import type { OperationVariables } from "../../core/index.js";
import type { QueryComponentOptions } from "./types.js";
/**
 * @deprecated
 * Official support for React Apollo render prop components ended in March 2020.
 * This library is still included in the `@apollo/client` package,
 * but it no longer receives feature updates or bug fixes.
 */
export declare function Query<TData = any, TVariables extends OperationVariables = OperationVariables>(props: QueryComponentOptions<TData, TVariables>): ReactTypes.JSX.Element | null;
export declare namespace Query {
    var propTypes: PropTypes.InferProps<QueryComponentOptions<any, any>>;
}
export interface Query<TData, TVariables extends OperationVariables> {
    propTypes: PropTypes.InferProps<QueryComponentOptions<TData, TVariables>>;
}
//# sourceMappingURL=Query.d.ts.map