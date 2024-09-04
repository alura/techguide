import type * as ReactTypes from "react";
import type { DocumentNode } from "graphql";
import type { DefaultContext, OperationVariables } from "../../core/types.js";
import type { OperationOption, MutateProps } from "./types.js";
import type { ApolloCache } from "../../core/index.js";
/**
 * @deprecated
 * Official support for React Apollo higher order components ended in March 2020.
 * This library is still included in the `@apollo/client` package, but it no longer receives feature updates or bug fixes.
 */
export declare function withMutation<TProps extends TGraphQLVariables | {} = {}, TData extends Record<string, any> = {}, TGraphQLVariables extends OperationVariables = {}, TChildProps = MutateProps<TData, TGraphQLVariables>, TContext extends Record<string, any> = DefaultContext, TCache extends ApolloCache<any> = ApolloCache<any>>(document: DocumentNode, operationOptions?: OperationOption<TProps, TData, TGraphQLVariables, TChildProps>): (WrappedComponent: ReactTypes.ComponentType<TProps & TChildProps>) => ReactTypes.ComponentClass<TProps>;
//# sourceMappingURL=mutation-hoc.d.ts.map