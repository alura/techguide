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

export type Block = {
  __typename?: 'Block';
  aditionalObjectives?: Maybe<Array<Maybe<BlockAditionalObjective>>>;
  aluraContents?: Maybe<Array<Maybe<BlockContent>>>;
  collaborations?: Maybe<Array<Maybe<GuideCollaboration>>>;
  contents?: Maybe<Array<Maybe<BlockContent>>>;
  expertises?: Maybe<Array<Maybe<GuideExpertise>>>;
  id?: Maybe<Scalars['String']>;
  keyObjectives?: Maybe<Array<Maybe<BlockKeyObjective>>>;
  logo?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  shortDescription?: Maybe<Scalars['String']>;
  slug?: Maybe<Scalars['String']>;
};

export type BlockAditionalObjective = {
  __typename?: 'BlockAditionalObjective';
  id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  slug?: Maybe<Scalars['String']>;
};

export type BlockContent = {
  __typename?: 'BlockContent';
  id?: Maybe<Scalars['String']>;
  link?: Maybe<Scalars['String']>;
  slug?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  type?: Maybe<BlockContentType>;
};

export enum BlockContentType {
  Article = 'ARTICLE',
  Challenge = 'CHALLENGE',
  Podcast = 'PODCAST',
  Site = 'SITE',
  Youtube = 'YOUTUBE'
}

export type BlockFilters = {
  id?: InputMaybe<FieldFilter>;
  name?: InputMaybe<FieldFilter>;
  slug?: InputMaybe<FieldFilter>;
};

export type BlockInput = {
  slug: Scalars['String'];
};

export type BlockKeyObjective = {
  __typename?: 'BlockKeyObjective';
  id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  slug?: Maybe<Scalars['String']>;
};

export type BlocksInput = {
  filter?: InputMaybe<BlockFilters>;
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<SiteLocale>;
  offset?: InputMaybe<Scalars['Int']>;
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
  collaborations?: Maybe<Array<Maybe<GuideCollaboration>>>;
  expertises?: Maybe<Array<Maybe<GuideExpertise>>>;
  id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  slug?: Maybe<Scalars['String']>;
};

export type GuideBlock = {
  __typename?: 'GuideBlock';
  item?: Maybe<Block>;
  priority?: Maybe<Scalars['Int']>;
};

export type GuideCollaboration = {
  __typename?: 'GuideCollaboration';
  blocks?: Maybe<Array<Maybe<GuideBlock>>>;
  guide?: Maybe<Guide>;
  name?: Maybe<Scalars['String']>;
};

export type GuideExpertise = {
  __typename?: 'GuideExpertise';
  blocks?: Maybe<Array<Maybe<GuideBlock>>>;
  guide?: Maybe<Guide>;
  name?: Maybe<Scalars['String']>;
};

export type GuideFilters = {
  id?: InputMaybe<FieldFilter>;
  name?: InputMaybe<FieldFilter>;
  slug?: InputMaybe<FieldFilter>;
};

export type GuideInput = {
  slug: Scalars['String'];
};

export type GuidesInput = {
  filter?: InputMaybe<GuideFilters>;
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<SiteLocale>;
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
  block?: Maybe<Block>;
  blocks: Array<Maybe<Block>>;
  greet?: Maybe<Scalars['String']>;
  guide?: Maybe<Guide>;
  guides: Array<Maybe<Guide>>;
};


export type QueryBlockArgs = {
  input?: InputMaybe<BlockInput>;
  locale?: InputMaybe<SiteLocale>;
};


export type QueryBlocksArgs = {
  input?: InputMaybe<BlocksInput>;
  locale?: InputMaybe<SiteLocale>;
};


export type QueryGuideArgs = {
  input?: InputMaybe<GuideInput>;
  locale?: InputMaybe<SiteLocale>;
};


export type QueryGuidesArgs = {
  input?: InputMaybe<GuidesInput>;
  locale?: InputMaybe<SiteLocale>;
};

export enum SiteLocale {
  EnUs = 'EN_US',
  PtBr = 'PT_BR'
}

export type HomeGetAllGuidesQueryVariables = Exact<{
  locale?: InputMaybe<SiteLocale>;
}>;


export type HomeGetAllGuidesQuery = { __typename?: 'Query', guides: Array<{ __typename?: 'Guide', name?: string | null, slug?: string | null } | null> };

export type AllPathsForActiveBlockQueryVariables = Exact<{
  locale?: InputMaybe<SiteLocale>;
}>;


export type AllPathsForActiveBlockQuery = { __typename?: 'Query', guides: Array<{ __typename?: 'Guide', slug?: string | null, expertises?: Array<{ __typename?: 'GuideExpertise', name?: string | null, blocks?: Array<{ __typename?: 'GuideBlock', item?: { __typename?: 'Block', slug?: string | null } | null } | null> | null } | null> | null, collaborations?: Array<{ __typename?: 'GuideCollaboration', name?: string | null, blocks?: Array<{ __typename?: 'GuideBlock', item?: { __typename?: 'Block', slug?: string | null } | null } | null> | null } | null> | null } | null> };

export type PathScreenGetGuideBySlugQueryVariables = Exact<{
  input?: InputMaybe<GuideInput>;
  locale?: InputMaybe<SiteLocale>;
}>;


export type PathScreenGetGuideBySlugQuery = { __typename?: 'Query', guide?: { __typename?: 'Guide', slug?: string | null, name?: string | null, expertises?: Array<{ __typename?: 'GuideExpertise', name?: string | null, blocks?: Array<{ __typename?: 'GuideBlock', priority?: number | null, item?: { __typename?: 'Block', slug?: string | null, name?: string | null, keyObjectives?: Array<{ __typename?: 'BlockKeyObjective', id?: string | null, name?: string | null } | null> | null, aluraContents?: Array<{ __typename?: 'BlockContent', id?: string | null, title?: string | null, link?: string | null, type?: BlockContentType | null } | null> | null, contents?: Array<{ __typename?: 'BlockContent', id?: string | null, title?: string | null, link?: string | null, type?: BlockContentType | null } | null> | null } | null } | null> | null } | null> | null, collaborations?: Array<{ __typename?: 'GuideCollaboration', name?: string | null, blocks?: Array<{ __typename?: 'GuideBlock', priority?: number | null, item?: { __typename?: 'Block', slug?: string | null, name?: string | null, keyObjectives?: Array<{ __typename?: 'BlockKeyObjective', id?: string | null, name?: string | null } | null> | null, aluraContents?: Array<{ __typename?: 'BlockContent', id?: string | null, title?: string | null, link?: string | null, type?: BlockContentType | null } | null> | null, contents?: Array<{ __typename?: 'BlockContent', id?: string | null, title?: string | null, link?: string | null, type?: BlockContentType | null } | null> | null } | null } | null> | null } | null> | null } | null };


export const HomeGetAllGuidesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"HomeGetAllGuides"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"locale"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SiteLocale"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"guides"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"locale"},"value":{"kind":"Variable","name":{"kind":"Name","value":"locale"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}}]} as unknown as DocumentNode<HomeGetAllGuidesQuery, HomeGetAllGuidesQueryVariables>;
export const AllPathsForActiveBlockDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AllPathsForActiveBlock"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"locale"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SiteLocale"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"guides"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"locale"},"value":{"kind":"Variable","name":{"kind":"Name","value":"locale"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"expertises"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"blocks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"item"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"collaborations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"blocks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"item"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<AllPathsForActiveBlockQuery, AllPathsForActiveBlockQueryVariables>;
export const PathScreenGetGuideBySlugDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PathScreenGetGuideBySlug"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"GuideInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"locale"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SiteLocale"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"guide"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}},{"kind":"Argument","name":{"kind":"Name","value":"locale"},"value":{"kind":"Variable","name":{"kind":"Name","value":"locale"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"expertises"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"blocks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"item"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"keyObjectives"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"aluraContents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"link"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"contents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"link"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"collaborations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"blocks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"item"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"keyObjectives"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"aluraContents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"link"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"contents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"link"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<PathScreenGetGuideBySlugQuery, PathScreenGetGuideBySlugQueryVariables>;