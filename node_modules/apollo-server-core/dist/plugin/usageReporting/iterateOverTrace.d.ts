import type { Trace } from 'apollo-reporting-protobuf';
export declare function iterateOverTrace(trace: Trace, f: (node: Trace.INode, path: ResponseNamePath) => boolean, includePath: boolean): void;
export interface ResponseNamePath {
    toArray(): string[];
    child(responseName: string): ResponseNamePath;
}
//# sourceMappingURL=iterateOverTrace.d.ts.map