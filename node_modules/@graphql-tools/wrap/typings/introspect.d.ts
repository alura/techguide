import { GraphQLSchema, buildClientSchema, IntrospectionOptions, ParseOptions } from 'graphql';
import { AsyncExecutor, Executor, SyncExecutor, MaybePromise } from '@graphql-tools/utils';
export type SchemaFromExecutorOptions = Partial<IntrospectionOptions> & Parameters<typeof buildClientSchema>[1] & ParseOptions;
export declare const introspectSchema: typeof schemaFromExecutor;
export declare function schemaFromExecutor(executor: SyncExecutor, context?: Record<string, any>, options?: SchemaFromExecutorOptions): GraphQLSchema;
export declare function schemaFromExecutor(executor: AsyncExecutor, context?: Record<string, any>, options?: SchemaFromExecutorOptions): Promise<GraphQLSchema>;
export declare function schemaFromExecutor(executor: Executor, context?: Record<string, any>, options?: SchemaFromExecutorOptions): MaybePromise<GraphQLSchema>;
