import type { KeyValueCache } from '@apollo/utils.keyvaluecache';
export interface DataSourceConfig<TContext> {
    context: TContext;
    cache: KeyValueCache;
}
export declare abstract class DataSource<TContext = any> {
    initialize?(config: DataSourceConfig<TContext>): void | Promise<void>;
}
//# sourceMappingURL=index.d.ts.map