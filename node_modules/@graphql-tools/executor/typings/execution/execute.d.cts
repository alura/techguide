import { GraphQLFormattedError, FieldNode, FragmentDefinitionNode, OperationDefinitionNode, GraphQLField, GraphQLFieldResolver, GraphQLObjectType, GraphQLResolveInfo, GraphQLTypeResolver, GraphQLSchema, DocumentNode } from 'graphql';
import type { GraphQLError } from 'graphql';
import { Path, Maybe, MaybePromise } from '@graphql-tools/utils';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';
export interface SingularExecutionResult<TData = any, TExtensions = any> {
    errors?: ReadonlyArray<GraphQLError>;
    data?: TData | null;
    extensions?: TExtensions;
}
/**
 * Terminology
 *
 * "Definitions" are the generic name for top-level statements in the document.
 * Examples of this include:
 * 1) Operations (such as a query)
 * 2) Fragments
 *
 * "Operations" are a generic name for requests in the document.
 * Examples of this include:
 * 1) query,
 * 2) mutation
 *
 * "Selections" are the definitions that can appear legally and at
 * single level of the query. These include:
 * 1) field references e.g `a`
 * 2) fragment "spreads" e.g. `...c`
 * 3) inline fragment "spreads" e.g. `...on Type { a }`
 */
/**
 * Data that must be available at all points during query execution.
 *
 * Namely, schema of the type system that is currently executing,
 * and the fragments defined in the query document
 */
export interface ExecutionContext<TVariables = any, TContext = any> {
    schema: GraphQLSchema;
    fragments: Record<string, FragmentDefinitionNode>;
    rootValue: unknown;
    contextValue: TContext;
    operation: OperationDefinitionNode;
    variableValues: TVariables;
    fieldResolver: GraphQLFieldResolver<any, TContext>;
    typeResolver: GraphQLTypeResolver<any, TContext>;
    subscribeFieldResolver: GraphQLFieldResolver<any, TContext>;
    errors: Array<GraphQLError>;
    subsequentPayloads: Set<AsyncPayloadRecord>;
}
export interface FormattedExecutionResult<TData = Record<string, unknown>, TExtensions = Record<string, unknown>> {
    errors?: ReadonlyArray<GraphQLFormattedError>;
    data?: TData | null;
    extensions?: TExtensions;
}
export interface IncrementalExecutionResults<TData = Record<string, unknown>, TExtensions = Record<string, unknown>> {
    initialResult: InitialIncrementalExecutionResult<TData, TExtensions>;
    subsequentResults: AsyncGenerator<SubsequentIncrementalExecutionResult<TData, TExtensions>, void, void>;
}
export interface InitialIncrementalExecutionResult<TData = Record<string, unknown>, TExtensions = Record<string, unknown>> extends SingularExecutionResult<TData, TExtensions> {
    hasNext: boolean;
    incremental?: ReadonlyArray<IncrementalResult<TData, TExtensions>>;
    extensions?: TExtensions;
}
export interface FormattedInitialIncrementalExecutionResult<TData = Record<string, unknown>, TExtensions = Record<string, unknown>> extends FormattedExecutionResult<TData, TExtensions> {
    hasNext: boolean;
    incremental?: ReadonlyArray<FormattedIncrementalResult<TData, TExtensions>>;
    extensions?: TExtensions;
}
export interface SubsequentIncrementalExecutionResult<TData = Record<string, unknown>, TExtensions = Record<string, unknown>> {
    hasNext: boolean;
    incremental?: ReadonlyArray<IncrementalResult<TData, TExtensions>>;
    extensions?: TExtensions;
}
export interface FormattedSubsequentIncrementalExecutionResult<TData = Record<string, unknown>, TExtensions = Record<string, unknown>> {
    hasNext: boolean;
    incremental?: ReadonlyArray<FormattedIncrementalResult<TData, TExtensions>>;
    extensions?: TExtensions;
}
export interface IncrementalDeferResult<TData = Record<string, unknown>, TExtensions = Record<string, unknown>> extends SingularExecutionResult<TData, TExtensions> {
    path?: ReadonlyArray<string | number>;
    label?: string;
}
export interface FormattedIncrementalDeferResult<TData = Record<string, unknown>, TExtensions = Record<string, unknown>> extends FormattedExecutionResult<TData, TExtensions> {
    path?: ReadonlyArray<string | number>;
    label?: string;
}
export interface IncrementalStreamResult<TData = Array<unknown>, TExtensions = Record<string, unknown>> {
    errors?: ReadonlyArray<GraphQLError>;
    items?: TData | null;
    path?: ReadonlyArray<string | number>;
    label?: string;
    extensions?: TExtensions;
}
export interface FormattedIncrementalStreamResult<TData = Array<unknown>, TExtensions = Record<string, unknown>> {
    errors?: ReadonlyArray<GraphQLFormattedError>;
    items?: TData | null;
    path?: ReadonlyArray<string | number>;
    label?: string;
    extensions?: TExtensions;
}
export type IncrementalResult<TData = Record<string, unknown>, TExtensions = Record<string, unknown>> = IncrementalDeferResult<TData, TExtensions> | IncrementalStreamResult<TData, TExtensions>;
export type FormattedIncrementalResult<TData = Record<string, unknown>, TExtensions = Record<string, unknown>> = FormattedIncrementalDeferResult<TData, TExtensions> | FormattedIncrementalStreamResult<TData, TExtensions>;
export interface ExecutionArgs<TData = any, TVariables = any, TContext = any> {
    schema: GraphQLSchema;
    document: TypedDocumentNode<TData, TVariables>;
    rootValue?: unknown;
    contextValue?: TContext;
    variableValues?: TVariables;
    operationName?: Maybe<string>;
    fieldResolver?: Maybe<GraphQLFieldResolver<any, TContext>>;
    typeResolver?: Maybe<GraphQLTypeResolver<any, TContext>>;
    subscribeFieldResolver?: Maybe<GraphQLFieldResolver<any, TContext>>;
}
/**
 * Implements the "Executing requests" section of the GraphQL specification,
 * including `@defer` and `@stream` as proposed in
 * https://github.com/graphql/graphql-spec/pull/742
 *
 * This function returns a Promise of an IncrementalExecutionResults
 * object. This object either consists of a single ExecutionResult, or an
 * object containing an `initialResult` and a stream of `subsequentResults`.
 *
 * If the arguments to this function do not result in a legal execution context,
 * a GraphQLError will be thrown immediately explaining the invalid input.
 */
export declare function execute<TData = any, TVariables = any, TContext = any>(args: ExecutionArgs<TData, TVariables, TContext>): MaybePromise<SingularExecutionResult<TData> | IncrementalExecutionResults<TData>>;
/**
 * Also implements the "Executing requests" section of the GraphQL specification.
 * However, it guarantees to complete synchronously (or throw an error) assuming
 * that all field resolvers are also synchronous.
 */
export declare function executeSync(args: ExecutionArgs): SingularExecutionResult;
/**
 * Essential assertions before executing to provide developer feedback for
 * improper use of the GraphQL library.
 *
 * @internal
 */
export declare function assertValidExecutionArguments<TVariables>(schema: GraphQLSchema, document: TypedDocumentNode<any, TVariables>, rawVariableValues: Maybe<TVariables>): void;
export declare const getFragmentsFromDocument: (document: DocumentNode) => Record<string, FragmentDefinitionNode>;
/**
 * Constructs a ExecutionContext object from the arguments passed to
 * execute, which we will pass throughout the other execution methods.
 *
 * Throws a GraphQLError if a valid execution context cannot be created.
 *
 * TODO: consider no longer exporting this function
 * @internal
 */
export declare function buildExecutionContext<TData = any, TVariables = any, TContext = any>(args: ExecutionArgs<TData, TVariables, TContext>): ReadonlyArray<GraphQLError> | ExecutionContext;
/**
 * TODO: consider no longer exporting this function
 * @internal
 */
export declare function buildResolveInfo(exeContext: ExecutionContext, fieldDef: GraphQLField<unknown, unknown>, fieldNodes: Array<FieldNode>, parentType: GraphQLObjectType, path: Path): GraphQLResolveInfo;
/**
 * If a resolveType function is not given, then a default resolve behavior is
 * used which attempts two strategies:
 *
 * First, See if the provided value has a `__typename` field defined, if so, use
 * that value as name of the resolved type.
 *
 * Otherwise, test each possible type for the abstract type by calling
 * isTypeOf for the object being coerced, returning the first type that matches.
 */
export declare const defaultTypeResolver: GraphQLTypeResolver<unknown, unknown>;
/**
 * If a resolve function is not given, then a default resolve behavior is used
 * which takes the property of the source object of the same name as the field
 * and returns it as the result, or if it's a function, returns the result
 * of calling that function while passing along args and context value.
 */
export declare const defaultFieldResolver: GraphQLFieldResolver<unknown, unknown>;
/**
 * Implements the "Subscribe" algorithm described in the GraphQL specification,
 * including `@defer` and `@stream` as proposed in
 * https://github.com/graphql/graphql-spec/pull/742
 *
 * Returns a Promise which resolves to either an AsyncIterator (if successful)
 * or an ExecutionResult (error). The promise will be rejected if the schema or
 * other arguments to this function are invalid, or if the resolved event stream
 * is not an async iterable.
 *
 * If the client-provided arguments to this function do not result in a
 * compliant subscription, a GraphQL Response (ExecutionResult) with descriptive
 * errors and no data will be returned.
 *
 * If the source stream could not be created due to faulty subscription resolver
 * logic or underlying systems, the promise will resolve to a single
 * ExecutionResult containing `errors` and no `data`.
 *
 * If the operation succeeded, the promise resolves to an AsyncIterator, which
 * yields a stream of result representing the response stream.
 *
 * Each result may be an ExecutionResult with no `hasNext` (if executing the
 * event did not use `@defer` or `@stream`), or an
 * `InitialIncrementalExecutionResult` or `SubsequentIncrementalExecutionResult`
 * (if executing the event used `@defer` or `@stream`). In the case of
 * incremental execution results, each event produces a single
 * `InitialIncrementalExecutionResult` followed by one or more
 * `SubsequentIncrementalExecutionResult`s; all but the last have `hasNext: true`,
 * and the last has `hasNext: false`. There is no interleaving between results
 * generated from the same original event.
 *
 * Accepts an object with named arguments.
 */
export declare function subscribe<TData = any, TVariables = any, TContext = any>(args: ExecutionArgs<TData, TVariables, TContext>): MaybePromise<AsyncGenerator<SingularExecutionResult<TData> | InitialIncrementalExecutionResult<TData> | SubsequentIncrementalExecutionResult<TData>, void, void> | SingularExecutionResult<TData>>;
export declare function flattenIncrementalResults<TData>(incrementalResults: IncrementalExecutionResults<TData>): AsyncGenerator<SubsequentIncrementalExecutionResult<TData, Record<string, unknown>>, void, void>;
declare class DeferredFragmentRecord {
    type: 'defer';
    errors: Array<GraphQLError>;
    label: string | undefined;
    path: Array<string | number>;
    promise: Promise<void>;
    data: Record<string, unknown> | null;
    parentContext: AsyncPayloadRecord | undefined;
    isCompleted: boolean;
    _exeContext: ExecutionContext;
    _resolve?: (arg: MaybePromise<Record<string, unknown> | null>) => void;
    constructor(opts: {
        label: string | undefined;
        path: Path | undefined;
        parentContext: AsyncPayloadRecord | undefined;
        exeContext: ExecutionContext;
    });
    addData(data: MaybePromise<Record<string, unknown> | null>): void;
}
declare class StreamRecord {
    type: 'stream';
    errors: Array<GraphQLError>;
    label: string | undefined;
    path: Array<string | number>;
    items: Array<unknown> | null;
    promise: Promise<void>;
    parentContext: AsyncPayloadRecord | undefined;
    iterator: AsyncIterator<unknown> | undefined;
    isCompletedIterator?: boolean;
    isCompleted: boolean;
    _exeContext: ExecutionContext;
    _resolve?: (arg: MaybePromise<Array<unknown> | null>) => void;
    constructor(opts: {
        label: string | undefined;
        path: Path | undefined;
        iterator?: AsyncIterator<unknown>;
        parentContext: AsyncPayloadRecord | undefined;
        exeContext: ExecutionContext;
    });
    addItems(items: MaybePromise<Array<unknown> | null>): void;
    setIsCompletedIterator(): void;
}
type AsyncPayloadRecord = DeferredFragmentRecord | StreamRecord;
/**
 * This method looks up the field on the given type definition.
 * It has special casing for the three introspection fields,
 * __schema, __type and __typename. __typename is special because
 * it can always be queried as a field, even in situations where no
 * other fields are allowed, like on a Union. __schema and __type
 * could get automatically added to the query type, but that would
 * require mutating type definitions, which would cause issues.
 *
 * @internal
 */
export declare function getFieldDef(schema: GraphQLSchema, parentType: GraphQLObjectType, fieldNode: FieldNode): Maybe<GraphQLField<unknown, unknown>>;
export declare function isIncrementalResult<TData>(result: SingularExecutionResult<TData> | IncrementalExecutionResults<TData>): result is IncrementalExecutionResults<TData>;
export {};
