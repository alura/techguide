declare const makeSlotClass: () => {
    new <TValue>(): {
        readonly id: string;
        hasValue(): boolean;
        getValue(): TValue | undefined;
        withValue<TResult, TArgs extends any[], TThis = any>(value: TValue, callback: (this: TThis, ...args: TArgs) => TResult, args?: TArgs | undefined, thisArg?: TThis | undefined): TResult;
    };
    bind<TArgs_1 extends any[], TResult_1, TThis_1 = any>(callback: (this: TThis_1, ...args: TArgs_1) => TResult_1): (this: TThis_1, ...args: TArgs_1) => TResult_1;
    noContext<TResult_2, TArgs_2 extends any[], TThis_2 = any>(callback: (this: TThis_2, ...args: TArgs_2) => TResult_2, args?: TArgs_2 | undefined, thisArg?: TThis_2 | undefined): TResult_2;
};
export declare const Slot: ReturnType<typeof makeSlotClass>;
export {};
