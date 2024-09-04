export interface ConfigSearchResult {
    config: any;
    filepath: string;
    isEmpty?: boolean;
}
export declare function isLegacyConfig(filePath: string): boolean;
export declare function createCosmiConfig(moduleName: string, legacy: boolean): {
    readonly search: (searchFrom?: string) => Promise<{
        config: any;
        filepath: string;
        isEmpty?: boolean;
    }>;
    readonly load: (filepath: string) => Promise<{
        config: any;
        filepath: string;
        isEmpty?: boolean;
    }>;
    readonly clearLoadCache: () => void;
    readonly clearSearchCache: () => void;
    readonly clearCaches: () => void;
};
export declare function createCosmiConfigSync(moduleName: string, legacy: boolean): {
    readonly search: (searchFrom?: string) => {
        config: any;
        filepath: string;
        isEmpty?: boolean;
    };
    readonly load: (filepath: string) => {
        config: any;
        filepath: string;
        isEmpty?: boolean;
    };
    readonly clearLoadCache: () => void;
    readonly clearSearchCache: () => void;
    readonly clearCaches: () => void;
};
//# sourceMappingURL=cosmiconfig.d.ts.map