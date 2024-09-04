import { ExecutionResult } from '@graphql-tools/utils';
export declare function handleMultipartMixedResponse(response: Response, controller?: AbortController): Promise<ExecutionResult<any, any> | AsyncIterable<ExecutionResult<any, any> | undefined>>;
