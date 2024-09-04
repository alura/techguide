export declare const itAsync: ((this: unknown, message: string, callback: (resolve: (result?: any) => void, reject: (reason?: any) => void) => any, timeout?: number | undefined) => void) & {
    only: (message: string, callback: (resolve: (result?: any) => void, reject: (reason?: any) => void) => any, timeout?: number) => void;
    skip: (message: string, callback: (resolve: (result?: any) => void, reject: (reason?: any) => void) => any, timeout?: number) => void;
    todo: (message: string, callback: (resolve: (result?: any) => void, reject: (reason?: any) => void) => any, timeout?: number) => void;
};
//# sourceMappingURL=itAsync.d.ts.map