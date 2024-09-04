import "../utilities/globals/index.js";
import type { GraphQLError, GraphQLErrorExtensions } from "graphql";
import type { ServerParseError } from "../link/http/index.js";
import type { ServerError } from "../link/utils/index.js";
import type { FetchResult } from "../link/core/index.js";
export declare const PROTOCOL_ERRORS_SYMBOL: unique symbol;
type FetchResultWithSymbolExtensions<T> = FetchResult<T> & {
    extensions: Record<string | symbol, any>;
};
export interface ApolloErrorOptions {
    graphQLErrors?: ReadonlyArray<GraphQLError>;
    protocolErrors?: ReadonlyArray<{
        message: string;
        extensions?: GraphQLErrorExtensions[];
    }>;
    clientErrors?: ReadonlyArray<Error>;
    networkError?: Error | ServerParseError | ServerError | null;
    errorMessage?: string;
    extraInfo?: any;
}
export declare function graphQLResultHasProtocolErrors<T>(result: FetchResult<T>): result is FetchResultWithSymbolExtensions<T>;
export declare function isApolloError(err: Error): err is ApolloError;
export type GraphQLErrors = ReadonlyArray<GraphQLError>;
export type NetworkError = Error | ServerParseError | ServerError | null;
export declare class ApolloError extends Error {
    name: string;
    message: string;
    graphQLErrors: GraphQLErrors;
    protocolErrors: ReadonlyArray<{
        message: string;
        extensions?: GraphQLErrorExtensions[];
    }>;
    clientErrors: ReadonlyArray<Error>;
    networkError: Error | ServerParseError | ServerError | null;
    extraInfo: any;
    constructor({ graphQLErrors, protocolErrors, clientErrors, networkError, errorMessage, extraInfo, }: ApolloErrorOptions);
}
export {};
//# sourceMappingURL=index.d.ts.map