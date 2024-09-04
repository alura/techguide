import { GraphQLConfigResult } from '../types.js';
type FindConfigOptions = {
    rootDir: string;
    configName: string;
    legacy?: boolean;
};
export declare function findConfig({ rootDir, legacy, configName, }: FindConfigOptions): Promise<GraphQLConfigResult>;
export declare function findConfigSync({ rootDir, legacy, configName }: FindConfigOptions): GraphQLConfigResult;
export {};
//# sourceMappingURL=find-config.d.ts.map