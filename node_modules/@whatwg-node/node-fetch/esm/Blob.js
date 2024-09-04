import { PonyfillReadableStream } from './ReadableStream.js';
import { uint8ArrayToArrayBuffer } from './utils.js';
function getBlobPartAsBuffer(blobPart) {
    if (typeof blobPart === 'string') {
        return Buffer.from(blobPart);
    }
    else if (Buffer.isBuffer(blobPart)) {
        return blobPart;
    }
    else if (blobPart instanceof Uint8Array) {
        return Buffer.from(blobPart);
    }
    else if ('buffer' in blobPart) {
        return Buffer.from(blobPart.buffer, blobPart.byteOffset, blobPart.byteLength);
    }
    else {
        return Buffer.from(blobPart);
    }
}
function isBlob(obj) {
    return obj != null && typeof obj === 'object' && obj.arrayBuffer != null;
}
// Will be removed after v14 reaches EOL
// Needed because v14 doesn't have .stream() implemented
export class PonyfillBlob {
    constructor(blobParts, options) {
        this.blobParts = blobParts;
        this.type = (options === null || options === void 0 ? void 0 : options.type) || 'application/octet-stream';
        this.encoding = (options === null || options === void 0 ? void 0 : options.encoding) || 'utf8';
    }
    async buffer() {
        const bufferChunks = [];
        for (const blobPart of this.blobParts) {
            if (isBlob(blobPart)) {
                const arrayBuf = await blobPart.arrayBuffer();
                const buf = Buffer.from(arrayBuf, undefined, blobPart.size);
                bufferChunks.push(buf);
            }
            else {
                const buf = getBlobPartAsBuffer(blobPart);
                bufferChunks.push(buf);
            }
        }
        return Buffer.concat(bufferChunks);
    }
    async arrayBuffer() {
        const buffer = await this.buffer();
        return uint8ArrayToArrayBuffer(buffer);
    }
    async text() {
        let text = '';
        for (const blobPart of this.blobParts) {
            if (typeof blobPart === 'string') {
                text += blobPart;
            }
            else if ('text' in blobPart) {
                text += await blobPart.text();
            }
            else {
                const buf = getBlobPartAsBuffer(blobPart);
                text += buf.toString(this.encoding);
            }
        }
        return text;
    }
    get size() {
        let size = 0;
        for (const blobPart of this.blobParts) {
            if (typeof blobPart === 'string') {
                size += Buffer.byteLength(blobPart);
            }
            else if (isBlob(blobPart)) {
                size += blobPart.size;
            }
            else if ('length' in blobPart) {
                size += blobPart.length;
            }
            else if ('byteLength' in blobPart) {
                size += blobPart.byteLength;
            }
        }
        return size;
    }
    stream() {
        let partQueue = [];
        return new PonyfillReadableStream({
            start: controller => {
                partQueue = [...this.blobParts];
                if (partQueue.length === 0) {
                    controller.close();
                }
            },
            pull: async (controller) => {
                const blobPart = partQueue.pop();
                if (blobPart) {
                    if (isBlob(blobPart)) {
                        const arrayBuffer = await blobPart.arrayBuffer();
                        const buf = Buffer.from(arrayBuffer, undefined, blobPart.size);
                        controller.enqueue(buf);
                    }
                    else {
                        const buf = getBlobPartAsBuffer(blobPart);
                        controller.enqueue(buf);
                    }
                }
                else {
                    controller.close();
                }
            },
        });
    }
    slice() {
        throw new Error('Not implemented');
    }
}
