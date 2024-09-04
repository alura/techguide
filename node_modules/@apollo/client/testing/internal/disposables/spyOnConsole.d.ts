type ConsoleMethod = "log" | "info" | "warn" | "error" | "debug";
type Spies<Keys extends ConsoleMethod[]> = Record<Keys[number], jest.SpyInstance<void, any[], any>>;
/** @internal */
export declare function spyOnConsole<Keys extends ConsoleMethod[]>(...spyOn: Keys): Spies<Keys> & Disposable;
export declare namespace spyOnConsole {
    var takeSnapshots: <Keys extends ConsoleMethod[]>(...spyOn: Keys) => Spies<Keys> & Disposable;
}
export {};
//# sourceMappingURL=spyOnConsole.d.ts.map