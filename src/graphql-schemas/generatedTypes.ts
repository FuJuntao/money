import type { GraphQLResolveInfo } from 'graphql';
import type { GraphqlContextType } from '../graphql/graphqlContext';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type AccountType =
  | 'credit_card'
  | 'payment_account'
  | 'asset';

export type Account = {
  __typename?: 'Account';
  id: Scalars['Int'];
  name: Scalars['String'];
  type: AccountType;
};

export type Transaction = {
  __typename?: 'Transaction';
  id: Scalars['Int'];
  from?: Maybe<Scalars['Int']>;
  to?: Maybe<Scalars['Int']>;
  amount: Scalars['Int'];
};

export type Query = {
  __typename?: 'Query';
  accounts: Array<Maybe<Account>>;
  transactions: Array<Maybe<Transaction>>;
};

export type CreateAccountInput = {
  name: Scalars['String'];
  type: AccountType;
};

export type UpdateAccountInput = {
  id: Scalars['Int'];
  name: Scalars['String'];
  type: AccountType;
};

export type Mutation = {
  __typename?: 'Mutation';
  createAccount?: Maybe<Account>;
  updateAccount?: Maybe<Account>;
};


export type MutationCreateAccountArgs = {
  input: CreateAccountInput;
};


export type MutationUpdateAccountArgs = {
  input: UpdateAccountInput;
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> = LegacyStitchingResolver<TResult, TParent, TContext, TArgs> | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

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
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

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
  AccountType: AccountType;
  Account: ResolverTypeWrapper<Account>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Transaction: ResolverTypeWrapper<Transaction>;
  Query: ResolverTypeWrapper<{}>;
  CreateAccountInput: CreateAccountInput;
  UpdateAccountInput: UpdateAccountInput;
  Mutation: ResolverTypeWrapper<{}>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Account: Account;
  Int: Scalars['Int'];
  String: Scalars['String'];
  Transaction: Transaction;
  Query: {};
  CreateAccountInput: CreateAccountInput;
  UpdateAccountInput: UpdateAccountInput;
  Mutation: {};
  Boolean: Scalars['Boolean'];
};

export type AccountResolvers<ContextType = GraphqlContextType, ParentType extends ResolversParentTypes['Account'] = ResolversParentTypes['Account']> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['AccountType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TransactionResolvers<ContextType = GraphqlContextType, ParentType extends ResolversParentTypes['Transaction'] = ResolversParentTypes['Transaction']> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  from?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  to?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  amount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = GraphqlContextType, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  accounts?: Resolver<Array<Maybe<ResolversTypes['Account']>>, ParentType, ContextType>;
  transactions?: Resolver<Array<Maybe<ResolversTypes['Transaction']>>, ParentType, ContextType>;
};

export type MutationResolvers<ContextType = GraphqlContextType, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createAccount?: Resolver<Maybe<ResolversTypes['Account']>, ParentType, ContextType, RequireFields<MutationCreateAccountArgs, 'input'>>;
  updateAccount?: Resolver<Maybe<ResolversTypes['Account']>, ParentType, ContextType, RequireFields<MutationUpdateAccountArgs, 'input'>>;
};

export type Resolvers<ContextType = GraphqlContextType> = {
  Account?: AccountResolvers<ContextType>;
  Transaction?: TransactionResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = GraphqlContextType> = Resolvers<ContextType>;
