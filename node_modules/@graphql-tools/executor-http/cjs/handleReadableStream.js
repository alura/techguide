"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleReadableStream = void 0;
const fetch_1 = require("@whatwg-node/fetch");
const repeater_1 = require("@repeaterjs/repeater");
function handleReadableStream(readableStream) {
    const textDecoder = new fetch_1.TextDecoder();
    return new repeater_1.Repeater(function repeaterExecutor(push, stop) {
        const reader = readableStream.getReader();
        async function pump() {
            const { done, value } = await reader.read();
            if (done) {
                return stop();
            }
            if (value) {
                const chunk = typeof value === 'string' ? value : textDecoder.decode(value, { stream: true });
                for (const part of chunk.split('\n\n')) {
                    if (part) {
                        const eventStr = part.split('event: ')[1];
                        const dataStr = part.split('data: ')[1];
                        if (eventStr === 'complete') {
                            return stop();
                        }
                        if (dataStr) {
                            const data = JSON.parse(dataStr);
                            await push(data.payload || data);
                        }
                    }
                }
            }
            return pump();
        }
        stop.finally(() => reader.cancel());
        return pump();
    });
}
exports.handleReadableStream = handleReadableStream;
