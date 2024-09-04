/**
 * @deprecated
 * This is not used internally any more and will be removed in
 * the next major version of Apollo Client.
 */
export declare const createSignalIfSupported: () => {
    controller: boolean;
    signal: boolean;
} | {
    controller: AbortController;
    signal: AbortSignal;
};
//# sourceMappingURL=createSignalIfSupported.d.ts.map