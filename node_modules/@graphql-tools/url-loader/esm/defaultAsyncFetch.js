import { fetch } from '@whatwg-node/fetch';
export const defaultAsyncFetch = async (input, init) => {
    return fetch(input, init);
};
