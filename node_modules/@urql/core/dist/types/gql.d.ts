import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { DocumentNode } from 'graphql';
declare function gql<Data = any, Variables = object>(strings: TemplateStringsArray, ...interpolations: Array<TypedDocumentNode | DocumentNode | string>): TypedDocumentNode<Data, Variables>;
declare function gql<Data = any, Variables = object>(string: string): TypedDocumentNode<Data, Variables>;
export { gql };
