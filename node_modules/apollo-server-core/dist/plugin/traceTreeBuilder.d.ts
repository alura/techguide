import { GraphQLError, GraphQLResolveInfo } from 'graphql';
import { Trace, google } from 'apollo-reporting-protobuf';
import type { Logger } from '@apollo/utils.logger';
export declare class TraceTreeBuilder {
    private rootNode;
    private logger;
    trace: Trace;
    startHrTime?: [number, number];
    private stopped;
    private nodes;
    private readonly rewriteError?;
    constructor(options: {
        logger?: Logger;
        rewriteError?: (err: GraphQLError) => GraphQLError | null;
    });
    startTiming(): void;
    stopTiming(): void;
    willResolveField(info: GraphQLResolveInfo): () => void;
    didEncounterErrors(errors: readonly GraphQLError[]): void;
    private addProtobufError;
    private newNode;
    private ensureParentNode;
    private rewriteAndNormalizeError;
}
export declare function dateToProtoTimestamp(date: Date): google.protobuf.Timestamp;
//# sourceMappingURL=traceTreeBuilder.d.ts.map