import type { QueryOptions, WatchQueryOptions, MutationOptions, OperationVariables } from "../../core/index.js";
type OptionsUnion<TData, TVariables extends OperationVariables, TContext> = WatchQueryOptions<TVariables, TData> | QueryOptions<TVariables, TData> | MutationOptions<TData, TVariables, TContext, any>;
export declare function mergeOptions<TDefaultOptions extends Partial<OptionsUnion<any, any, any>>, TOptions extends TDefaultOptions>(defaults: TDefaultOptions | Partial<TDefaultOptions> | undefined, options: TOptions | Partial<TOptions>): TOptions & TDefaultOptions;
export {};
//# sourceMappingURL=mergeOptions.d.ts.map