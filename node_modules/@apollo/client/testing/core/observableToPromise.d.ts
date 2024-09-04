import type { ObservableQuery, ApolloQueryResult } from "../../core/index.js";
import type { ObservableSubscription } from "../../utilities/index.js";
export interface Options {
    /**
     * The ObservableQuery to subscribe to.
     */
    observable: ObservableQuery<any, any>;
    /**
     * Should we resolve after seeing all our callbacks? [default: true]
     * (use this if you are racing the promise against another)
     */
    shouldResolve?: boolean;
    /**
     * How long to wait after seeing desired callbacks before resolving?
     * [default: -1 => don't wait]
     */
    wait?: number;
    /**
     * An expected set of errors.
     */
    errorCallbacks?: ((error: Error) => any)[];
}
export type ResultCallback = (result: ApolloQueryResult<any>) => any;
export declare function observableToPromiseAndSubscription({ observable, shouldResolve, wait, errorCallbacks }: Options, ...cbs: ResultCallback[]): {
    promise: Promise<any[]>;
    subscription: ObservableSubscription;
};
export default function (options: Options, ...cbs: ResultCallback[]): Promise<any[]>;
//# sourceMappingURL=observableToPromise.d.ts.map