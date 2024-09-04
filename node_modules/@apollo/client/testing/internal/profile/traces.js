/**
 * Captures a StackTrace and (if passed) cuts off
 * the first lines including the calling function.
 */
export function captureStackTrace(callingFunction) {
    var stack = "";
    try {
        throw new Error("");
    }
    catch (e) {
        (stack = e.stack);
    }
    var callerName = typeof callingFunction === "string" ? callingFunction
        : callingFunction ? callingFunction.name
            : undefined;
    if (callerName && stack.includes(callerName)) {
        var lines = stack.split("\n");
        stack = lines
            .slice(
        // @ts-expect-error this is too old of a TS target, but node has it
        lines.findLastIndex(function (line) { return line.includes(callerName); }) + 1)
            .join("\n");
    }
    return stack;
}
export function applyStackTrace(error, stackTrace) {
    error.stack = error.message + "\n" + stackTrace;
    return error;
}
//# sourceMappingURL=traces.js.map