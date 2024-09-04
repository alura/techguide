"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFormDataFromVariables = void 0;
const utils_1 = require("@graphql-tools/utils");
const extract_files_1 = require("extract-files");
const isGraphQLUpload_js_1 = require("./isGraphQLUpload.js");
const value_or_promise_1 = require("value-or-promise");
const fetch_1 = require("@whatwg-node/fetch");
function createFormDataFromVariables({ query, variables, operationName, extensions, }, { File: FileCtor = fetch_1.File, FormData: FormDataCtor = fetch_1.FormData, }) {
    const vars = Object.assign({}, variables);
    const { clone, files } = (0, extract_files_1.extractFiles)(vars, 'variables', ((v) => (0, extract_files_1.isExtractableFile)(v) ||
        (v === null || v === void 0 ? void 0 : v.promise) ||
        (0, utils_1.isAsyncIterable)(v) ||
        (v === null || v === void 0 ? void 0 : v.then) ||
        typeof (v === null || v === void 0 ? void 0 : v.arrayBuffer) === 'function'));
    if (files.size === 0) {
        return JSON.stringify({
            query,
            variables,
            operationName,
            extensions,
        });
    }
    const map = {};
    const uploads = [];
    let currIndex = 0;
    for (const [file, curr] of files) {
        map[currIndex] = curr;
        uploads[currIndex] = file;
        currIndex++;
    }
    const form = new FormDataCtor();
    form.append('operations', JSON.stringify({
        query,
        variables: clone,
        operationName,
        extensions,
    }));
    form.append('map', JSON.stringify(map));
    function handleUpload(upload, i) {
        const indexStr = i.toString();
        if (upload != null) {
            const filename = upload.filename || upload.name || upload.path || `blob-${indexStr}`;
            if ((0, utils_1.isPromise)(upload)) {
                return upload.then((resolvedUpload) => handleUpload(resolvedUpload, i));
                // If Blob
            }
            else if (isBlob(upload)) {
                form.append(indexStr, upload, filename);
            }
            else if ((0, isGraphQLUpload_js_1.isGraphQLUpload)(upload)) {
                const stream = upload.createReadStream();
                const chunks = [];
                return Promise.resolve().then(async () => {
                    for await (const chunk of stream) {
                        if (chunk) {
                            chunks.push(...chunk);
                        }
                    }
                    const blobPart = new Uint8Array(chunks);
                    form.append(indexStr, new FileCtor([blobPart], filename, { type: upload.mimetype }), filename);
                });
            }
            else {
                form.append(indexStr, new FileCtor([upload], filename), filename);
            }
        }
    }
    return value_or_promise_1.ValueOrPromise.all(uploads.map((upload, i) => new value_or_promise_1.ValueOrPromise(() => handleUpload(upload, i))))
        .then(() => form)
        .resolve();
}
exports.createFormDataFromVariables = createFormDataFromVariables;
function isBlob(obj) {
    return typeof obj.arrayBuffer === 'function';
}
