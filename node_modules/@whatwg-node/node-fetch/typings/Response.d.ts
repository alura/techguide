import { BodyPonyfillInit, PonyfillBody, PonyfillBodyOptions } from './Body.js';
import { PonyfillHeadersInit } from './Headers.js';
export type ResponsePonyfilInit = PonyfillBodyOptions & Omit<ResponseInit, 'headers'> & {
    url?: string;
    redirected?: boolean;
    headers?: PonyfillHeadersInit;
    type?: ResponseType;
};
export declare class PonyfillResponse<TJSON = any> extends PonyfillBody<TJSON> implements Response {
    constructor(body?: BodyPonyfillInit | null, init?: ResponsePonyfilInit);
    headers: Headers;
    get ok(): boolean;
    status: number;
    statusText: string;
    url: string;
    redirected: boolean;
    type: ResponseType;
    clone(): PonyfillResponse<any>;
    static error(): PonyfillResponse<any>;
    static redirect(url: string, status?: number): PonyfillResponse<any>;
    static json<T = any>(data: T, init?: RequestInit): PonyfillResponse<T>;
}
