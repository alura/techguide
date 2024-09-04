/**
 * @param response A response. Supports fetch, node-fetch, and cross-fetch
 */
export default function responseIterator<T>(response: unknown): AsyncIterableIterator<T>;
