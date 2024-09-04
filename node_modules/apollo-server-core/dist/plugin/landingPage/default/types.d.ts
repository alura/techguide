export interface ApolloServerPluginLandingPageDefaultBaseOptions {
    version?: string;
    footer?: boolean;
    document?: string;
    variables?: Record<string, any>;
    headers?: Record<string, string>;
    includeCookies?: boolean;
    __internal_apolloStudioEnv__?: 'staging' | 'prod';
}
export interface ApolloServerPluginNonEmbeddedLandingPageLocalDefaultOptions extends ApolloServerPluginLandingPageDefaultBaseOptions {
    embed?: false;
}
export interface ApolloServerPluginNonEmbeddedLandingPageProductionDefaultOptions extends ApolloServerPluginLandingPageDefaultBaseOptions {
    graphRef?: string;
    embed?: false;
}
export interface ApolloServerPluginEmbeddedLandingPageLocalDefaultOptions extends ApolloServerPluginLandingPageDefaultBaseOptions {
    embed: true;
}
export interface ApolloServerPluginEmbeddedLandingPageProductionDefaultOptions extends ApolloServerPluginLandingPageDefaultBaseOptions {
    graphRef: string;
    embed: true | EmbeddableExplorerOptions;
}
declare type EmbeddableExplorerOptions = {
    displayOptions?: {
        showHeadersAndEnvVars: boolean;
        docsPanelState: 'open' | 'closed';
        theme: 'light' | 'dark';
    };
    persistExplorerState: boolean;
};
export declare type ApolloServerPluginLandingPageLocalDefaultOptions = ApolloServerPluginEmbeddedLandingPageLocalDefaultOptions | ApolloServerPluginNonEmbeddedLandingPageLocalDefaultOptions;
export declare type ApolloServerPluginLandingPageProductionDefaultOptions = ApolloServerPluginEmbeddedLandingPageProductionDefaultOptions | ApolloServerPluginNonEmbeddedLandingPageProductionDefaultOptions;
export declare type LandingPageConfig = ApolloServerPluginLandingPageLocalDefaultOptions | ApolloServerPluginLandingPageProductionDefaultOptions;
export {};
//# sourceMappingURL=types.d.ts.map