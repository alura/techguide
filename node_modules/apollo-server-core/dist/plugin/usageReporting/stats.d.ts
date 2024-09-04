import { DurationHistogram } from './durationHistogram';
import { IFieldStat, IPathErrorStats, IQueryLatencyStats, IStatsContext, Trace, ITypeStat, IContextualizedStats, ReportHeader, google, ITracesAndStats, IReport } from 'apollo-reporting-protobuf';
import type { ReferencedFieldsByType } from '@apollo/utils.usagereporting';
export declare class SizeEstimator {
    bytes: number;
}
export declare class OurReport implements Required<IReport> {
    readonly header: ReportHeader;
    tracesPreAggregated: boolean;
    constructor(header: ReportHeader);
    readonly tracesPerQuery: Record<string, OurTracesAndStats>;
    endTime: google.protobuf.ITimestamp | null;
    operationCount: number;
    readonly sizeEstimator: SizeEstimator;
    ensureCountsAreIntegers(): void;
    addTrace({ statsReportKey, trace, asTrace, includeTracesContributingToStats, referencedFieldsByType, }: {
        statsReportKey: string;
        trace: Trace;
        asTrace: boolean;
        includeTracesContributingToStats: boolean;
        referencedFieldsByType: ReferencedFieldsByType;
    }): void;
    private getTracesAndStats;
}
declare class OurTracesAndStats implements Required<ITracesAndStats> {
    readonly referencedFieldsByType: ReferencedFieldsByType;
    constructor(referencedFieldsByType: ReferencedFieldsByType);
    readonly trace: Uint8Array[];
    readonly statsWithContext: StatsByContext;
    readonly internalTracesContributingToStats: Uint8Array[];
    ensureCountsAreIntegers(): void;
}
declare class StatsByContext {
    readonly map: {
        [k: string]: OurContextualizedStats;
    };
    toArray(): IContextualizedStats[];
    ensureCountsAreIntegers(): void;
    addTrace(trace: Trace, sizeEstimator: SizeEstimator): void;
    private getContextualizedStats;
}
export declare class OurContextualizedStats implements Required<IContextualizedStats> {
    readonly context: IStatsContext;
    queryLatencyStats: OurQueryLatencyStats;
    perTypeStat: {
        [k: string]: OurTypeStat;
    };
    constructor(context: IStatsContext);
    ensureCountsAreIntegers(): void;
    addTrace(trace: Trace, sizeEstimator: SizeEstimator): void;
    getTypeStat(parentType: string, sizeEstimator: SizeEstimator): OurTypeStat;
}
declare class OurQueryLatencyStats implements Required<IQueryLatencyStats> {
    latencyCount: DurationHistogram;
    requestCount: number;
    requestsWithoutFieldInstrumentation: number;
    cacheHits: number;
    persistedQueryHits: number;
    persistedQueryMisses: number;
    cacheLatencyCount: DurationHistogram;
    rootErrorStats: OurPathErrorStats;
    requestsWithErrorsCount: number;
    publicCacheTtlCount: DurationHistogram;
    privateCacheTtlCount: DurationHistogram;
    registeredOperationCount: number;
    forbiddenOperationCount: number;
}
declare class OurPathErrorStats implements Required<IPathErrorStats> {
    children: {
        [k: string]: OurPathErrorStats;
    };
    errorsCount: number;
    requestsWithErrorsCount: number;
    getChild(subPath: string, sizeEstimator: SizeEstimator): OurPathErrorStats;
}
declare class OurTypeStat implements Required<ITypeStat> {
    perFieldStat: {
        [k: string]: OurFieldStat;
    };
    getFieldStat(fieldName: string, returnType: string, sizeEstimator: SizeEstimator): OurFieldStat;
    ensureCountsAreIntegers(): void;
}
declare class OurFieldStat implements Required<IFieldStat> {
    readonly returnType: string;
    errorsCount: number;
    observedExecutionCount: number;
    estimatedExecutionCount: number;
    requestsWithErrorsCount: number;
    latencyCount: DurationHistogram;
    constructor(returnType: string);
    ensureCountsAreIntegers(): void;
}
export {};
//# sourceMappingURL=stats.d.ts.map