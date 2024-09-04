import { GraphQLConfigResult } from '../types.cjs';
export declare function getConfig({ filepath, configName, legacy, }: {
    filepath: string;
    configName: string;
    legacy?: boolean;
}): Promise<GraphQLConfigResult>;
export declare function getConfigSync({ filepath, configName, legacy, }: {
    filepath: string;
    configName: string;
    legacy?: boolean;
}): GraphQLConfigResult;
//# sourceMappingURL=get-config.d.ts.map