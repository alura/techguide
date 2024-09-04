import { Source, Subscription } from 'wonka';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { DocumentNode } from 'graphql';
import { Exchange, GraphQLRequest, Operation, OperationContext, OperationResult, OperationType, RequestPolicy, PromisifiedSource, DebugEvent } from './types';
/** Options for configuring the URQL [client]{@link Client}. */
export interface ClientOptions {
    /** Target endpoint URL such as `https://my-target:8080/graphql`. */
    url: string;
    /** Any additional options to pass to fetch. */
    fetchOptions?: RequestInit | (() => RequestInit);
    /** An alternative fetch implementation. */
    fetch?: typeof fetch;
    /** An ordered array of Exchanges. */
    exchanges?: Exchange[];
    /** Activates support for Suspense. */
    suspense?: boolean;
    /** The default request policy for requests. */
    requestPolicy?: RequestPolicy;
    /** Use HTTP GET for queries. */
    preferGetMethod?: boolean;
    /** Mask __typename from results. */
    maskTypename?: boolean;
}
export interface Client {
    new (options: ClientOptions): Client;
    operations$: Source<Operation>;
    /** Start an operation from an exchange */
    reexecuteOperation: (operation: Operation) => void;
    /** Event target for monitoring, e.g. for @urql/devtools */
    subscribeToDebugTarget?: (onEvent: (e: DebugEvent) => void) => Subscription;
    url: string;
    fetch?: typeof fetch;
    fetchOptions?: RequestInit | (() => RequestInit);
    suspense: boolean;
    requestPolicy: RequestPolicy;
    preferGetMethod: boolean;
    maskTypename: boolean;
    createOperationContext(opts?: Partial<OperationContext> | undefined): OperationContext;
    createRequestOperation<Data = any, Variables = object>(kind: OperationType, request: GraphQLRequest<Data, Variables>, opts?: Partial<OperationContext> | undefined): Operation<Data, Variables>;
    /** Executes an Operation by sending it through the exchange pipeline It returns an observable that emits all related exchange results and keeps track of this observable's subscribers. A teardown signal will be emitted when no subscribers are listening anymore. */
    executeRequestOperation<Data = any, Variables = object>(operation: Operation<Data, Variables>): Source<OperationResult<Data, Variables>>;
    query<Data = any, Variables extends object = {}>(query: DocumentNode | TypedDocumentNode<Data, Variables> | string, variables?: Variables, context?: Partial<OperationContext>): PromisifiedSource<OperationResult<Data, Variables>>;
    readQuery<Data = any, Variables extends object = {}>(query: DocumentNode | TypedDocumentNode<Data, Variables> | string, variables?: Variables, context?: Partial<OperationContext>): OperationResult<Data, Variables> | null;
    executeQuery<Data = any, Variables = object>(query: GraphQLRequest<Data, Variables>, opts?: Partial<OperationContext> | undefined): Source<OperationResult<Data, Variables>>;
    subscription<Data = any, Variables extends object = {}>(query: DocumentNode | TypedDocumentNode<Data, Variables> | string, variables?: Variables, context?: Partial<OperationContext>): Source<OperationResult<Data, Variables>>;
    executeSubscription<Data = any, Variables = object>(query: GraphQLRequest<Data, Variables>, opts?: Partial<OperationContext> | undefined): Source<OperationResult<Data, Variables>>;
    mutation<Data = any, Variables extends object = {}>(query: DocumentNode | TypedDocumentNode<Data, Variables> | string, variables?: Variables, context?: Partial<OperationContext>): PromisifiedSource<OperationResult<Data, Variables>>;
    executeMutation<Data = any, Variables = object>(query: GraphQLRequest<Data, Variables>, opts?: Partial<OperationContext> | undefined): Source<OperationResult<Data, Variables>>;
}
export declare const Client: new (opts: ClientOptions) => Client;
export declare const createClient: (opts: ClientOptions) => Client;
