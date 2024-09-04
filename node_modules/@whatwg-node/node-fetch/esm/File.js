import { PonyfillBlob } from './Blob.js';
export class PonyfillFile extends PonyfillBlob {
    constructor(fileBits, name, options) {
        super(fileBits, options);
        this.name = name;
        this.webkitRelativePath = '';
        this.lastModified = (options === null || options === void 0 ? void 0 : options.lastModified) || Date.now();
    }
}
