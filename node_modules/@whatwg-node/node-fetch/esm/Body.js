import { Readable } from 'stream';
import busboy from 'busboy';
import { PonyfillBlob } from './Blob.js';
import { PonyfillFile } from './File.js';
import { getStreamFromFormData, PonyfillFormData } from './FormData.js';
import { PonyfillReadableStream } from './ReadableStream.js';
import { uint8ArrayToArrayBuffer } from './utils.js';
var BodyInitType;
(function (BodyInitType) {
    BodyInitType["ReadableStream"] = "ReadableStream";
    BodyInitType["Blob"] = "Blob";
    BodyInitType["FormData"] = "FormData";
    BodyInitType["ArrayBuffer"] = "ArrayBuffer";
    BodyInitType["String"] = "String";
    BodyInitType["Readable"] = "Readable";
    BodyInitType["Buffer"] = "Buffer";
    BodyInitType["Uint8Array"] = "Uint8Array";
})(BodyInitType || (BodyInitType = {}));
export class PonyfillBody {
    constructor(bodyInit, options = {}) {
        this.bodyInit = bodyInit;
        this.options = options;
        this.bodyUsed = false;
        this.contentType = null;
        this.contentLength = null;
        this._bodyFactory = () => null;
        this._generatedBody = null;
        const { bodyFactory, contentType, contentLength, bodyType } = processBodyInit(bodyInit);
        this._bodyFactory = bodyFactory;
        this.contentType = contentType;
        this.contentLength = contentLength;
        this.bodyType = bodyType;
    }
    generateBody() {
        if (this._generatedBody) {
            return this._generatedBody;
        }
        const body = this._bodyFactory();
        this._generatedBody = body;
        return body;
    }
    get body() {
        const _body = this.generateBody();
        if (_body != null) {
            const ponyfillReadableStream = _body;
            const readable = _body.readable;
            return new Proxy(_body.readable, {
                get(_, prop) {
                    if (prop in ponyfillReadableStream) {
                        const ponyfillReadableStreamProp = ponyfillReadableStream[prop];
                        if (typeof ponyfillReadableStreamProp === 'function') {
                            return ponyfillReadableStreamProp.bind(ponyfillReadableStream);
                        }
                        return ponyfillReadableStreamProp;
                    }
                    if (prop in readable) {
                        const readableProp = readable[prop];
                        if (typeof readableProp === 'function') {
                            return readableProp.bind(readable);
                        }
                        return readableProp;
                    }
                },
            });
        }
        return null;
    }
    async arrayBuffer() {
        if (this.bodyType === BodyInitType.ArrayBuffer) {
            return this.bodyInit;
        }
        if (this.bodyType === BodyInitType.Uint8Array || this.bodyType === BodyInitType.Buffer) {
            const typedBodyInit = this.bodyInit;
            return uint8ArrayToArrayBuffer(typedBodyInit);
        }
        if (this.bodyType === BodyInitType.String) {
            const buffer = Buffer.from(this.bodyInit);
            return uint8ArrayToArrayBuffer(buffer);
        }
        if (this.bodyType === BodyInitType.Blob) {
            const blob = this.bodyInit;
            const arrayBuffer = await blob.arrayBuffer();
            return arrayBuffer;
        }
        const blob = await this.blob();
        return blob.arrayBuffer();
    }
    async _collectChunksFromReadable() {
        const chunks = [];
        const _body = this.generateBody();
        if (_body) {
            for await (const chunk of _body.readable) {
                chunks.push(chunk);
            }
        }
        return chunks;
    }
    async blob() {
        if (this.bodyType === BodyInitType.Blob) {
            return this.bodyInit;
        }
        if (this.bodyType === BodyInitType.String ||
            this.bodyType === BodyInitType.Buffer ||
            this.bodyType === BodyInitType.Uint8Array) {
            const bodyInitTyped = this.bodyInit;
            return new PonyfillBlob([bodyInitTyped], {
                type: this.contentType || '',
            });
        }
        if (this.bodyType === BodyInitType.ArrayBuffer) {
            const bodyInitTyped = this.bodyInit;
            const buf = Buffer.from(bodyInitTyped, undefined, bodyInitTyped.byteLength);
            return new PonyfillBlob([buf], {
                type: this.contentType || '',
            });
        }
        const chunks = await this._collectChunksFromReadable();
        return new PonyfillBlob(chunks, {
            type: this.contentType || '',
        });
    }
    formData(opts) {
        if (this.bodyType === BodyInitType.FormData) {
            return Promise.resolve(this.bodyInit);
        }
        const formData = new PonyfillFormData();
        const _body = this.generateBody();
        if (_body == null) {
            return Promise.resolve(formData);
        }
        const formDataLimits = {
            ...this.options.formDataLimits,
            ...opts === null || opts === void 0 ? void 0 : opts.formDataLimits,
        };
        return new Promise((resolve, reject) => {
            const bb = busboy({
                headers: {
                    'content-type': this.contentType || '',
                },
                limits: formDataLimits,
                defParamCharset: 'utf-8',
            });
            bb.on('field', (name, value, { nameTruncated, valueTruncated }) => {
                if (nameTruncated) {
                    reject(new Error(`Field name size exceeded: ${formDataLimits === null || formDataLimits === void 0 ? void 0 : formDataLimits.fieldNameSize} bytes`));
                }
                if (valueTruncated) {
                    reject(new Error(`Field value size exceeded: ${formDataLimits === null || formDataLimits === void 0 ? void 0 : formDataLimits.fieldSize} bytes`));
                }
                formData.set(name, value);
            });
            bb.on('fieldsLimit', () => {
                reject(new Error(`Fields limit exceeded: ${formDataLimits === null || formDataLimits === void 0 ? void 0 : formDataLimits.fields}`));
            });
            bb.on('file', (name, fileStream, { filename, mimeType }) => {
                const chunks = [];
                fileStream.on('limit', () => {
                    reject(new Error(`File size limit exceeded: ${formDataLimits === null || formDataLimits === void 0 ? void 0 : formDataLimits.fileSize} bytes`));
                });
                fileStream.on('data', chunk => {
                    chunks.push(Buffer.from(chunk));
                });
                fileStream.on('close', () => {
                    if (fileStream.truncated) {
                        reject(new Error(`File size limit exceeded: ${formDataLimits === null || formDataLimits === void 0 ? void 0 : formDataLimits.fileSize} bytes`));
                    }
                    const file = new PonyfillFile(chunks, filename, { type: mimeType });
                    formData.set(name, file);
                });
            });
            bb.on('filesLimit', () => {
                reject(new Error(`Files limit exceeded: ${formDataLimits === null || formDataLimits === void 0 ? void 0 : formDataLimits.files}`));
            });
            bb.on('partsLimit', () => {
                reject(new Error(`Parts limit exceeded: ${formDataLimits === null || formDataLimits === void 0 ? void 0 : formDataLimits.parts}`));
            });
            bb.on('close', () => {
                resolve(formData);
            });
            bb.on('error', err => {
                reject(err);
            });
            _body === null || _body === void 0 ? void 0 : _body.readable.pipe(bb);
        });
    }
    async buffer() {
        if (this.bodyType === BodyInitType.Buffer) {
            return this.bodyInit;
        }
        if (this.bodyType === BodyInitType.String) {
            return Buffer.from(this.bodyInit);
        }
        if (this.bodyType === BodyInitType.Uint8Array || this.bodyType === BodyInitType.ArrayBuffer) {
            const bodyInitTyped = this.bodyInit;
            const buffer = Buffer.from(bodyInitTyped, 'byteOffset' in bodyInitTyped ? bodyInitTyped.byteOffset : undefined, bodyInitTyped.byteLength);
            return buffer;
        }
        if (this.bodyType === BodyInitType.Blob) {
            if (this.bodyInit instanceof PonyfillBlob) {
                return this.bodyInit.buffer();
            }
            const bodyInitTyped = this.bodyInit;
            const buffer = Buffer.from(await bodyInitTyped.arrayBuffer(), undefined, bodyInitTyped.size);
            return buffer;
        }
        const chunks = await this._collectChunksFromReadable();
        return Buffer.concat(chunks);
    }
    async json() {
        const text = await this.text();
        return JSON.parse(text);
    }
    async text() {
        if (this.bodyType === BodyInitType.String) {
            return this.bodyInit;
        }
        const buffer = await this.buffer();
        return buffer.toString('utf-8');
    }
}
function processBodyInit(bodyInit) {
    if (bodyInit == null) {
        return {
            bodyFactory: () => null,
            contentType: null,
            contentLength: null,
        };
    }
    if (typeof bodyInit === 'string') {
        return {
            bodyType: BodyInitType.String,
            contentType: 'text/plain;charset=UTF-8',
            contentLength: Buffer.byteLength(bodyInit),
            bodyFactory() {
                const readable = Readable.from(bodyInit);
                return new PonyfillReadableStream(readable);
            },
        };
    }
    if (bodyInit instanceof PonyfillReadableStream) {
        return {
            bodyType: BodyInitType.ReadableStream,
            bodyFactory: () => bodyInit,
            contentType: null,
            contentLength: null,
        };
    }
    if (bodyInit instanceof PonyfillBlob) {
        return {
            bodyType: BodyInitType.Blob,
            contentType: bodyInit.type,
            contentLength: bodyInit.size,
            bodyFactory() {
                return bodyInit.stream();
            },
        };
    }
    if (bodyInit instanceof Buffer) {
        const contentLength = bodyInit.length;
        return {
            bodyType: BodyInitType.Buffer,
            contentLength,
            contentType: null,
            bodyFactory() {
                const readable = Readable.from(bodyInit);
                const body = new PonyfillReadableStream(readable);
                return body;
            },
        };
    }
    if (bodyInit instanceof Uint8Array) {
        const contentLength = bodyInit.byteLength;
        return {
            bodyType: BodyInitType.Uint8Array,
            contentLength,
            contentType: null,
            bodyFactory() {
                const readable = Readable.from(bodyInit);
                const body = new PonyfillReadableStream(readable);
                return body;
            },
        };
    }
    if ('buffer' in bodyInit) {
        const contentLength = bodyInit.byteLength;
        return {
            contentLength,
            contentType: null,
            bodyFactory() {
                const buffer = Buffer.from(bodyInit);
                const readable = Readable.from(buffer);
                const body = new PonyfillReadableStream(readable);
                return body;
            },
        };
    }
    if (bodyInit instanceof ArrayBuffer) {
        const contentLength = bodyInit.byteLength;
        return {
            bodyType: BodyInitType.ArrayBuffer,
            contentType: null,
            contentLength,
            bodyFactory() {
                const buffer = Buffer.from(bodyInit, undefined, bodyInit.byteLength);
                const readable = Readable.from(buffer);
                const body = new PonyfillReadableStream(readable);
                return body;
            },
        };
    }
    if (bodyInit instanceof Readable) {
        return {
            bodyType: BodyInitType.Readable,
            contentType: null,
            contentLength: null,
            bodyFactory() {
                const body = new PonyfillReadableStream(bodyInit);
                return body;
            },
        };
    }
    if ('stream' in bodyInit) {
        return {
            contentType: bodyInit.type,
            contentLength: bodyInit.size,
            bodyFactory() {
                const bodyStream = bodyInit.stream();
                const body = new PonyfillReadableStream(bodyStream);
                return body;
            },
        };
    }
    if ('sort' in bodyInit) {
        const contentType = 'application/x-www-form-urlencoded;charset=UTF-8';
        return {
            bodyType: BodyInitType.String,
            contentType,
            contentLength: null,
            bodyFactory() {
                const body = new PonyfillReadableStream(Readable.from(bodyInit.toString()));
                return body;
            },
        };
    }
    if ('forEach' in bodyInit) {
        const boundary = Math.random().toString(36).substr(2);
        const contentType = `multipart/form-data; boundary=${boundary}`;
        return {
            contentType,
            contentLength: null,
            bodyFactory() {
                return getStreamFromFormData(bodyInit, boundary);
            },
        };
    }
    if (bodyInit[Symbol.iterator] || bodyInit[Symbol.asyncIterator]) {
        return {
            contentType: null,
            contentLength: null,
            bodyFactory() {
                const readable = Readable.from(bodyInit);
                return new PonyfillReadableStream(readable);
            },
        };
    }
    throw new Error('Unknown body type');
}
