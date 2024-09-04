"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PonyfillReadableStream = void 0;
const stream_1 = require("stream");
function createController(desiredSize, readable) {
    let chunks = [];
    let _closed = false;
    let flushed = false;
    return {
        desiredSize,
        enqueue(chunk) {
            const buf = typeof chunk === 'string' ? Buffer.from(chunk) : chunk;
            if (!flushed) {
                chunks.push(buf);
            }
            else {
                readable.push(buf);
            }
        },
        close() {
            if (chunks.length > 0) {
                this._flush();
            }
            readable.push(null);
            _closed = true;
        },
        error(error) {
            if (chunks.length > 0) {
                this._flush();
            }
            readable.destroy(error);
        },
        get _closed() {
            return _closed;
        },
        _flush() {
            flushed = true;
            if (chunks.length > 0) {
                const concatenated = Buffer.concat(chunks);
                readable.push(concatenated);
                chunks = [];
            }
        },
    };
}
class PonyfillReadableStream {
    constructor(underlyingSource) {
        this.locked = false;
        if (underlyingSource instanceof PonyfillReadableStream) {
            this.readable = underlyingSource.readable;
        }
        else if (underlyingSource && 'read' in underlyingSource) {
            this.readable = underlyingSource;
        }
        else if (underlyingSource && 'getReader' in underlyingSource) {
            let reader;
            let started = false;
            this.readable = new stream_1.Readable({
                read() {
                    if (!started) {
                        started = true;
                        reader = underlyingSource.getReader();
                    }
                    reader
                        .read()
                        .then(({ value, done }) => {
                        if (done) {
                            this.push(null);
                        }
                        else {
                            this.push(value);
                        }
                    })
                        .catch(err => {
                        this.destroy(err);
                    });
                },
                destroy(err, callback) {
                    reader.cancel(err).then(() => callback(err), callback);
                },
            });
        }
        else {
            let started = false;
            let ongoing = false;
            this.readable = new stream_1.Readable({
                read(desiredSize) {
                    if (ongoing) {
                        return;
                    }
                    ongoing = true;
                    return Promise.resolve().then(async () => {
                        var _a, _b;
                        if (!started) {
                            const controller = createController(desiredSize, this);
                            started = true;
                            await ((_a = underlyingSource === null || underlyingSource === void 0 ? void 0 : underlyingSource.start) === null || _a === void 0 ? void 0 : _a.call(underlyingSource, controller));
                            controller._flush();
                            if (controller._closed) {
                                return;
                            }
                        }
                        const controller = createController(desiredSize, this);
                        await ((_b = underlyingSource === null || underlyingSource === void 0 ? void 0 : underlyingSource.pull) === null || _b === void 0 ? void 0 : _b.call(underlyingSource, controller));
                        controller._flush();
                        ongoing = false;
                    });
                },
                async destroy(err, callback) {
                    var _a;
                    try {
                        await ((_a = underlyingSource === null || underlyingSource === void 0 ? void 0 : underlyingSource.cancel) === null || _a === void 0 ? void 0 : _a.call(underlyingSource, err));
                        callback(null);
                    }
                    catch (err) {
                        callback(err);
                    }
                },
            });
        }
    }
    cancel(reason) {
        this.readable.destroy(reason);
        return Promise.resolve();
    }
    getReader(_options) {
        const iterator = this.readable[Symbol.asyncIterator]();
        this.locked = true;
        return {
            read() {
                return iterator.next();
            },
            releaseLock: () => {
                var _a;
                (_a = iterator.return) === null || _a === void 0 ? void 0 : _a.call(iterator);
                this.locked = false;
            },
            cancel: async (reason) => {
                var _a;
                await ((_a = iterator.return) === null || _a === void 0 ? void 0 : _a.call(iterator, reason));
                this.locked = false;
            },
            closed: new Promise((resolve, reject) => {
                this.readable.once('end', resolve);
                this.readable.once('error', reject);
            }),
        };
    }
    [Symbol.asyncIterator]() {
        return this.readable[Symbol.asyncIterator]();
    }
    tee() {
        throw new Error('Not implemented');
    }
    async pipeTo(destination) {
        const writer = destination.getWriter();
        await writer.ready;
        for await (const chunk of this.readable) {
            await writer.write(chunk);
        }
        await writer.ready;
        return writer.close();
    }
    pipeThrough({ writable, readable, }) {
        this.pipeTo(writable);
        return readable;
    }
    static [Symbol.hasInstance](instance) {
        return instance != null && typeof instance === 'object' && 'getReader' in instance;
    }
}
exports.PonyfillReadableStream = PonyfillReadableStream;
