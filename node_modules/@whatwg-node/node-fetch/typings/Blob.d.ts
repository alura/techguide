/// <reference types="node" />
interface BlobOptions {
    /**
     * @default 'utf8'
     */
    encoding?: BufferEncoding | undefined;
    /**
     * The Blob content-type. The intent is for `type` to convey
     * the MIME media type of the data, however no validation of the type format
     * is performed.
     */
    type?: string | undefined;
}
export declare class PonyfillBlob implements Blob {
    private blobParts;
    type: string;
    private encoding;
    constructor(blobParts: BlobPart[], options?: BlobOptions);
    buffer(): Promise<Buffer>;
    arrayBuffer(): Promise<ArrayBuffer>;
    text(): Promise<string>;
    get size(): number;
    stream(): any;
    slice(): any;
}
export interface PonyfillBlob {
    prototype: Blob;
    new (blobParts?: BlobPart[], options?: BlobPropertyBag): Blob;
}
export {};
