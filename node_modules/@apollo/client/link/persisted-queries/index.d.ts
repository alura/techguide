import type { DocumentNode, ExecutionResult, GraphQLError } from "graphql";
import type { Operation } from "../core/index.js";
import { ApolloLink } from "../core/index.js";
import type { NetworkError } from "../../errors/index.js";
export declare const VERSION = 1;
export interface ErrorResponse {
    graphQLErrors?: readonly GraphQLError[];
    networkError?: NetworkError;
    response?: ExecutionResult;
    operation: Operation;
    meta: ErrorMeta;
}
type ErrorMeta = {
    persistedQueryNotSupported: boolean;
    persistedQueryNotFound: boolean;
};
type SHA256Function = (...args: any[]) => string | PromiseLike<string>;
type GenerateHashFunction = (document: DocumentNode) => string | PromiseLike<string>;
interface BaseOptions {
    disable?: (error: ErrorResponse) => boolean;
    retry?: (error: ErrorResponse) => boolean;
    useGETForHashedQueries?: boolean;
}
export declare namespace PersistedQueryLink {
    interface SHA256Options extends BaseOptions {
        sha256: SHA256Function;
        generateHash?: never;
    }
    interface GenerateHashOptions extends BaseOptions {
        sha256?: never;
        generateHash: GenerateHashFunction;
    }
    export type Options = SHA256Options | GenerateHashOptions;
    export {};
}
export declare const createPersistedQueryLink: (options: PersistedQueryLink.Options) => ApolloLink & {
    resetHashCache: () => void;
} & ({
    getMemoryInternals(): {
        PersistedQueryLink: {
            persistedQueryHashes: number;
        };
    };
} | {
    getMemoryInternals?: undefined;
});
export {};
//# sourceMappingURL=index.d.ts.map