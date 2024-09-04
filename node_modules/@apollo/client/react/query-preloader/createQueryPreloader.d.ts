import type { ApolloClient, DefaultContext, DocumentNode, ErrorPolicy, OperationVariables, RefetchWritePolicy, TypedDocumentNode, WatchQueryFetchPolicy } from "../../core/index.js";
import type { DeepPartial, OnlyRequiredProperties } from "../../utilities/index.js";
import type { PreloadedQueryRef } from "../internal/index.js";
import type { NoInfer } from "../index.js";
type VariablesOption<TVariables extends OperationVariables> = [
    TVariables
] extends [never] ? {
    /**
     * An object containing all of the GraphQL variables your query requires to execute.
     * 
     * Each key in the object corresponds to a variable name, and that key's value corresponds to the variable value.
     * 
     * @docGroup
     * 
     * 1. Operation options
     */
    variables?: Record<string, never>;
} : {} extends OnlyRequiredProperties<TVariables> ? {
    /**
     * An object containing all of the GraphQL variables your query requires to execute.
     * 
     * Each key in the object corresponds to a variable name, and that key's value corresponds to the variable value.
     * 
     * @docGroup
     * 
     * 1. Operation options
     */
    variables?: TVariables;
} : {
    /**
     * An object containing all of the GraphQL variables your query requires to execute.
     * 
     * Each key in the object corresponds to a variable name, and that key's value corresponds to the variable value.
     * 
     * @docGroup
     * 
     * 1. Operation options
     */
    variables: TVariables;
};
export type PreloadQueryFetchPolicy = Extract<WatchQueryFetchPolicy, "cache-first" | "network-only" | "no-cache" | "cache-and-network">;
export type PreloadQueryOptions<TVariables extends OperationVariables = OperationVariables> = {
    /**
     * Whether to canonize cache results before returning them. Canonization takes some extra time, but it speeds up future deep equality comparisons. Defaults to false.
     * 
     * @deprecated
     * 
     * Using `canonizeResults` can result in memory leaks so we generally do not recommend using this option anymore. A future version of Apollo Client will contain a similar feature without the risk of memory leaks.
     */
    canonizeResults?: boolean;
    /**
     * If you're using [Apollo Link](https://www.apollographql.com/docs/react/api/link/introduction/), this object is the initial value of the `context` object that's passed along your link chain.
     * 
     * @docGroup
     * 
     * 2. Networking options
     */
    context?: DefaultContext;
    /**
     * Specifies how the query handles a response that returns both GraphQL errors and partial results.
     * 
     * For details, see [GraphQL error policies](https://www.apollographql.com/docs/react/data/error-handling/#graphql-error-policies).
     * 
     * The default value is `none`, meaning that the query result includes error details but not partial results.
     * 
     * @docGroup
     * 
     * 1. Operation options
     */
    errorPolicy?: ErrorPolicy;
    /**
     * Specifies how the query interacts with the Apollo Client cache during execution (for example, whether it checks the cache for results before sending a request to the server).
     * 
     * For details, see [Setting a fetch policy](https://www.apollographql.com/docs/react/data/queries/#setting-a-fetch-policy).
     * 
     * The default value is `cache-first`.
     * 
     * @docGroup
     * 
     * 3. Caching options
     */
    fetchPolicy?: PreloadQueryFetchPolicy;
    /**
     * If `true`, the query can return partial results from the cache if the cache doesn't contain results for all queried fields.
     * 
     * The default value is `false`.
     * 
     * @docGroup
     * 
     * 3. Caching options
     */
    returnPartialData?: boolean;
    /**
     * Specifies whether a `NetworkStatus.refetch` operation should merge incoming field data with existing data, or overwrite the existing data. Overwriting is probably preferable, but merging is currently the default behavior, for backwards compatibility with Apollo Client 3.x.
     * 
     * @docGroup
     * 
     * 3. Caching options
     */
    refetchWritePolicy?: RefetchWritePolicy;
} & VariablesOption<TVariables>;
type PreloadQueryOptionsArg<TVariables extends OperationVariables, TOptions = unknown> = [TVariables] extends [never] ? [
    options?: PreloadQueryOptions<never> & TOptions
] : {} extends OnlyRequiredProperties<TVariables> ? [
    options?: PreloadQueryOptions<NoInfer<TVariables>> & Omit<TOptions, "variables">
] : [
    options: PreloadQueryOptions<NoInfer<TVariables>> & Omit<TOptions, "variables">
];
/**
 * A function that will begin loading a query when called. It's result can be
 * read by `useReadQuery` which will suspend until the query is loaded.
 * This is useful when you want to start loading a query as early as possible
 * outside of a React component.
 *
 * @example
 * ```js
 * const preloadQuery = createQueryPreloader(client);
 * const queryRef = preloadQuery(query, { variables, ...otherOptions });
 *
 * function App() {
 *   return (
 *     <Suspense fallback={<div>Loading</div>}>
 *       <MyQuery />
 *     </Suspense>
 *   );
 * }
 *
 * function MyQuery() {
 *   const { data } = useReadQuery(queryRef);
 *
 *   // do something with `data`
 * }
 * ```
 */
export interface PreloadQueryFunction {
    /**
     * A function that will begin loading a query when called. It's result can be read by `useReadQuery` which will suspend until the query is loaded. This is useful when you want to start loading a query as early as possible outside of a React component.
     * 
     * @example
     * ```js
     * const preloadQuery = createQueryPreloader(client);
     * const queryRef = preloadQuery(query, { variables, ...otherOptions });
     * 
     * function App() {
     *   return (
     *     <Suspense fallback={<div>Loading</div>}>
     *       <MyQuery />
     *     </Suspense>
     *   );
     * }
     * 
     * function MyQuery() {
     *   const { data } = useReadQuery(queryRef);
     * 
     *   // do something with `data`
     * }
     * ```
     */
    <TData, TVariables extends OperationVariables, TOptions extends Omit<PreloadQueryOptions, "variables">>(query: DocumentNode | TypedDocumentNode<TData, TVariables>, ...[options]: PreloadQueryOptionsArg<NoInfer<TVariables>, TOptions>): PreloadedQueryRef<TOptions["errorPolicy"] extends "ignore" | "all" ? TOptions["returnPartialData"] extends true ? DeepPartial<TData> | undefined : TData | undefined : TOptions["returnPartialData"] extends true ? DeepPartial<TData> : TData, TVariables>;
    /**
     * A function that will begin loading a query when called. It's result can be read by `useReadQuery` which will suspend until the query is loaded. This is useful when you want to start loading a query as early as possible outside of a React component.
     * 
     * @example
     * ```js
     * const preloadQuery = createQueryPreloader(client);
     * const queryRef = preloadQuery(query, { variables, ...otherOptions });
     * 
     * function App() {
     *   return (
     *     <Suspense fallback={<div>Loading</div>}>
     *       <MyQuery />
     *     </Suspense>
     *   );
     * }
     * 
     * function MyQuery() {
     *   const { data } = useReadQuery(queryRef);
     * 
     *   // do something with `data`
     * }
     * ```
     */
    <TData = unknown, TVariables extends OperationVariables = OperationVariables>(query: DocumentNode | TypedDocumentNode<TData, TVariables>, options: PreloadQueryOptions<NoInfer<TVariables>> & {
        returnPartialData: true;
        errorPolicy: "ignore" | "all";
    }): PreloadedQueryRef<DeepPartial<TData> | undefined, TVariables>;
    /**
     * A function that will begin loading a query when called. It's result can be read by `useReadQuery` which will suspend until the query is loaded. This is useful when you want to start loading a query as early as possible outside of a React component.
     * 
     * @example
     * ```js
     * const preloadQuery = createQueryPreloader(client);
     * const queryRef = preloadQuery(query, { variables, ...otherOptions });
     * 
     * function App() {
     *   return (
     *     <Suspense fallback={<div>Loading</div>}>
     *       <MyQuery />
     *     </Suspense>
     *   );
     * }
     * 
     * function MyQuery() {
     *   const { data } = useReadQuery(queryRef);
     * 
     *   // do something with `data`
     * }
     * ```
     */
    <TData = unknown, TVariables extends OperationVariables = OperationVariables>(query: DocumentNode | TypedDocumentNode<TData, TVariables>, options: PreloadQueryOptions<NoInfer<TVariables>> & {
        errorPolicy: "ignore" | "all";
    }): PreloadedQueryRef<TData | undefined, TVariables>;
    /**
     * A function that will begin loading a query when called. It's result can be read by `useReadQuery` which will suspend until the query is loaded. This is useful when you want to start loading a query as early as possible outside of a React component.
     * 
     * @example
     * ```js
     * const preloadQuery = createQueryPreloader(client);
     * const queryRef = preloadQuery(query, { variables, ...otherOptions });
     * 
     * function App() {
     *   return (
     *     <Suspense fallback={<div>Loading</div>}>
     *       <MyQuery />
     *     </Suspense>
     *   );
     * }
     * 
     * function MyQuery() {
     *   const { data } = useReadQuery(queryRef);
     * 
     *   // do something with `data`
     * }
     * ```
     */
    <TData = unknown, TVariables extends OperationVariables = OperationVariables>(query: DocumentNode | TypedDocumentNode<TData, TVariables>, options: PreloadQueryOptions<NoInfer<TVariables>> & {
        returnPartialData: true;
    }): PreloadedQueryRef<DeepPartial<TData>, TVariables>;
    /**
     * A function that will begin loading a query when called. It's result can be read by `useReadQuery` which will suspend until the query is loaded. This is useful when you want to start loading a query as early as possible outside of a React component.
     * 
     * @example
     * ```js
     * const preloadQuery = createQueryPreloader(client);
     * const queryRef = preloadQuery(query, { variables, ...otherOptions });
     * 
     * function App() {
     *   return (
     *     <Suspense fallback={<div>Loading</div>}>
     *       <MyQuery />
     *     </Suspense>
     *   );
     * }
     * 
     * function MyQuery() {
     *   const { data } = useReadQuery(queryRef);
     * 
     *   // do something with `data`
     * }
     * ```
     */
    <TData = unknown, TVariables extends OperationVariables = OperationVariables>(query: DocumentNode | TypedDocumentNode<TData, TVariables>, ...[options]: PreloadQueryOptionsArg<NoInfer<TVariables>>): PreloadedQueryRef<TData, TVariables>;
}
/**
 * A higher order function that returns a `preloadQuery` function which
 * can be used to begin loading a query with the given `client`. This is useful
 * when you want to start loading a query as early as possible outside of a
 * React component.
 *
 * > Refer to the [Suspense - Initiating queries outside React](https://www.apollographql.com/docs/react/data/suspense#initiating-queries-outside-react) section for a more in-depth overview.
 *
 * @param client - The `ApolloClient` instance that will be used to load queries
 * from the returned `preloadQuery` function.
 * @returns The `preloadQuery` function.
 *
 * @example
 * ```js
 * const preloadQuery = createQueryPreloader(client);
 * ```
 * @since 3.9.0
 */
export declare function createQueryPreloader(client: ApolloClient<any>): PreloadQueryFunction;
export {};
//# sourceMappingURL=createQueryPreloader.d.ts.map