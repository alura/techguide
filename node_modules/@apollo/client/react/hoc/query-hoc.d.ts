import type * as ReactTypes from "react";
import type { DocumentNode } from "graphql";
import type { OperationOption, DataProps } from "./types.js";
/**
 * @deprecated
 * Official support for React Apollo higher order components ended in March 2020.
 * This library is still included in the `@apollo/client` package, but it no longer receives feature updates or bug fixes.
 */
export declare function withQuery<TProps extends TGraphQLVariables | Record<string, any> = Record<string, any>, TData extends object = {}, TGraphQLVariables extends object = {}, TChildProps extends object = DataProps<TData, TGraphQLVariables>>(document: DocumentNode, operationOptions?: OperationOption<TProps, TData, TGraphQLVariables, TChildProps>): (WrappedComponent: ReactTypes.ComponentType<TProps & TChildProps>) => ReactTypes.ComponentClass<TProps>;
//# sourceMappingURL=query-hoc.d.ts.map