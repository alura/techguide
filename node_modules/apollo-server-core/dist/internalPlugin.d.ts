import type { BaseContext } from 'apollo-server-types';
import type { ApolloServerPlugin } from 'apollo-server-plugin-base';
export interface InternalApolloServerPlugin<TContext extends BaseContext = BaseContext> extends ApolloServerPlugin<TContext> {
    __internal_plugin_id__(): InternalPluginId;
}
export declare type InternalPluginId = 'CacheControl' | 'LandingPageDisabled' | 'SchemaReporting' | 'InlineTrace' | 'UsageReporting';
export declare function pluginIsInternal(plugin: ApolloServerPlugin): plugin is InternalApolloServerPlugin;
//# sourceMappingURL=internalPlugin.d.ts.map