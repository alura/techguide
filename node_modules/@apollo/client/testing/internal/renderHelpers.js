import { __assign, __rest } from "tslib";
import * as React from "react";
import { render } from "@testing-library/react";
import { ApolloProvider } from "../../react/index.js";
import { MockedProvider } from "../react/MockedProvider.js";
export function renderWithClient(ui, _a) {
    var client = _a.client, _b = _a.wrapper, Wrapper = _b === void 0 ? React.Fragment : _b, renderOptions = __rest(_a, ["client", "wrapper"]);
    return render(ui, __assign(__assign({}, renderOptions), { wrapper: function (_a) {
            var children = _a.children;
            return (React.createElement(ApolloProvider, { client: client },
                React.createElement(Wrapper, null, children)));
        } }));
}
export function renderWithMocks(ui, _a) {
    var _b = _a.wrapper, Wrapper = _b === void 0 ? React.Fragment : _b, renderOptions = __rest(_a, ["wrapper"]);
    return render(ui, __assign(__assign({}, renderOptions), { wrapper: function (_a) {
            var children = _a.children;
            return (React.createElement(MockedProvider, __assign({}, renderOptions),
                React.createElement(Wrapper, null, children)));
        } }));
}
//# sourceMappingURL=renderHelpers.js.map