import * as React from "react";
var ProfilerContext = React.createContext(undefined);
export function ProfilerContextProvider(_a) {
    var children = _a.children, value = _a.value;
    var parentContext = useProfilerContext();
    if (parentContext) {
        throw new Error("Profilers should not be nested in the same tree");
    }
    return (React.createElement(ProfilerContext.Provider, { value: value }, children));
}
export function useProfilerContext() {
    return React.useContext(ProfilerContext);
}
//# sourceMappingURL=context.js.map