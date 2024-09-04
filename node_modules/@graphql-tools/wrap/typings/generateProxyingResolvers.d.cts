import { GraphQLFieldResolver } from 'graphql';
import { SubschemaConfig, ICreateProxyingResolverOptions } from '@graphql-tools/delegate';
export declare function generateProxyingResolvers<TContext extends Record<string, any>>(subschemaConfig: SubschemaConfig<any, any, any, TContext>): Record<string, Record<string, GraphQLFieldResolver<any, any>>>;
export declare function defaultCreateProxyingResolver<TContext extends Record<string, any>>({ subschemaConfig, operation, }: ICreateProxyingResolverOptions<TContext>): GraphQLFieldResolver<any, any>;
