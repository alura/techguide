/* istanbul ignore file */
import { __spreadArray } from "tslib";
/*
Something in this file does not compile correctly while measuring code coverage
and will lead to a
  Uncaught [ReferenceError: cov_1zb8w312au is not defined]
if we do not ignore this file in code coverage.

As we only use this file in our internal tests, we can safely ignore it.
*/
import { within, screen } from "@testing-library/dom";
import { JSDOM, VirtualConsole } from "jsdom";
import { applyStackTrace, captureStackTrace } from "./traces.js";
/** @internal */
var RenderInstance = /** @class */ (function () {
    function RenderInstance(baseRender, snapshot, stringifiedDOM, renderedComponents) {
        this.snapshot = snapshot;
        this.stringifiedDOM = stringifiedDOM;
        this.renderedComponents = renderedComponents;
        this.id = baseRender.id;
        this.phase = baseRender.phase;
        this.actualDuration = baseRender.actualDuration;
        this.baseDuration = baseRender.baseDuration;
        this.startTime = baseRender.startTime;
        this.commitTime = baseRender.commitTime;
        this.count = baseRender.count;
    }
    Object.defineProperty(RenderInstance.prototype, "domSnapshot", {
        get: function () {
            if (this._domSnapshot)
                return this._domSnapshot;
            if (!this.stringifiedDOM) {
                throw new Error("DOM snapshot is not available - please set the `snapshotDOM` option");
            }
            var virtualConsole = new VirtualConsole();
            var stackTrace = captureStackTrace("RenderInstance.get");
            virtualConsole.on("jsdomError", function (error) {
                throw applyStackTrace(error, stackTrace);
            });
            var snapDOM = new JSDOM(this.stringifiedDOM, {
                runScripts: "dangerously",
                virtualConsole: virtualConsole,
            });
            var document = snapDOM.window.document;
            var body = document.body;
            var script = document.createElement("script");
            script.type = "text/javascript";
            script.text = "\n        ".concat(errorOnDomInteraction.toString(), ";\n        ").concat(errorOnDomInteraction.name, "();\n      ");
            body.appendChild(script);
            body.removeChild(script);
            return (this._domSnapshot = body);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RenderInstance.prototype, "withinDOM", {
        get: function () {
            var _this = this;
            var snapScreen = Object.assign(within(this.domSnapshot), {
                debug: function () {
                    var _a = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        _a[_i] = arguments[_i];
                    }
                    var _b = _a[0], dom = _b === void 0 ? _this.domSnapshot : _b, rest = _a.slice(1);
                    return screen.debug.apply(screen, __spreadArray([dom], rest, false));
                },
                logTestingPlaygroundURL: function () {
                    var _a = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        _a[_i] = arguments[_i];
                    }
                    var _b = _a[0], dom = _b === void 0 ? _this.domSnapshot : _b, rest = _a.slice(1);
                    return screen.logTestingPlaygroundURL.apply(screen, __spreadArray([dom], rest, false));
                },
            });
            return function () { return snapScreen; };
        },
        enumerable: false,
        configurable: true
    });
    return RenderInstance;
}());
export { RenderInstance };
/** @internal */
export function errorOnDomInteraction() {
    var events = [
        "auxclick",
        "blur",
        "change",
        "click",
        "copy",
        "cut",
        "dblclick",
        "drag",
        "dragend",
        "dragenter",
        "dragleave",
        "dragover",
        "dragstart",
        "drop",
        "focus",
        "focusin",
        "focusout",
        "input",
        "keydown",
        "keypress",
        "keyup",
        "mousedown",
        "mouseenter",
        "mouseleave",
        "mousemove",
        "mouseout",
        "mouseover",
        "mouseup",
        "paste",
        "pointercancel",
        "pointerdown",
        "pointerenter",
        "pointerleave",
        "pointermove",
        "pointerout",
        "pointerover",
        "pointerup",
        "scroll",
        "select",
        "selectionchange",
        "selectstart",
        "submit",
        "toggle",
        "touchcancel",
        "touchend",
        "touchmove",
        "touchstart",
        "wheel",
    ];
    function warnOnDomInteraction() {
        throw new Error("\n    DOM interaction with a snapshot detected in test.\n    Please don't interact with the DOM you get from `withinDOM`,\n    but still use `screen' to get elements for simulating user interaction.\n    ");
    }
    events.forEach(function (event) {
        document.addEventListener(event, warnOnDomInteraction);
    });
}
//# sourceMappingURL=Render.js.map