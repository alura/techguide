import { getMarkupFromTree } from "./getDataFromTree.js";
import { renderToString } from "react-dom/server";
export function renderToStringWithData(component) {
    return getMarkupFromTree({
        tree: component,
        renderFunction: renderToString,
    });
}
//# sourceMappingURL=renderToStringWithData.js.map