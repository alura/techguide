export interface ErrorCodes {
    [key: number]: {
        file: string;
        condition?: string;
        message?: string;
    };
}
export declare const errorCodes: ErrorCodes;
export declare const devDebug: ErrorCodes;
export declare const devLog: ErrorCodes;
export declare const devWarn: ErrorCodes;
export declare const devError: ErrorCodes;
//# sourceMappingURL=invariantErrorCodes.d.ts.map