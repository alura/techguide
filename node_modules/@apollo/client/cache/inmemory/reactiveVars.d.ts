import type { ApolloCache } from "../../core/index.js";
export interface ReactiveVar<T> {
    (newValue?: T): T;
    onNextChange(listener: ReactiveListener<T>): () => void;
    attachCache(cache: ApolloCache<any>): this;
    forgetCache(cache: ApolloCache<any>): boolean;
}
export type ReactiveListener<T> = (value: T) => any;
export declare const cacheSlot: {
    readonly id: string;
    hasValue(): boolean;
    getValue(): ApolloCache<any> | undefined;
    withValue<TResult, TArgs extends any[], TThis = any>(value: ApolloCache<any>, callback: (this: TThis, ...args: TArgs) => TResult, args?: TArgs | undefined, thisArg?: TThis | undefined): TResult;
};
export declare function forgetCache(cache: ApolloCache<any>): void;
export declare function recallCache(cache: ApolloCache<any>): void;
export declare function makeVar<T>(value: T): ReactiveVar<T>;
//# sourceMappingURL=reactiveVars.d.ts.map