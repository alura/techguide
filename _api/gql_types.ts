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

export type Blocks = {
  __typename?: 'Blocks';
  id?: Maybe<Scalars['String']>;
  priority?: Maybe<Scalars['Int']>;
  slug?: Maybe<Scalars['String']>;
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
  expertises?: Maybe<Array<Maybe<GuideExpertise>>>;
  id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  slug?: Maybe<Scalars['String']>;
};

export type GuideExpertise = {
  __typename?: 'GuideExpertise';
  blocks?: Maybe<Array<Maybe<Blocks>>>;
  name?: Maybe<Scalars['String']>;
};

export type GuideFilters = {
  id?: InputMaybe<FieldFilter>;
  name?: InputMaybe<FieldFilter>;
  slug?: InputMaybe<FieldFilter>;
};

export type GuideInput = {
  slug?: InputMaybe<Scalars['String']>;
};

export type GuidesInput = {
  filter?: InputMaybe<GuideFilters>;
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
  Blocks: ResolverTypeWrapper<Blocks>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  CreateSampleTextInput: CreateSampleTextInput;
  FieldFilter: FieldFilter;
  Guide: ResolverTypeWrapper<Guide>;
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
  Blocks: Blocks;
  Boolean: Scalars['Boolean'];
  CreateSampleTextInput: CreateSampleTextInput;
  FieldFilter: FieldFilter;
  Guide: Guide;
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

export type BlocksResolvers<ContextType = any, ParentType extends ResolversParentTypes['Blocks'] = ResolversParentTypes['Blocks']> = {
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  priority?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  slug?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GuideResolvers<ContextType = any, ParentType extends ResolversParentTypes['Guide'] = ResolversParentTypes['Guide']> = {
  expertises?: Resolver<Maybe<Array<Maybe<ResolversTypes['GuideExpertise']>>>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  slug?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GuideExpertiseResolvers<ContextType = any, ParentType extends ResolversParentTypes['GuideExpertise'] = ResolversParentTypes['GuideExpertise']> = {
  blocks?: Resolver<Maybe<Array<Maybe<ResolversTypes['Blocks']>>>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createSampleText?: Resolver<ResolversTypes['String'], ParentType, ContextType, Partial<MutationCreateSampleTextArgs>>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  greet?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  guide?: Resolver<Maybe<ResolversTypes['Guide']>, ParentType, ContextType, Partial<QueryGuideArgs>>;
  guides?: Resolver<Array<Maybe<ResolversTypes['Guide']>>, ParentType, ContextType, Partial<QueryGuidesArgs>>;
};

export interface UuidScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['UUID'], any> {
  name: 'UUID';
}

export type Resolvers<ContextType = any> = {
  Blocks?: BlocksResolvers<ContextType>;
  Guide?: GuideResolvers<ContextType>;
  GuideExpertise?: GuideExpertiseResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  UUID?: GraphQLScalarType;
};

