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

export type Card = {
  __typename?: 'Card';
  aditionalObjectives?: Maybe<Array<Maybe<CardAditionalObjective>>>;
  aluraContents?: Maybe<Array<Maybe<CardContent>>>;
  collaborations?: Maybe<Array<Maybe<GuideCollaboration>>>;
  contents?: Maybe<Array<Maybe<CardContent>>>;
  expertises?: Maybe<Array<Maybe<GuideExpertise>>>;
  id?: Maybe<Scalars['String']>;
  keyObjectives?: Maybe<Array<Maybe<CardKeyObjective>>>;
  logo?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  shortDescription?: Maybe<Scalars['String']>;
  slug?: Maybe<Scalars['String']>;
};

export type CardAditionalObjective = {
  __typename?: 'CardAditionalObjective';
  id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  slug?: Maybe<Scalars['String']>;
};

export type CardContent = {
  __typename?: 'CardContent';
  id?: Maybe<Scalars['String']>;
  link?: Maybe<Scalars['String']>;
  slug?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  type?: Maybe<CardContentType>;
};

export enum CardContentType {
  Aluraplus = 'ALURAPLUS',
  Article = 'ARTICLE',
  Challenge = 'CHALLENGE',
  Course = 'COURSE',
  Podcast = 'PODCAST',
  Site = 'SITE',
  Youtube = 'YOUTUBE'
}

export type CardFilters = {
  id?: InputMaybe<FieldFilter>;
  name?: InputMaybe<FieldFilter>;
  slug?: InputMaybe<FieldFilter>;
};

export type CardInput = {
  slug: Scalars['String'];
};

export type CardKeyObjective = {
  __typename?: 'CardKeyObjective';
  id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  slug?: Maybe<Scalars['String']>;
};

export type CardsInput = {
  filter?: InputMaybe<CardFilters>;
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
  faq?: Maybe<Array<Maybe<GuideFaq>>>;
  id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  slug?: Maybe<Scalars['String']>;
  tags?: Maybe<Array<Maybe<Scalars['String']>>>;
  video?: Maybe<Scalars['String']>;
};

export type GuideCard = {
  __typename?: 'GuideCard';
  item?: Maybe<Card>;
  optional?: Maybe<Scalars['Boolean']>;
  priority?: Maybe<Scalars['Int']>;
};

export type GuideCollaboration = {
  __typename?: 'GuideCollaboration';
  cards?: Maybe<Array<Maybe<GuideCard>>>;
  guide?: Maybe<Guide>;
  name?: Maybe<Scalars['String']>;
};

export type GuideExpertise = {
  __typename?: 'GuideExpertise';
  cards?: Maybe<Array<Maybe<GuideCard>>>;
  guide?: Maybe<Guide>;
  name?: Maybe<Scalars['String']>;
};

export type GuideFaq = {
  __typename?: 'GuideFAQ';
  answer?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
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
  card?: Maybe<Card>;
  cards: Array<Maybe<Card>>;
  greet?: Maybe<Scalars['String']>;
  guide?: Maybe<Guide>;
  guides: Array<Maybe<Guide>>;
};


export type QueryCardArgs = {
  input?: InputMaybe<CardInput>;
  locale?: InputMaybe<SiteLocale>;
};


export type QueryCardsArgs = {
  input?: InputMaybe<CardsInput>;
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
  Es = 'ES',
  PtBr = 'PT_BR'
}

export type HomeGetAllGuidesQueryVariables = Exact<{
  locale?: InputMaybe<SiteLocale>;
  input?: InputMaybe<GuidesInput>;
}>;


export type HomeGetAllGuidesQuery = { __typename?: 'Query', guides: Array<{ __typename?: 'Guide', name?: string | null, slug?: string | null, tags?: Array<string | null> | null } | null> };

export type AllPathsForActiveCardQueryVariables = Exact<{
  locale?: InputMaybe<SiteLocale>;
  input?: InputMaybe<GuidesInput>;
}>;


export type AllPathsForActiveCardQuery = { __typename?: 'Query', guides: Array<{ __typename?: 'Guide', slug?: string | null, expertises?: Array<{ __typename?: 'GuideExpertise', name?: string | null, cards?: Array<{ __typename?: 'GuideCard', item?: { __typename?: 'Card', slug?: string | null } | null } | null> | null } | null> | null, collaborations?: Array<{ __typename?: 'GuideCollaboration', name?: string | null, cards?: Array<{ __typename?: 'GuideCard', item?: { __typename?: 'Card', slug?: string | null } | null } | null> | null } | null> | null } | null> };

export type GetAllCardsQueryVariables = Exact<{
  locale?: InputMaybe<SiteLocale>;
  input?: InputMaybe<CardsInput>;
}>;


export type GetAllCardsQuery = { __typename?: 'Query', cards: Array<{ __typename?: 'Card', id?: string | null, name?: string | null, slug?: string | null, keyObjectives?: Array<{ __typename?: 'CardKeyObjective', id?: string | null, name?: string | null } | null> | null, aluraContents?: Array<{ __typename?: 'CardContent', id?: string | null, title?: string | null, link?: string | null, type?: CardContentType | null } | null> | null, contents?: Array<{ __typename?: 'CardContent', id?: string | null, title?: string | null, link?: string | null, type?: CardContentType | null } | null> | null } | null> };

export type PathScreenGetGuideBySlugQueryVariables = Exact<{
  input?: InputMaybe<GuideInput>;
  locale?: InputMaybe<SiteLocale>;
}>;


export type PathScreenGetGuideBySlugQuery = { __typename?: 'Query', guide?: { __typename?: 'Guide', slug?: string | null, name?: string | null, video?: string | null, faq?: Array<{ __typename?: 'GuideFAQ', title?: string | null, answer?: string | null } | null> | null, expertises?: Array<{ __typename?: 'GuideExpertise', name?: string | null, cards?: Array<{ __typename?: 'GuideCard', priority?: number | null, optional?: boolean | null, item?: { __typename?: 'Card', slug?: string | null, name?: string | null, keyObjectives?: Array<{ __typename?: 'CardKeyObjective', id?: string | null, name?: string | null } | null> | null, aluraContents?: Array<{ __typename?: 'CardContent', id?: string | null, title?: string | null, link?: string | null, type?: CardContentType | null } | null> | null, contents?: Array<{ __typename?: 'CardContent', id?: string | null, title?: string | null, link?: string | null, type?: CardContentType | null } | null> | null } | null } | null> | null } | null> | null, collaborations?: Array<{ __typename?: 'GuideCollaboration', name?: string | null, cards?: Array<{ __typename?: 'GuideCard', priority?: number | null, optional?: boolean | null, item?: { __typename?: 'Card', slug?: string | null, name?: string | null, keyObjectives?: Array<{ __typename?: 'CardKeyObjective', id?: string | null, name?: string | null } | null> | null, aluraContents?: Array<{ __typename?: 'CardContent', id?: string | null, title?: string | null, link?: string | null, type?: CardContentType | null } | null> | null, contents?: Array<{ __typename?: 'CardContent', id?: string | null, title?: string | null, link?: string | null, type?: CardContentType | null } | null> | null } | null } | null> | null } | null> | null } | null };


export const HomeGetAllGuidesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"HomeGetAllGuides"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"locale"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SiteLocale"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"GuidesInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"guides"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"locale"},"value":{"kind":"Variable","name":{"kind":"Name","value":"locale"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"tags"}}]}}]}}]} as unknown as DocumentNode<HomeGetAllGuidesQuery, HomeGetAllGuidesQueryVariables>;
export const AllPathsForActiveCardDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AllPathsForActiveCard"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"locale"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SiteLocale"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"GuidesInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"guides"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"locale"},"value":{"kind":"Variable","name":{"kind":"Name","value":"locale"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"expertises"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"cards"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"item"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"collaborations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"cards"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"item"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<AllPathsForActiveCardQuery, AllPathsForActiveCardQueryVariables>;
export const GetAllCardsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAllCards"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"locale"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SiteLocale"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"CardsInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cards"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"locale"},"value":{"kind":"Variable","name":{"kind":"Name","value":"locale"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"keyObjectives"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"aluraContents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"link"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"contents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"link"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]}}]} as unknown as DocumentNode<GetAllCardsQuery, GetAllCardsQueryVariables>;
export const PathScreenGetGuideBySlugDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PathScreenGetGuideBySlug"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"GuideInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"locale"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SiteLocale"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"guide"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}},{"kind":"Argument","name":{"kind":"Name","value":"locale"},"value":{"kind":"Variable","name":{"kind":"Name","value":"locale"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"video"}},{"kind":"Field","name":{"kind":"Name","value":"faq"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"answer"}}]}},{"kind":"Field","name":{"kind":"Name","value":"expertises"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"cards"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"optional"}},{"kind":"Field","name":{"kind":"Name","value":"item"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"keyObjectives"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"aluraContents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"link"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"contents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"link"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"collaborations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"cards"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"optional"}},{"kind":"Field","name":{"kind":"Name","value":"item"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"keyObjectives"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"aluraContents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"link"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"contents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"link"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<PathScreenGetGuideBySlugQuery, PathScreenGetGuideBySlugQueryVariables>;