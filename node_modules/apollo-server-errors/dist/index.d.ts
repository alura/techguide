import { ASTNode, GraphQLError, GraphQLFormattedError, Source, SourceLocation } from 'graphql';
declare module 'graphql' {
    interface GraphQLErrorExtensions {
        exception?: {
            code?: string;
            stacktrace?: ReadonlyArray<string>;
        };
    }
}
export declare class ApolloError extends Error implements GraphQLError {
    extensions: Record<string, any>;
    readonly name: string;
    readonly locations: ReadonlyArray<SourceLocation> | undefined;
    readonly path: ReadonlyArray<string | number> | undefined;
    readonly source: Source | undefined;
    readonly positions: ReadonlyArray<number> | undefined;
    readonly nodes: ReadonlyArray<ASTNode> | undefined;
    originalError: Error | undefined;
    [key: string]: any;
    constructor(message: string, code?: string, extensions?: Record<string, any>);
    toJSON(): GraphQLFormattedError;
    toString(): string;
    get [Symbol.toStringTag](): string;
}
export declare function toApolloError(error: Error & {
    extensions?: Record<string, any>;
}, code?: string): Error & {
    extensions: Record<string, any>;
};
export interface ErrorOptions {
    code?: string;
    errorClass?: new (message: string) => ApolloError;
}
export declare function fromGraphQLError(error: GraphQLError, options?: ErrorOptions): ApolloError;
export declare class SyntaxError extends ApolloError {
    constructor(message: string);
}
export declare class ValidationError extends ApolloError {
    constructor(message: string);
}
export declare class AuthenticationError extends ApolloError {
    constructor(message: string, extensions?: Record<string, any>);
}
export declare class ForbiddenError extends ApolloError {
    constructor(message: string, extensions?: Record<string, any>);
}
export declare class PersistedQueryNotFoundError extends ApolloError {
    constructor();
}
export declare class PersistedQueryNotSupportedError extends ApolloError {
    constructor();
}
export declare class UserInputError extends ApolloError {
    constructor(message: string, extensions?: Record<string, any>);
}
export declare function formatApolloErrors(errors: ReadonlyArray<Error>, options?: {
    formatter?: (error: GraphQLError) => GraphQLFormattedError;
    debug?: boolean;
}): Array<ApolloError>;
//# sourceMappingURL=index.d.ts.map