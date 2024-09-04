import * as React from "react";
export interface ProfilerContextValue {
    renderedComponents: Array<React.ComponentType | string>;
}
export declare function ProfilerContextProvider({ children, value, }: {
    children: React.ReactNode;
    value: ProfilerContextValue;
}): React.JSX.Element;
export declare function useProfilerContext(): ProfilerContextValue | undefined;
//# sourceMappingURL=context.d.ts.map