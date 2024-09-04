export interface DurationHistogramOptions {
    initSize?: number;
    buckets?: number[];
}
export declare class DurationHistogram {
    private readonly buckets;
    static readonly BUCKET_COUNT = 384;
    static readonly EXPONENT_LOG: number;
    toArray(): number[];
    static durationToBucket(durationNs: number): number;
    incrementDuration(durationNs: number, value?: number): DurationHistogram;
    incrementBucket(bucket: number, value?: number): void;
    combine(otherHistogram: DurationHistogram): void;
    constructor(options?: DurationHistogramOptions);
}
//# sourceMappingURL=durationHistogram.d.ts.map