"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DurationHistogram = void 0;
class DurationHistogram {
    constructor(options) {
        const initSize = (options === null || options === void 0 ? void 0 : options.initSize) || 74;
        const buckets = options === null || options === void 0 ? void 0 : options.buckets;
        const arrayInitSize = Math.max((buckets === null || buckets === void 0 ? void 0 : buckets.length) || 0, initSize);
        this.buckets = Array(arrayInitSize).fill(0);
        if (buckets) {
            buckets.forEach((val, index) => (this.buckets[index] = val));
        }
    }
    toArray() {
        let bufferedZeroes = 0;
        const outputArray = [];
        for (const value of this.buckets) {
            if (value === 0) {
                bufferedZeroes++;
            }
            else {
                if (bufferedZeroes === 1) {
                    outputArray.push(0);
                }
                else if (bufferedZeroes !== 0) {
                    outputArray.push(-bufferedZeroes);
                }
                outputArray.push(Math.floor(value));
                bufferedZeroes = 0;
            }
        }
        return outputArray;
    }
    static durationToBucket(durationNs) {
        const log = Math.log(durationNs / 1000.0);
        const unboundedBucket = Math.ceil(log / DurationHistogram.EXPONENT_LOG);
        return unboundedBucket <= 0 || Number.isNaN(unboundedBucket)
            ? 0
            : unboundedBucket >= DurationHistogram.BUCKET_COUNT
                ? DurationHistogram.BUCKET_COUNT - 1
                : unboundedBucket;
    }
    incrementDuration(durationNs, value = 1) {
        this.incrementBucket(DurationHistogram.durationToBucket(durationNs), value);
        return this;
    }
    incrementBucket(bucket, value = 1) {
        if (bucket >= DurationHistogram.BUCKET_COUNT) {
            throw Error('Bucket is out of bounds of the buckets array');
        }
        if (bucket >= this.buckets.length) {
            const oldLength = this.buckets.length;
            this.buckets.length = bucket + 1;
            this.buckets.fill(0, oldLength);
        }
        this.buckets[bucket] += value;
    }
    combine(otherHistogram) {
        for (let i = 0; i < otherHistogram.buckets.length; i++) {
            this.incrementBucket(i, otherHistogram.buckets[i]);
        }
    }
}
exports.DurationHistogram = DurationHistogram;
DurationHistogram.BUCKET_COUNT = 384;
DurationHistogram.EXPONENT_LOG = Math.log(1.1);
//# sourceMappingURL=durationHistogram.js.map