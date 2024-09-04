import type { Options, Part } from 'meros';

/**
 * Yield immediately for every part made available on the response. If the `content-type` of the
 * response isn't a multipart body, then we'll resolve with {@link Response}.
 *
 * @example
 *
 * ```js
 * const parts = await fetch('/fetch-multipart')
 *      .then(meros);
 *
 * for await (const part of parts) {
 *     // do something with this part
 * }
 * ```
 */
export function meros<T = object>(
	response: Response,
	options: { multiple: true },
): Promise<Response | AsyncGenerator<ReadonlyArray<Part<T, string>>>>;
export function meros<T = object>(
	response: Response,
	options?: { multiple: false },
): Promise<Response | AsyncGenerator<Part<T, string>>>;
export function meros<T = object>(
	response: Response,
	options?: Options,
): Promise<Response | AsyncGenerator<Part<T, string>>>;
