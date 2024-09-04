import { screen } from "@testing-library/dom";
/** @internal */
export interface BaseRender {
    id: string;
    phase: "mount" | "update" | "nested-update";
    actualDuration: number;
    baseDuration: number;
    startTime: number;
    commitTime: number;
    /**
     * The number of renders that have happened so far (including this render).
     */
    count: number;
}
type Screen = typeof screen;
/** @internal */
export type SyncScreen = {
    [K in keyof Screen]: K extends `find${string}` ? {
        /** @deprecated A snapshot is static, so avoid async queries! */
        (...args: Parameters<Screen[K]>): ReturnType<Screen[K]>;
    } : Screen[K];
};
/** @internal */
export interface Render<Snapshot> extends BaseRender {
    /**
     * The snapshot, as returned by the `takeSnapshot` option of `profile`.
     * (If using `profileHook`, this is the return value of the hook.)
     */
    snapshot: Snapshot;
    /**
     * A DOM snapshot of the rendered component, if the `snapshotDOM`
     * option of `profile` was enabled.
     */
    readonly domSnapshot: HTMLElement;
    /**
     * Returns a callback to receive a `screen` instance that is scoped to the
     * DOM snapshot of this `Render` instance.
     * Note: this is used as a callback to prevent linter errors.
     * @example
     * ```diff
     * const { withinDOM } = RenderedComponent.takeRender();
     * -expect(screen.getByText("foo")).toBeInTheDocument();
     * +expect(withinDOM().getByText("foo")).toBeInTheDocument();
     * ```
     */
    withinDOM: () => SyncScreen;
    renderedComponents: Array<string | React.ComponentType>;
}
/** @internal */
export declare class RenderInstance<Snapshot> implements Render<Snapshot> {
    snapshot: Snapshot;
    private stringifiedDOM;
    renderedComponents: Array<string | React.ComponentType>;
    id: string;
    phase: "mount" | "update" | "nested-update";
    actualDuration: number;
    baseDuration: number;
    startTime: number;
    commitTime: number;
    count: number;
    constructor(baseRender: BaseRender, snapshot: Snapshot, stringifiedDOM: string | undefined, renderedComponents: Array<string | React.ComponentType>);
    private _domSnapshot;
    get domSnapshot(): HTMLElement;
    get withinDOM(): () => SyncScreen;
}
/** @internal */
export declare function errorOnDomInteraction(): void;
export {};
//# sourceMappingURL=Render.d.ts.map