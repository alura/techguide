/**
 *
 * utils
 *
 */
import { GraphQLError } from 'graphql';
/** @private */
export declare function extendedTypeof(val: unknown): 'string' | 'number' | 'bigint' | 'boolean' | 'symbol' | 'undefined' | 'object' | 'function' | 'array' | 'null';
/** @private */
export declare function isObject(val: unknown): val is Record<PropertyKey, unknown>;
/** @private */
export declare function isAsyncIterable<T = unknown>(val: unknown): val is AsyncIterable<T>;
/** @private */
export declare function isAsyncGenerator<T = unknown>(val: unknown): val is AsyncGenerator<T>;
/** @private */
export declare function areGraphQLErrors(obj: unknown): obj is readonly GraphQLError[];
/**
 * Limits the WebSocket close event reason to not exceed a length of one frame.
 * Reference: https://datatracker.ietf.org/doc/html/rfc6455#section-5.2.
 *
 * @private
 */
export declare function limitCloseReason(reason: string, whenTooLong: string): string;
