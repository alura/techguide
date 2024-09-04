import type { ApolloServerPluginUsageReportingOptions } from '../usageReporting/options';
import type { InternalApolloServerPlugin } from '../../internalPlugin';
export interface ApolloServerPluginInlineTraceOptions {
    rewriteError?: ApolloServerPluginUsageReportingOptions<never>['rewriteError'];
    __onlyIfSchemaIsFederated?: boolean;
}
export declare function ApolloServerPluginInlineTrace(options?: ApolloServerPluginInlineTraceOptions): InternalApolloServerPlugin;
export declare function ApolloServerPluginInlineTraceDisabled(): InternalApolloServerPlugin;
//# sourceMappingURL=index.d.ts.map