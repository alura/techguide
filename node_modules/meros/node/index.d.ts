import type { IncomingMessage } from 'node:http';
import type { Options, Part } from 'meros';

/**
 * Yield immediately for every part made available on the response. If the `content-type` of the
 * response isn't a multipart body, then we'll resolve with {@link IncomingMessage}.
 *
 * @example
 *
 * ```js
 * const response = await new Promise((resolve) => {
 *   const request = http.get(`http://my-domain/mock-ep`, (response) => {
 *   	resolve(response);
 *   });
 *   request.end();
 * });
 *
 * const parts = await meros(response);
 *
 * for await (const part of parts) {
 *     // do something with this part
 * }
 * ```
 */
export function meros<T = object>(
	response: IncomingMessage,
	options: { multiple: true },
): Promise<IncomingMessage | AsyncGenerator<ReadonlyArray<Part<T, Buffer>>>>;
export function meros<T = object>(
	response: IncomingMessage,
	options?: { multiple: false },
): Promise<IncomingMessage | AsyncGenerator<Part<T, Buffer>>>;
export function meros<T = object>(
	response: IncomingMessage,
	options?: Options,
): Promise<IncomingMessage | AsyncGenerator<Part<T, Buffer>>>;
