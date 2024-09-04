import { ExecutionResult } from '@graphql-tools/utils';
/**
 * Split and transform result of the query produced by the `merge` function
 */
export declare function splitResult({ data, errors }: ExecutionResult, numResults: number): Array<ExecutionResult>;
