import type { DocumentNode } from "graphql";
import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import type { OperationVariables } from "../../core/index.js";
import type { LazyQueryHookOptions, LazyQueryResultTuple, NoInfer } from "../types/types.js";
/**
 * A hook for imperatively executing queries in an Apollo application, e.g. in response to user interaction.
 *
 * > Refer to the [Queries - Manual execution with useLazyQuery](https://www.apollographql.com/docs/react/data/queries#manual-execution-with-uselazyquery) section for a more in-depth overview of `useLazyQuery`.
 *
 * @example
 * ```jsx
 * import { gql, useLazyQuery } from "@apollo/client";
 *
 * const GET_GREETING = gql`
 *   query GetGreeting($language: String!) {
 *     greeting(language: $language) {
 *       message
 *     }
 *   }
 * `;
 *
 * function Hello() {
 *   const [loadGreeting, { called, loading, data }] = useLazyQuery(
 *     GET_GREETING,
 *     { variables: { language: "english" } }
 *   );
 *   if (called && loading) return <p>Loading ...</p>
 *   if (!called) {
 *     return <button onClick={() => loadGreeting()}>Load greeting</button>
 *   }
 *   return <h1>Hello {data.greeting.message}!</h1>;
 * }
 * ```
 * @since 3.0.0
 *
 * @param query - A GraphQL query document parsed into an AST by `gql`.
 * @param options - Default options to control how the query is executed.
 * @returns A tuple in the form of `[execute, result]`
 */
export declare function useLazyQuery<TData = any, TVariables extends OperationVariables = OperationVariables>(query: DocumentNode | TypedDocumentNode<TData, TVariables>, options?: LazyQueryHookOptions<NoInfer<TData>, NoInfer<TVariables>>): LazyQueryResultTuple<TData, TVariables>;
//# sourceMappingURL=useLazyQuery.d.ts.map