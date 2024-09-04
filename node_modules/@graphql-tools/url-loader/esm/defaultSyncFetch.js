import syncFetchImported from '@ardatan/sync-fetch';
export const defaultSyncFetch = (input, init) => {
    if (typeof input === 'string') {
        init === null || init === void 0 ? true : delete init.signal;
    }
    else {
        delete input.signal;
    }
    return syncFetchImported(input, init);
};
