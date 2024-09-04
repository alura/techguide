import { __assign } from "tslib";
import * as React from "rehackt";
import { getApolloContext } from "../context/index.js";
import { RenderPromises } from "./RenderPromises.js";
import { renderToStaticMarkup } from "react-dom/server";
export function getDataFromTree(tree, context) {
    if (context === void 0) { context = {}; }
    return getMarkupFromTree({
        tree: tree,
        context: context,
        // If you need to configure this renderFunction, call getMarkupFromTree
        // directly instead of getDataFromTree.
        renderFunction: renderToStaticMarkup,
    });
}
export function getMarkupFromTree(_a) {
    var tree = _a.tree, _b = _a.context, context = _b === void 0 ? {} : _b, 
    // The rendering function is configurable! We use renderToStaticMarkup as
    // the default, because it's a little less expensive than renderToString,
    // and legacy usage of getDataFromTree ignores the return value anyway.
    _c = _a.renderFunction, 
    // The rendering function is configurable! We use renderToStaticMarkup as
    // the default, because it's a little less expensive than renderToString,
    // and legacy usage of getDataFromTree ignores the return value anyway.
    renderFunction = _c === void 0 ? renderToStaticMarkup : _c;
    var renderPromises = new RenderPromises();
    function process() {
        // Always re-render from the rootElement, even though it might seem
        // better to render the children of the component responsible for the
        // promise, because it is not possible to reconstruct the full context
        // of the original rendering (including all unknown context provider
        // elements) for a subtree of the original component tree.
        var ApolloContext = getApolloContext();
        return new Promise(function (resolve) {
            var element = React.createElement(ApolloContext.Provider, { value: __assign(__assign({}, context), { renderPromises: renderPromises }) }, tree);
            resolve(renderFunction(element));
        })
            .then(function (html) {
            return renderPromises.hasPromises() ?
                renderPromises.consumeAndAwaitPromises().then(process)
                : html;
        })
            .finally(function () {
            renderPromises.stop();
        });
    }
    return Promise.resolve().then(process);
}
//# sourceMappingURL=getDataFromTree.js.map