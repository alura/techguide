import type { DocumentNode } from "graphql";
import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import type { NoInfer, SubscriptionHookOptions, SubscriptionResult } from "../types/types.js";
import type { OperationVariables } from "../../core/index.js";
/**
 * > Refer to the [Subscriptions](https://www.apollographql.com/docs/react/data/subscriptions/) section for a more in-depth overview of `useSubscription`.
 *
 * @example
 * ```jsx
 * const COMMENTS_SUBSCRIPTION = gql`
 *   subscription OnCommentAdded($repoFullName: String!) {
 *     commentAdded(repoFullName: $repoFullName) {
 *       id
 *       content
 *     }
 *   }
 * `;
 *
 * function DontReadTheComments({ repoFullName }) {
 *   const {
 *     data: { commentAdded },
 *     loading,
 *   } = useSubscription(COMMENTS_SUBSCRIPTION, { variables: { repoFullName } });
 *   return <h4>New comment: {!loading && commentAdded.content}</h4>;
 * }
 * ```
 * @remarks
 * #### Subscriptions and React 18 Automatic Batching
 *
 * With React 18's [automatic batching](https://react.dev/blog/2022/03/29/react-v18#new-feature-automatic-batching), multiple state updates may be grouped into a single re-render for better performance.
 *
 * If your subscription API sends multiple messages at the same time or in very fast succession (within fractions of a millisecond), it is likely that only the last message received in that narrow time frame will result in a re-render.
 *
 * Consider the following component:
 *
 * ```jsx
 * export function Subscriptions() {
 *   const { data, error, loading } = useSubscription(query);
 *   const [accumulatedData, setAccumulatedData] = useState([]);
 *
 *   useEffect(() => {
 *     setAccumulatedData((prev) => [...prev, data]);
 *   }, [data]);
 *
 *   return (
 *     <>
 *       {loading && <p>Loading...</p>}
 *       {JSON.stringify(accumulatedData, undefined, 2)}
 *     </>
 *   );
 * }
 * ```
 *
 * If your subscription back-end emits two messages with the same timestamp, only the last message received by Apollo Client will be rendered. This is because React 18 will batch these two state updates into a single re-render.
 *
 * Since the component above is using `useEffect` to push `data` into a piece of local state on each `Subscriptions` re-render, the first message will never be added to the `accumulatedData` array since its render was skipped.
 *
 * Instead of using `useEffect` here, we can re-write this component to use the `onData` callback function accepted in `useSubscription`'s `options` object:
 *
 * ```jsx
 * export function Subscriptions() {
 *   const [accumulatedData, setAccumulatedData] = useState([]);
 *   const { data, error, loading } = useSubscription(
 *     query,
 *     {
 *       onData({ data }) {
 *         setAccumulatedData((prev) => [...prev, data])
 *       }
 *     }
 *   );
 *
 *   return (
 *     <>
 *       {loading && <p>Loading...</p>}
 *       {JSON.stringify(accumulatedData, undefined, 2)}
 *     </>
 *   );
 * }
 * ```
 *
 * > ⚠️ **Note:** The `useSubscription` option `onData` is available in Apollo Client >= 3.7. In previous versions, the equivalent option is named `onSubscriptionData`.
 *
 * Now, the first message will be added to the `accumulatedData` array since `onData` is called _before_ the component re-renders. React 18 automatic batching is still in effect and results in a single re-render, but with `onData` we can guarantee each message received after the component mounts is added to `accumulatedData`.
 *
 * @since 3.0.0
 * @param subscription - A GraphQL subscription document parsed into an AST by `gql`.
 * @param options - Options to control how the subscription is executed.
 * @returns Query result object
 */
export declare function useSubscription<TData = any, TVariables extends OperationVariables = OperationVariables>(subscription: DocumentNode | TypedDocumentNode<TData, TVariables>, options?: SubscriptionHookOptions<NoInfer<TData>, NoInfer<TVariables>>): SubscriptionResult<TData, TVariables>;
//# sourceMappingURL=useSubscription.d.ts.map