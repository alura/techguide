import * as PropTypes from "prop-types";
import type * as ReactTypes from "react";
import type { OperationVariables } from "../../core/index.js";
import type { MutationComponentOptions } from "./types.js";
/**
 * @deprecated
 * Official support for React Apollo render prop components ended in March 2020.
 * This library is still included in the `@apollo/client` package,
 * but it no longer receives feature updates or bug fixes.
 */
export declare function Mutation<TData = any, TVariables = OperationVariables>(props: MutationComponentOptions<TData, TVariables>): ReactTypes.JSX.Element | null;
export declare namespace Mutation {
    var propTypes: PropTypes.InferProps<MutationComponentOptions<any, any, import("../../core/types.js").DefaultContext, import("../../core/index.js").ApolloCache<any>>>;
}
export interface Mutation<TData, TVariables> {
    propTypes: PropTypes.InferProps<MutationComponentOptions<TData, TVariables>>;
}
//# sourceMappingURL=Mutation.d.ts.map