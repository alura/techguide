import { Client } from '../client';
import { Exchange, Operation } from '../types';
export declare const cacheExchange: Exchange;
export declare const reexecuteOperation: (client: Client, operation: Operation) => void;
