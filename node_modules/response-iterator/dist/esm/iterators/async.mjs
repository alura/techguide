export default function asyncIterator(source) {
    const iterator = source[Symbol.asyncIterator]();
    return {
        next () {
            return iterator.next();
        },
        [Symbol.asyncIterator] () {
            return this;
        }
    };
};
