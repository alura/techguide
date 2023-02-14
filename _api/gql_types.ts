import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
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
  UUID: string;
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
  id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  slug?: Maybe<Scalars['String']>;
  tags?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type GuideCard = {
  __typename?: 'GuideCard';
  item?: Maybe<Card>;
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



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Card: ResolverTypeWrapper<Card>;
  CardAditionalObjective: ResolverTypeWrapper<CardAditionalObjective>;
  CardContent: ResolverTypeWrapper<CardContent>;
  CardContentType: CardContentType;
  CardFilters: CardFilters;
  CardInput: CardInput;
  CardKeyObjective: ResolverTypeWrapper<CardKeyObjective>;
  CardsInput: CardsInput;
  CreateSampleTextInput: CreateSampleTextInput;
  FieldFilter: FieldFilter;
  Guide: ResolverTypeWrapper<Guide>;
  GuideCard: ResolverTypeWrapper<GuideCard>;
  GuideCollaboration: ResolverTypeWrapper<GuideCollaboration>;
  GuideExpertise: ResolverTypeWrapper<GuideExpertise>;
  GuideFilters: GuideFilters;
  GuideInput: GuideInput;
  GuidesInput: GuidesInput;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  SiteLocale: SiteLocale;
  String: ResolverTypeWrapper<Scalars['String']>;
  UUID: ResolverTypeWrapper<Scalars['UUID']>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean'];
  Card: Card;
  CardAditionalObjective: CardAditionalObjective;
  CardContent: CardContent;
  CardFilters: CardFilters;
  CardInput: CardInput;
  CardKeyObjective: CardKeyObjective;
  CardsInput: CardsInput;
  CreateSampleTextInput: CreateSampleTextInput;
  FieldFilter: FieldFilter;
  Guide: Guide;
  GuideCard: GuideCard;
  GuideCollaboration: GuideCollaboration;
  GuideExpertise: GuideExpertise;
  GuideFilters: GuideFilters;
  GuideInput: GuideInput;
  GuidesInput: GuidesInput;
  Int: Scalars['Int'];
  Mutation: {};
  Query: {};
  String: Scalars['String'];
  UUID: Scalars['UUID'];
};

export type CardResolvers<ContextType = any, ParentType extends ResolversParentTypes['Card'] = ResolversParentTypes['Card']> = {
  aditionalObjectives?: Resolver<Maybe<Array<Maybe<ResolversTypes['CardAditionalObjective']>>>, ParentType, ContextType>;
  aluraContents?: Resolver<Maybe<Array<Maybe<ResolversTypes['CardContent']>>>, ParentType, ContextType>;
  collaborations?: Resolver<Maybe<Array<Maybe<ResolversTypes['GuideCollaboration']>>>, ParentType, ContextType>;
  contents?: Resolver<Maybe<Array<Maybe<ResolversTypes['CardContent']>>>, ParentType, ContextType>;
  expertises?: Resolver<Maybe<Array<Maybe<ResolversTypes['GuideExpertise']>>>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  keyObjectives?: Resolver<Maybe<Array<Maybe<ResolversTypes['CardKeyObjective']>>>, ParentType, ContextType>;
  logo?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  shortDescription?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  slug?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CardAditionalObjectiveResolvers<ContextType = any, ParentType extends ResolversParentTypes['CardAditionalObjective'] = ResolversParentTypes['CardAditionalObjective']> = {
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  slug?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CardContentResolvers<ContextType = any, ParentType extends ResolversParentTypes['CardContent'] = ResolversParentTypes['CardContent']> = {
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  link?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  slug?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  type?: Resolver<Maybe<ResolversTypes['CardContentType']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CardKeyObjectiveResolvers<ContextType = any, ParentType extends ResolversParentTypes['CardKeyObjective'] = ResolversParentTypes['CardKeyObjective']> = {
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  slug?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GuideResolvers<ContextType = any, ParentType extends ResolversParentTypes['Guide'] = ResolversParentTypes['Guide']> = {
  collaborations?: Resolver<Maybe<Array<Maybe<ResolversTypes['GuideCollaboration']>>>, ParentType, ContextType>;
  expertises?: Resolver<Maybe<Array<Maybe<ResolversTypes['GuideExpertise']>>>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  slug?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  tags?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GuideCardResolvers<ContextType = any, ParentType extends ResolversParentTypes['GuideCard'] = ResolversParentTypes['GuideCard']> = {
  item?: Resolver<Maybe<ResolversTypes['Card']>, ParentType, ContextType>;
  priority?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GuideCollaborationResolvers<ContextType = any, ParentType extends ResolversParentTypes['GuideCollaboration'] = ResolversParentTypes['GuideCollaboration']> = {
  cards?: Resolver<Maybe<Array<Maybe<ResolversTypes['GuideCard']>>>, ParentType, ContextType>;
  guide?: Resolver<Maybe<ResolversTypes['Guide']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GuideExpertiseResolvers<ContextType = any, ParentType extends ResolversParentTypes['GuideExpertise'] = ResolversParentTypes['GuideExpertise']> = {
  cards?: Resolver<Maybe<Array<Maybe<ResolversTypes['GuideCard']>>>, ParentType, ContextType>;
  guide?: Resolver<Maybe<ResolversTypes['Guide']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createSampleText?: Resolver<ResolversTypes['String'], ParentType, ContextType, Partial<MutationCreateSampleTextArgs>>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  card?: Resolver<Maybe<ResolversTypes['Card']>, ParentType, ContextType, Partial<QueryCardArgs>>;
  cards?: Resolver<Array<Maybe<ResolversTypes['Card']>>, ParentType, ContextType, Partial<QueryCardsArgs>>;
  greet?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  guide?: Resolver<Maybe<ResolversTypes['Guide']>, ParentType, ContextType, Partial<QueryGuideArgs>>;
  guides?: Resolver<Array<Maybe<ResolversTypes['Guide']>>, ParentType, ContextType, Partial<QueryGuidesArgs>>;
};

export interface UuidScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['UUID'], any> {
  name: 'UUID';
}

export type Resolvers<ContextType = any> = {
  Card?: CardResolvers<ContextType>;
  CardAditionalObjective?: CardAditionalObjectiveResolvers<ContextType>;
  CardContent?: CardContentResolvers<ContextType>;
  CardKeyObjective?: CardKeyObjectiveResolvers<ContextType>;
  Guide?: GuideResolvers<ContextType>;
  GuideCard?: GuideCardResolvers<ContextType>;
  GuideCollaboration?: GuideCollaborationResolvers<ContextType>;
  GuideExpertise?: GuideExpertiseResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  UUID?: GraphQLScalarType;
};

