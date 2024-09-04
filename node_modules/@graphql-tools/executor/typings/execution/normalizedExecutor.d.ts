import { MaybeAsyncIterable, ExecutionResult, MaybePromise } from '@graphql-tools/utils';
import { ExecutionArgs } from './execute.js';
export declare function normalizedExecutor<TData = any, TVariables = any, TContext = any>(args: ExecutionArgs<TData, TVariables, TContext>): MaybePromise<MaybeAsyncIterable<ExecutionResult<TData>>>;
