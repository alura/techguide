import { ExecutionResult } from '@graphql-tools/utils';
export declare function isReadableStream(value: any): value is ReadableStream;
export declare function handleEventStreamResponse(response: Response, controller?: AbortController): AsyncIterable<ExecutionResult>;
