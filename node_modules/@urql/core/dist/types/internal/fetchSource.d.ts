import { Source } from 'wonka';
import { Operation, OperationResult } from '../types';
export declare const makeFetchSource: (operation: Operation, url: string, fetchOptions: RequestInit) => Source<OperationResult>;
