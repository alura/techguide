const fetch = globalThis.fetch;
const Request = globalThis.Request;
const Response = globalThis.Response;
const Headers = globalThis.Headers;
const FormData = globalThis.FormData;
const AbortSignal = globalThis.AbortSignal;
const AbortController = globalThis.AbortController;
const ReadableStream = globalThis.ReadableStream;
const WritableStream = globalThis.WritableStream;
const TransformStream = globalThis.TransformStream;
const Blob = globalThis.Blob;
const File = globalThis.File;
const crypto = globalThis.crypto;
const btoa = globalThis.btoa;
const TextDecoder = globalThis.TextDecoder;
const TextEncoder = globalThis.TextEncoder;
const URLPattern = (globalThis as any).URLPattern;
const URL = globalThis.URL;
const URLSearchParams = globalThis.URLSearchParams;

export const createFetch = () => globalThis;
export {
  fetch,
  Headers,
  Request,
  Response,
  FormData,
  AbortSignal,
  AbortController,
  ReadableStream,
  WritableStream,
  TransformStream,
  Blob,
  File,
  crypto,
  btoa,
  TextDecoder,
  TextEncoder,
  URLPattern,
  URL,
  URLSearchParams,
};
