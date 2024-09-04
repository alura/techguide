import { BodyPonyfillInit, PonyfillBody, PonyfillBodyOptions } from './Body.cjs';
import { PonyfillHeadersInit } from './Headers.cjs';
export type RequestPonyfillInit = PonyfillBodyOptions & Omit<RequestInit, 'body' | 'headers'> & {
    body?: BodyPonyfillInit | null;
    headers?: PonyfillHeadersInit;
    headersSerializer?: HeadersSerializer;
};
type HeadersSerializer = (headers: Headers) => Record<string, string>;
export declare class PonyfillRequest<TJSON = any> extends PonyfillBody<TJSON> implements Request {
    constructor(input: RequestInfo | URL, options?: RequestPonyfillInit);
    headersSerializer: HeadersSerializer;
    cache: RequestCache;
    credentials: RequestCredentials;
    destination: RequestDestination;
    headers: Headers;
    integrity: string;
    keepalive: boolean;
    method: string;
    mode: RequestMode;
    priority: string;
    redirect: RequestRedirect;
    referrer: string;
    referrerPolicy: ReferrerPolicy;
    url: string;
    signal: AbortSignal;
    clone(): Request;
}
export {};
