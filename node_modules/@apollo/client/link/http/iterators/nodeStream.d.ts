/**
 * Original source:
 * https://github.com/kmalakoff/response-iterator/blob/master/src/iterators/nodeStream.ts
 */
import type { Readable as NodeReadableStream } from "stream";
export default function nodeStreamIterator<T>(stream: NodeReadableStream): AsyncIterableIterator<T>;
//# sourceMappingURL=nodeStream.d.ts.map