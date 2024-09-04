import type { DeepPartial } from "../../utilities/index.js";
import type { Cache, Reference, StoreObject, MissingTree } from "../../cache/index.js";
import type { ApolloClient, OperationVariables } from "../../core/index.js";
import type { NoInfer } from "../types/types.js";
export interface UseFragmentOptions<TData, TVars> extends Omit<Cache.DiffOptions<NoInfer<TData>, NoInfer<TVars>>, "id" | "query" | "optimistic" | "previousResult" | "returnPartialData">, Omit<Cache.ReadFragmentOptions<TData, TVars>, "id" | "variables" | "returnPartialData"> {
    from: StoreObject | Reference | string;
    optimistic?: boolean;
    /**
     * The instance of `ApolloClient` to use to look up the fragment.
     *
     * By default, the instance that's passed down via context is used, but you
     * can provide a different instance here.
     *
     * @docGroup 1. Operation options
     */
    client?: ApolloClient<any>;
}
export type UseFragmentResult<TData> = {
    data: TData;
    complete: true;
    missing?: never;
} | {
    data: DeepPartial<TData>;
    complete: false;
    missing?: MissingTree;
};
export declare function useFragment<TData = any, TVars = OperationVariables>(options: UseFragmentOptions<TData, TVars>): UseFragmentResult<TData>;
//# sourceMappingURL=useFragment.d.ts.map