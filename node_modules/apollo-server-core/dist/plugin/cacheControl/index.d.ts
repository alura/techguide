import type { CacheHint } from 'apollo-server-types';
import type { InternalApolloServerPlugin } from '../../internalPlugin';
export interface ApolloServerPluginCacheControlOptions {
    defaultMaxAge?: number;
    calculateHttpHeaders?: boolean;
    __testing__cacheHints?: Map<string, CacheHint>;
}
export declare function ApolloServerPluginCacheControl(options?: ApolloServerPluginCacheControlOptions): InternalApolloServerPlugin;
export declare function ApolloServerPluginCacheControlDisabled(): InternalApolloServerPlugin;
//# sourceMappingURL=index.d.ts.map