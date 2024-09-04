import type { QueryRef } from "../internal/index.js";
import type { OperationVariables } from "../../core/types.js";
import type { RefetchFunction, FetchMoreFunction } from "./useSuspenseQuery.js";
export interface UseQueryRefHandlersResult<TData = unknown, TVariables extends OperationVariables = OperationVariables> {
    /**
     * Update the variables of this observable query, and fetch the new results. This method should be preferred over `setVariables` in most use cases.
     * 
     * @param variables - The new set of variables. If there are missing variables, the previous values of those variables will be used.
     */
    refetch: RefetchFunction<TData, TVariables>;
    /**
     * A function that helps you fetch the next set of results for a [paginated list field](https://www.apollographql.com/docs/react/pagination/core-api/).
     */
    fetchMore: FetchMoreFunction<TData, TVariables>;
}
/**
 * A React hook that returns a `refetch` and `fetchMore` function for a given
 * `queryRef`.
 *
 * This is useful to get access to handlers for a `queryRef` that was created by
 * `createQueryPreloader` or when the handlers for a `queryRef` produced in
 * a different component are inaccessible.
 *
 * @example
 * ```tsx
 * const MyComponent({ queryRef }) {
 *   const { refetch, fetchMore } = useQueryRefHandlers(queryRef);
 *
 *   // ...
 * }
 * ```
 * @since 3.9.0
 * @param queryRef - A `QueryRef` returned from `useBackgroundQuery`, `useLoadableQuery`, or `createQueryPreloader`.
 */
export declare function useQueryRefHandlers<TData = unknown, TVariables extends OperationVariables = OperationVariables>(queryRef: QueryRef<TData, TVariables>): UseQueryRefHandlersResult<TData, TVariables>;
//# sourceMappingURL=useQueryRefHandlers.d.ts.map