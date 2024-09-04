import { ExecutionResult, Operation, OperationResult } from '../types';
export declare const makeResult: (operation: Operation, result: ExecutionResult, response?: any) => OperationResult;
export declare const mergeResultPatch: (prevResult: OperationResult, patch: ExecutionResult, response?: any) => OperationResult;
export declare const makeErrorResult: (operation: Operation, error: Error, response?: any) => OperationResult;
