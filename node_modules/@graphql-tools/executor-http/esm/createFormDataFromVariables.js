import { isAsyncIterable, isPromise } from '@graphql-tools/utils';
import { extractFiles, isExtractableFile } from 'extract-files';
import { isGraphQLUpload } from './isGraphQLUpload.js';
import { ValueOrPromise } from 'value-or-promise';
import { FormData as DefaultFormData, File as DefaultFile } from '@whatwg-node/fetch';
export function createFormDataFromVariables({ query, variables, operationName, extensions, }, { File: FileCtor = DefaultFile, FormData: FormDataCtor = DefaultFormData, }) {
    const vars = Object.assign({}, variables);
    const { clone, files } = extractFiles(vars, 'variables', ((v) => isExtractableFile(v) ||
        (v === null || v === void 0 ? void 0 : v.promise) ||
        isAsyncIterable(v) ||
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
            if (isPromise(upload)) {
                return upload.then((resolvedUpload) => handleUpload(resolvedUpload, i));
                // If Blob
            }
            else if (isBlob(upload)) {
                form.append(indexStr, upload, filename);
            }
            else if (isGraphQLUpload(upload)) {
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
    return ValueOrPromise.all(uploads.map((upload, i) => new ValueOrPromise(() => handleUpload(upload, i))))
        .then(() => form)
        .resolve();
}
function isBlob(obj) {
    return typeof obj.arrayBuffer === 'function';
}
