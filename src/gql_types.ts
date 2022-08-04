import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  UUID: any;
};

export type CreateSampleTextInput = {
  text: Scalars['String'];
};

export type FieldFilter = {
  eq?: InputMaybe<Scalars['String']>;
  gte?: InputMaybe<Scalars['String']>;
  lt?: InputMaybe<Scalars['String']>;
};

export type Guide = {
  __typename?: 'Guide';
  id?: Maybe<Scalars['UUID']>;
  name?: Maybe<Scalars['String']>;
};

export type GuideInput = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createSampleText: Scalars['String'];
};


export type MutationCreateSampleTextArgs = {
  input?: InputMaybe<CreateSampleTextInput>;
};

export type Query = {
  __typename?: 'Query';
  greet?: Maybe<Scalars['String']>;
  guide?: Maybe<Guide>;
  guides: Array<Maybe<Guide>>;
};


export type QueryGuideArgs = {
  input?: InputMaybe<GuideInput>;
};


export type QueryGuidesArgs = {
  input?: InputMaybe<GuideInput>;
};

export type CreateSampleTextMutationVariables = Exact<{
  input?: InputMaybe<CreateSampleTextInput>;
}>;


export type CreateSampleTextMutation = { __typename?: 'Mutation', createSampleText: string };

export type GuidesQueryVariables = Exact<{ [key: string]: never; }>;


export type GuidesQuery = { __typename?: 'Query', guides: Array<{ __typename?: 'Guide', id?: any | null, name?: string | null } | null> };


export const CreateSampleTextDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateSampleText"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateSampleTextInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createSampleText"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<CreateSampleTextMutation, CreateSampleTextMutationVariables>;
export const GuidesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Guides"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"guides"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<GuidesQuery, GuidesQueryVariables>;