import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { DefinitionNode, DocumentNode } from 'graphql';
import { GraphQLRequest } from '../types';
export interface KeyedDocumentNode extends DocumentNode {
    __key: number;
}
export declare const stringifyDocument: (node: string | DefinitionNode | DocumentNode) => string;
export declare const keyDocument: (q: string | DocumentNode) => KeyedDocumentNode;
export declare const createRequest: <Data = any, Variables = object>(q: string | DocumentNode | TypedDocumentNode<Data, Variables>, vars?: Variables | undefined) => GraphQLRequest<Data, Variables>;
/**
 * Finds the Name value from the OperationDefinition of a Document
 */
export declare const getOperationName: (query: DocumentNode) => string | undefined;
/**
 * Finds the operation-type
 */
export declare const getOperationType: (query: DocumentNode) => string | undefined;
