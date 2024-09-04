const hasIterator = typeof Symbol !== 'undefined' && Symbol.asyncIterator;
/* c8 ignore start */ export default function readerIterator(reader) {
    const iterator = {
        next () {
            return reader.read();
        }
    };
    if (hasIterator) {
        iterator[Symbol.asyncIterator] = function() {
            return this;
        };
    }
    return iterator;
}; /* c8 ignore stop */ 
