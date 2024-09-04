import type { ExecutionResult, GraphQLError } from "graphql";
import type { DocumentNode } from "graphql";
import type { DefaultContext } from "../../core/index.js";
export type { DocumentNode };
import type { Observable } from "../../utilities/index.js";
export type Path = ReadonlyArray<string | number>;
interface ExecutionPatchResultBase {
    hasNext?: boolean;
}
export interface ExecutionPatchInitialResult<TData = Record<string, any>, TExtensions = Record<string, any>> extends ExecutionPatchResultBase {
    data: TData | null | undefined;
    incremental?: never;
    errors?: ReadonlyArray<GraphQLError>;
    extensions?: TExtensions;
}
export interface IncrementalPayload<TData, TExtensions> {
    data: TData | null;
    label?: string;
    path: Path;
    errors?: ReadonlyArray<GraphQLError>;
    extensions?: TExtensions;
}
export interface ExecutionPatchIncrementalResult<TData = Record<string, any>, TExtensions = Record<string, any>> extends ExecutionPatchResultBase {
    incremental?: IncrementalPayload<TData, TExtensions>[];
    data?: never;
    errors?: never;
    extensions?: never;
}
export interface ApolloPayloadResult<TData = Record<string, any>, TExtensions = Record<string, any>> {
    payload: SingleExecutionResult | ExecutionPatchResult | null;
    errors?: ReadonlyArray<Error | string>;
}
export type ExecutionPatchResult<TData = Record<string, any>, TExtensions = Record<string, any>> = ExecutionPatchInitialResult<TData, TExtensions> | ExecutionPatchIncrementalResult<TData, TExtensions>;
export interface GraphQLRequest<TVariables = Record<string, any>> {
    query: DocumentNode;
    variables?: TVariables;
    operationName?: string;
    context?: DefaultContext;
    extensions?: Record<string, any>;
}
export interface Operation {
    query: DocumentNode;
    variables: Record<string, any>;
    operationName: string;
    extensions: Record<string, any>;
    setContext: {
        (context: Partial<DefaultContext>): void;
        (updateContext: (previousContext: DefaultContext) => Partial<DefaultContext>): void;
    };
    getContext: () => DefaultContext;
}
export interface SingleExecutionResult<TData = Record<string, any>, TContext = DefaultContext, TExtensions = Record<string, any>> extends ExecutionResult<TData, TExtensions> {
    data?: TData | null;
    context?: TContext;
}
export type FetchResult<TData = Record<string, any>, TContext = Record<string, any>, TExtensions = Record<string, any>> = SingleExecutionResult<TData, TContext, TExtensions> | ExecutionPatchResult<TData, TExtensions>;
export type NextLink = (operation: Operation) => Observable<FetchResult>;
export type RequestHandler = (operation: Operation, forward: NextLink) => Observable<FetchResult> | null;
//# sourceMappingURL=types.d.ts.map