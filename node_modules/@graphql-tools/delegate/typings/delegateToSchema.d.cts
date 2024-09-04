import { GraphQLSchema } from 'graphql';
import { Executor } from '@graphql-tools/utils';
import { IDelegateToSchemaOptions, IDelegateRequestOptions } from './types.cjs';
export declare function delegateToSchema<TContext extends Record<string, any> = Record<string, any>, TArgs extends Record<string, any> = any>(options: IDelegateToSchemaOptions<TContext, TArgs>): any;
export declare function delegateRequest<TContext extends Record<string, any> = Record<string, any>, TArgs extends Record<string, any> = any>(options: IDelegateRequestOptions<TContext, TArgs>): any;
export declare const createDefaultExecutor: (schema: GraphQLSchema) => Executor;
