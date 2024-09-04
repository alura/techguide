import type { Operation } from "../core/index.js";
/**
 * Advanced mode: a function that implements the strategy for calculating delays
 * for particular responses.
 */
export interface DelayFunction {
    (count: number, operation: Operation, error: any): number;
}
export interface DelayFunctionOptions {
    /**
     * The number of milliseconds to wait before attempting the first retry.
     *
     * Delays will increase exponentially for each attempt.  E.g. if this is
     * set to 100, subsequent retries will be delayed by 200, 400, 800, etc,
     * until they reach maxDelay.
     *
     * Note that if jittering is enabled, this is the _average_ delay.
     *
     * Defaults to 300.
     */
    initial?: number;
    /**
     * The maximum number of milliseconds that the link should wait for any
     * retry.
     *
     * Defaults to Infinity.
     */
    max?: number;
    /**
     * Whether delays between attempts should be randomized.
     *
     * This helps avoid thundering herd type situations by better distributing
     * load during major outages.
     *
     * Defaults to true.
     */
    jitter?: boolean;
}
export declare function buildDelayFunction(delayOptions?: DelayFunctionOptions): DelayFunction;
//# sourceMappingURL=delayFunction.d.ts.map