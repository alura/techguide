"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PonyfillFile = void 0;
const Blob_js_1 = require("./Blob.js");
class PonyfillFile extends Blob_js_1.PonyfillBlob {
    constructor(fileBits, name, options) {
        super(fileBits, options);
        this.name = name;
        this.webkitRelativePath = '';
        this.lastModified = (options === null || options === void 0 ? void 0 : options.lastModified) || Date.now();
    }
}
exports.PonyfillFile = PonyfillFile;
