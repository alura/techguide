import type { DocumentNode } from "graphql";
import type * as ReactTypes from "react";
import type { OperationOption, DataProps, MutateProps } from "./types.js";
import type { OperationVariables } from "../../core/index.js";
/**
 * @deprecated
 * Official support for React Apollo higher order components ended in March 2020.
 * This library is still included in the `@apollo/client` package, but it no longer receives feature updates or bug fixes.
 */
export declare function graphql<TProps extends TGraphQLVariables | {} = {}, TData extends object = {}, TGraphQLVariables extends OperationVariables = {}, TChildProps extends object = Partial<DataProps<TData, TGraphQLVariables>> & Partial<MutateProps<TData, TGraphQLVariables>>>(document: DocumentNode, operationOptions?: OperationOption<TProps, TData, TGraphQLVariables, TChildProps>): (WrappedComponent: ReactTypes.ComponentType<TProps & TChildProps>) => ReactTypes.ComponentClass<TProps>;
//# sourceMappingURL=graphql.d.ts.map