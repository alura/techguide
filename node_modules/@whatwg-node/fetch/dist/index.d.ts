/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference types="urlpattern-polyfill" />

declare type _URLPattern = typeof URLPattern

declare module '@whatwg-node/fetch' {
  export const fetch: typeof globalThis.fetch;
  export const Request: typeof globalThis.Request;
  export const Response: typeof globalThis.Response & {
    json(data: any, init?: ResponseInit): globalThis.Response;
  };
  export const Headers: typeof globalThis.Headers;
  export const FormData: typeof globalThis.FormData;
  export const AbortSignal: typeof globalThis.AbortSignal;
  export const AbortController: typeof globalThis.AbortController;
  export const ReadableStream: typeof globalThis.ReadableStream;
  export const WritableStream: typeof globalThis.WritableStream;
  export const TransformStream: typeof globalThis.TransformStream;
  export const Blob: typeof globalThis.Blob;
  export const File: typeof globalThis.File;
  export const crypto: typeof globalThis.crypto;
  export const btoa: typeof globalThis.btoa;
  export const TextDecoder: typeof globalThis.TextDecoder;
  export const TextEncoder: typeof globalThis.TextEncoder;
  export const URL: typeof globalThis.URL;
  export const URLSearchParams: typeof globalThis.URLSearchParams;
  export const URLPattern: _URLPattern;
  export interface FormDataLimits {
    /* Max field name size (in bytes). Default: 100. */
    fieldNameSize?: number;
    /* Max field value size (in bytes). Default: 1MB. */
    fieldSize?: number;
    /* Max number of fields. Default: Infinity. */
    fields?: number;
    /* For multipart forms, the max file size (in bytes). Default: Infinity. */
    fileSize?: number;
    /* For multipart forms, the max number of file fields. Default: Infinity. */
    files?: number;
    /* For multipart forms, the max number of parts (fields + files). Default: Infinity. */
    parts?: number;
    /* For multipart forms, the max number of header key-value pairs to parse. Default: 2000. */
    headerSize?: number;
  }
  export const createFetch: (opts?: {
    useNodeFetch?: boolean;
    formDataLimits?: FormDataLimits;
  }) => {
    fetch: typeof fetch;
    Request: typeof Request;
    Response: typeof Response;
    Headers: typeof Headers;
    FormData: typeof FormData;
    AbortSignal: typeof AbortSignal;
    AbortController: typeof AbortController;
    ReadableStream: typeof ReadableStream;
    WritableStream: typeof WritableStream;
    TransformStream: typeof TransformStream;
    Blob: typeof Blob;
    File: typeof File;
    crypto: typeof crypto;
    btoa: typeof btoa;
    TextEncoder: typeof TextEncoder;
    TextDecoder: typeof TextDecoder;
    URLPattern: typeof URLPattern;
    URL: typeof URL;
    URLSearchParams: typeof URLSearchParams;
  };
}