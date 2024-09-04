import type { ImplicitlyInstallablePlugin } from '../../../ApolloServer';
import type { ApolloServerPluginEmbeddedLandingPageProductionDefaultOptions, ApolloServerPluginLandingPageLocalDefaultOptions, ApolloServerPluginLandingPageProductionDefaultOptions, LandingPageConfig } from './types';
export declare function ApolloServerPluginLandingPageLocalDefault(options?: ApolloServerPluginLandingPageLocalDefaultOptions): ImplicitlyInstallablePlugin;
export declare function ApolloServerPluginLandingPageProductionDefault(options?: ApolloServerPluginLandingPageProductionDefaultOptions): ImplicitlyInstallablePlugin;
export declare const getEmbeddedExplorerHTML: (version: string, config: ApolloServerPluginEmbeddedLandingPageProductionDefaultOptions) => string;
export declare const getEmbeddedSandboxHTML: (version: string, config: LandingPageConfig) => string;
//# sourceMappingURL=index.d.ts.map