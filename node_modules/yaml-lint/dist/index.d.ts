declare const schemas: {
    readonly FAILSAFE_SCHEMA: import("js-yaml").Schema;
    readonly JSON_SCHEMA: import("js-yaml").Schema;
    readonly CORE_SCHEMA: import("js-yaml").Schema;
    readonly DEFAULT_SCHEMA: import("js-yaml").Schema;
};
declare type Schema = keyof typeof schemas;
export declare type Options = {
    schema?: Schema;
};
export declare const lint: (content: string, opts?: Options | undefined) => Promise<boolean>;
export declare const lintFile: (file: string, opts?: Options | undefined) => Promise<boolean>;
export {};
