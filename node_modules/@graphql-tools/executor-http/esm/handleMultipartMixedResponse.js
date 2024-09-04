import { meros as merosIncomingMessage } from 'meros/node';
import { meros as merosReadableStream } from 'meros/browser';
import { mapAsyncIterator } from '@graphql-tools/utils';
import { dset } from 'dset/merge';
import { addCancelToResponseStream } from './addCancelToResponseStream.js';
function isIncomingMessage(body) {
    return body != null && typeof body === 'object' && 'pipe' in body;
}
export async function handleMultipartMixedResponse(response, controller) {
    const body = response.body;
    const contentType = response.headers.get('content-type') || '';
    let asyncIterator;
    if (isIncomingMessage(body)) {
        // Meros/node expects headers as an object map with the content-type prop
        body.headers = {
            'content-type': contentType,
        };
        // And it expects `IncomingMessage` and `node-fetch` returns `body` as `Promise<PassThrough>`
        const result = await merosIncomingMessage(body);
        if ('next' in result) {
            asyncIterator = result;
        }
    }
    else {
        // Nothing is needed for regular `Response`.
        const result = await merosReadableStream(response);
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
                    dset(executionResult, path, item);
                }
            }
            if (result.data) {
                dset(executionResult, ['data', ...result.path], result.data);
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
    const resultStream = mapAsyncIterator(asyncIterator, (part) => {
        if (part.json) {
            const chunk = part.body;
            handleResult(chunk);
            return executionResult;
        }
    });
    if (controller) {
        return addCancelToResponseStream(resultStream, controller);
    }
    return resultStream;
}
