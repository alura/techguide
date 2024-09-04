import { ASTNode, GraphQLError, Source } from 'graphql';
interface GraphQLErrorOptions {
    nodes?: ReadonlyArray<ASTNode> | ASTNode | null;
    source?: Source;
    positions?: ReadonlyArray<number>;
    path?: ReadonlyArray<string | number>;
    originalError?: Error & {
        readonly extensions?: unknown;
    };
    extensions?: any;
}
export declare function createGraphQLError(message: string, options?: GraphQLErrorOptions): GraphQLError;
export {};
