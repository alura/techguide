import type { GraphQLConfigResult } from './types.js';
import { GraphQLProjectConfig } from './project-config.js';
import { GraphQLExtensionDeclaration, GraphQLExtensionsRegistry } from './extension.js';
interface LoadConfigOptions {
    filepath?: string;
    rootDir?: string;
    extensions?: GraphQLExtensionDeclaration[];
    throwOnMissing?: boolean;
    throwOnEmpty?: boolean;
    configName?: string;
    legacy?: boolean;
}
export declare function loadConfig(options: LoadConfigOptions): Promise<GraphQLConfig | undefined>;
export declare function loadConfigSync(options: LoadConfigOptions): GraphQLConfig;
export declare class GraphQLConfig {
    private readonly _rawConfig;
    readonly filepath: string;
    readonly dirpath: string;
    readonly projects: Record<string, GraphQLProjectConfig>;
    readonly extensions: GraphQLExtensionsRegistry;
    constructor(raw: GraphQLConfigResult, extensions: GraphQLExtensionDeclaration[]);
    getProject(name?: string): GraphQLProjectConfig | never;
    getProjectForFile(filepath: string): GraphQLProjectConfig | never;
    getDefault(): GraphQLProjectConfig | never;
    isLegacy(): boolean;
}
export {};
//# sourceMappingURL=config.d.ts.map