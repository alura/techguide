import DataLoader from 'dataloader';
import { getOperationASTFromRequest } from '@graphql-tools/utils';
import { mergeRequests } from './mergeRequests.js';
import { splitResult } from './splitResult.js';
import { ValueOrPromise } from 'value-or-promise';
export function createBatchingExecutor(executor, dataLoaderOptions, extensionsReducer = defaultExtensionsReducer) {
    const loadFn = createLoadFn(executor, extensionsReducer);
    const loader = new DataLoader(loadFn, dataLoaderOptions);
    return function batchingExecutor(request) {
        const operationAst = getOperationASTFromRequest(request);
        return operationAst.operation === 'subscription' ? executor(request) : loader.load(request);
    };
}
function createLoadFn(executor, extensionsReducer) {
    return function batchExecuteLoadFn(requests) {
        if (requests.length === 1) {
            return new ValueOrPromise(() => executor(requests[0]))
                .then((result) => [result])
                .catch((err) => [err]);
        }
        const execBatches = [];
        let index = 0;
        const request = requests[index];
        let currentBatch = [request];
        execBatches.push(currentBatch);
        const operationAst = getOperationASTFromRequest(request);
        const operationType = operationAst.operation;
        if (operationType == null) {
            throw new Error('could not identify operation type of document');
        }
        while (++index < requests.length) {
            const currentRequest = requests[index];
            const currentOperationAST = getOperationASTFromRequest(currentRequest);
            const currentOperationType = currentOperationAST.operation;
            if (operationType === currentOperationType) {
                currentBatch.push(currentRequest);
            }
            else {
                currentBatch = [currentRequest];
                execBatches.push(currentBatch);
            }
        }
        return ValueOrPromise.all(execBatches.map(execBatch => new ValueOrPromise(() => {
            const mergedRequests = mergeRequests(execBatch, extensionsReducer);
            return executor(mergedRequests);
        }).then(resultBatches => splitResult(resultBatches, execBatch.length)))).then(results => results.flat());
    };
}
function defaultExtensionsReducer(mergedExtensions, request) {
    const newExtensions = request.extensions;
    if (newExtensions != null) {
        Object.assign(mergedExtensions, newExtensions);
    }
    return mergedExtensions;
}
