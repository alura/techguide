/// <reference types="node" />
import type { Readable } from 'stream';
interface GraphQLUpload {
    filename: string;
    mimetype: string;
    createReadStream: () => Readable;
}
export declare function isGraphQLUpload(upload: any): upload is GraphQLUpload;
export {};
