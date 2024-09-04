import { DataProxy } from "./DataProxy.js";
import type { AllFieldsModifier, Modifiers } from "./common.js";
import type { ApolloCache } from "../cache.js";
export declare namespace Cache {
    type WatchCallback<TData = any> = (diff: Cache.DiffResult<TData>, lastDiff?: Cache.DiffResult<TData>) => void;
    interface ReadOptions<TVariables = any, TData = any> extends DataProxy.Query<TVariables, TData> {
        rootId?: string;
        previousResult?: any;
        optimistic: boolean;
        returnPartialData?: boolean;
        /**
         * @deprecated
         * Using `canonizeResults` can result in memory leaks so we generally do not
         * recommend using this option anymore.
         * A future version of Apollo Client will contain a similar feature without
         * the risk of memory leaks.
         */
        canonizeResults?: boolean;
    }
    interface WriteOptions<TResult = any, TVariables = any> extends Omit<DataProxy.Query<TVariables, TResult>, "id">, Omit<DataProxy.WriteOptions<TResult>, "data"> {
        dataId?: string;
        result: TResult;
    }
    interface DiffOptions<TData = any, TVariables = any> extends Omit<ReadOptions<TVariables, TData>, "rootId"> {
    }
    interface WatchOptions<TData = any, TVariables = any> extends DiffOptions<TData, TVariables> {
        watcher?: object;
        immediate?: boolean;
        callback: WatchCallback<TData>;
        lastDiff?: DiffResult<TData>;
    }
    interface EvictOptions {
        id?: string;
        fieldName?: string;
        args?: Record<string, any>;
        broadcast?: boolean;
    }
    interface ResetOptions {
        discardWatches?: boolean;
    }
    interface ModifyOptions<Entity extends Record<string, any> = Record<string, any>> {
        id?: string;
        fields: Modifiers<Entity> | AllFieldsModifier<Entity>;
        optimistic?: boolean;
        broadcast?: boolean;
    }
    interface BatchOptions<TCache extends ApolloCache<any>, TUpdateResult = void> {
        update(cache: TCache): TUpdateResult;
        optimistic?: string | boolean;
        removeOptimistic?: string;
        onWatchUpdated?: (this: TCache, watch: Cache.WatchOptions, diff: Cache.DiffResult<any>, lastDiff?: Cache.DiffResult<any> | undefined) => any;
    }
    export import DiffResult = DataProxy.DiffResult;
    export import ReadQueryOptions = DataProxy.ReadQueryOptions;
    export import ReadFragmentOptions = DataProxy.ReadFragmentOptions;
    export import WriteQueryOptions = DataProxy.WriteQueryOptions;
    export import WriteFragmentOptions = DataProxy.WriteFragmentOptions;
    export import UpdateQueryOptions = DataProxy.UpdateQueryOptions;
    export import UpdateFragmentOptions = DataProxy.UpdateFragmentOptions;
    export import Fragment = DataProxy.Fragment;
}
//# sourceMappingURL=Cache.d.ts.map