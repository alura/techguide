const hasIterator = typeof Symbol !== 'undefined' && Symbol.asyncIterator;
/* c8 ignore start */ export default function promiseIterator(promise) {
    let resolved = false;
    const iterator = {
        next () {
            if (resolved) return Promise.resolve({
                value: undefined,
                done: true
            });
            resolved = true;
            return new Promise(function(resolve, reject) {
                promise.then(function(value) {
                    resolve({
                        value,
                        done: false
                    });
                }).catch(reject);
            });
        }
    };
    if (hasIterator) {
        iterator[Symbol.asyncIterator] = function() {
            return this;
        };
    }
    return iterator;
}; /* c8 ignore stop */ 
