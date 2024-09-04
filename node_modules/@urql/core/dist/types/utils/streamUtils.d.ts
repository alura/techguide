import { Source } from 'wonka';
import { OperationResult, PromisifiedSource } from '../types';
export declare function withPromise<T extends OperationResult>(source$: Source<T>): PromisifiedSource<T>;
