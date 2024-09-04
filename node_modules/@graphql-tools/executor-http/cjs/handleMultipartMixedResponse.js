"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleMultipartMixedResponse = void 0;
const node_1 = require("meros/node");
const browser_1 = require("meros/browser");
const utils_1 = require("@graphql-tools/utils");
const merge_1 = require("dset/merge");
const addCancelToResponseStream_js_1 = require("./addCancelToResponseStream.js");
function isIncomingMessage(body) {
    return body != null && typeof body === 'object' && 'pipe' in body;
}
async function handleMultipartMixedResponse(response, controller) {
    const body = response.body;
    const contentType = response.headers.get('content-type') || '';
    let asyncIterator;
    if (isIncomingMessage(body)) {
        // Meros/node expects headers as an object map with the content-type prop
        body.headers = {
            'content-type': contentType,
        };
        // And it expects `IncomingMessage` and `node-fetch` returns `body` as `Promise<PassThrough>`
        const result = await (0, node_1.meros)(body);
        if ('next' in result) {
            asyncIterator = result;
        }
    }
    else {
        // Nothing is needed for regular `Response`.
        const result = await (0, browser_1.meros)(response);
        if ('next' in result) {
            asyncIterator = result;
        }
    }
    const executionResult = {};
    function handleResult(result) {
        if (result.path) {
            const path = ['data', ...result.path];
            executionResult.data = executionResult.data || {};
            if (result.items) {
                for (const item of result.items) {
                    (0, merge_1.dset)(executionResult, path, item);
                }
            }
            if (result.data) {
                (0, merge_1.dset)(executionResult, ['data', ...result.path], result.data);
            }
        }
        else if (result.data) {
            executionResult.data = executionResult.data || {};
            Object.assign(executionResult.data, result.data);
        }
        if (result.errors) {
            executionResult.errors = executionResult.errors || [];
            executionResult.errors.push(...result.errors);
        }
        if (result.incremental) {
            result.incremental.forEach(handleResult);
        }
    }
    if (asyncIterator == null) {
        return executionResult;
    }
    const resultStream = (0, utils_1.mapAsyncIterator)(asyncIterator, (part) => {
        if (part.json) {
            const chunk = part.body;
            handleResult(chunk);
            return executionResult;
        }
    });
    if (controller) {
        return (0, addCancelToResponseStream_js_1.addCancelToResponseStream)(resultStream, controller);
    }
    return resultStream;
}
exports.handleMultipartMixedResponse = handleMultipartMixedResponse;
