/**
 * @deprecated
 * This is not used internally any more and will be removed in
 * the next major version of Apollo Client.
 */
export var createSignalIfSupported = function () {
    if (typeof AbortController === "undefined")
        return { controller: false, signal: false };
    var controller = new AbortController();
    var signal = controller.signal;
    return { controller: controller, signal: signal };
};
//# sourceMappingURL=createSignalIfSupported.js.map