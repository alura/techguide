import type { DocumentNode } from "graphql";
import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import type { MutationHookOptions, MutationTuple, NoInfer } from "../types/types.js";
import type { ApolloCache, DefaultContext, OperationVariables } from "../../core/index.js";
/**
 *
 *
 * > Refer to the [Mutations](https://www.apollographql.com/docs/react/data/mutations/) section for a more in-depth overview of `useMutation`.
 *
 * @example
 * ```jsx
 * import { gql, useMutation } from '@apollo/client';
 *
 * const ADD_TODO = gql`
 *   mutation AddTodo($type: String!) {
 *     addTodo(type: $type) {
 *       id
 *       type
 *     }
 *   }
 * `;
 *
 * function AddTodo() {
 *   let input;
 *   const [addTodo, { data }] = useMutation(ADD_TODO);
 *
 *   return (
 *     <div>
 *       <form
 *         onSubmit={e => {
 *           e.preventDefault();
 *           addTodo({ variables: { type: input.value } });
 *           input.value = '';
 *         }}
 *       >
 *         <input
 *           ref={node => {
 *             input = node;
 *           }}
 *         />
 *         <button type="submit">Add Todo</button>
 *       </form>
 *     </div>
 *   );
 * }
 * ```
 * @since 3.0.0
 * @param mutation - A GraphQL mutation document parsed into an AST by `gql`.
 * @param options - Options to control how the mutation is executed.
 * @returns A tuple in the form of `[mutate, result]`
 */
export declare function useMutation<TData = any, TVariables = OperationVariables, TContext = DefaultContext, TCache extends ApolloCache<any> = ApolloCache<any>>(mutation: DocumentNode | TypedDocumentNode<TData, TVariables>, options?: MutationHookOptions<NoInfer<TData>, NoInfer<TVariables>, TContext, TCache>): MutationTuple<TData, TVariables, TContext, TCache>;
//# sourceMappingURL=useMutation.d.ts.map