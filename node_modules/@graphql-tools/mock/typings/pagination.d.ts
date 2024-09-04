import { IFieldResolver } from '@graphql-tools/utils';
import { GraphQLResolveInfo } from 'graphql';
import { IMockStore, Ref } from './types.js';
export type AllNodesFn<TContext, TArgs extends RelayPaginationParams> = (parent: Ref, args: TArgs, context: TContext, info: GraphQLResolveInfo) => Ref[];
export type RelayStylePaginationMockOptions<TContext, TArgs extends RelayPaginationParams> = {
    /**
     * Use this option to apply filtering or sorting on the nodes given the
     * arguments the paginated field receives.
     *
     * ```ts
     * {
     *    User: {
     *      friends: mockedRelayStylePagination<
     *        unknown,
     *        RelayPaginationParams & { sortByBirthdateDesc?: boolean}
     *      >(
     *        store, {
     *          applyOnEdges: (edges, { sortByBirthdateDesc }) => {
     *            if (!sortByBirthdateDesc) return edges
     *            return _.sortBy(edges, (e) => store.get(e, ['node', 'birthdate']))
     *          }
     *       }),
     *    }
     * }
     * ```
     */
    applyOnNodes?: (nodeRefs: Ref[], args: TArgs) => Ref[];
    /**
     * A function that'll be used to get all the nodes used for pagination.
     *
     * By default, it will use the nodes of the field this pagination is attached to.
     *
     * This option is handy when several paginable fields should share
     * the same base nodes:
     * ```ts
     * {
     *    User: {
     *      friends: mockedRelayStylePagination(store),
     *      maleFriends: mockedRelayStylePagination(store, {
     *        allNodesFn: (userRef) =>
     *          store
     *           .get(userRef, ['friends', 'edges'])
     *           .map((e) => store.get(e, 'node'))
     *           .filter((userRef) => store.get(userRef, 'sex') === 'male')
     *      })
     *    }
     * }
     * ```
     */
    allNodesFn?: AllNodesFn<TContext, TArgs>;
    /**
     * The function that'll be used to compute the cursor of a node.
     *
     * By default, it'll use `MockStore` internal reference `Ref`'s `key`
     * as cursor.
     */
    cursorFn?: (nodeRef: Ref) => string;
};
export type RelayPaginationParams = {
    first?: number;
    after?: string;
    last?: number;
    before?: string;
};
export type RelayPageInfo = {
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    startCursor: string;
    endCursor: string;
};
/**
 * Produces a resolver that'll mock a [Relay-style cursor pagination](https://relay.dev/graphql/connections.htm).
 *
 * ```ts
 * const schemaWithMocks = addMocksToSchema({
 *   schema,
 *   resolvers: (store) => ({
 *     User: {
 *       friends: relayStylePaginationMock(store),
 *     }
 *   }),
 * })
 * ```
 * @param store the MockStore
 */
export declare const relayStylePaginationMock: <TContext, TArgs extends RelayPaginationParams = RelayPaginationParams>(store: IMockStore, { cursorFn, applyOnNodes, allNodesFn, }?: RelayStylePaginationMockOptions<TContext, TArgs>) => IFieldResolver<Ref, TContext, TArgs, any>;
