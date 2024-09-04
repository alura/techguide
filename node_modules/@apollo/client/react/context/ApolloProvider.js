import { __assign } from "tslib";
import { invariant } from "../../utilities/globals/index.js";
import * as React from "rehackt";
import { getApolloContext } from "./ApolloContext.js";
export var ApolloProvider = function (_a) {
    var client = _a.client, children = _a.children;
    var ApolloContext = getApolloContext();
    var parentContext = React.useContext(ApolloContext);
    var context = React.useMemo(function () {
        return __assign(__assign({}, parentContext), { client: client || parentContext.client });
    }, [parentContext, client]);
    invariant(context.client, 46);
    return (React.createElement(ApolloContext.Provider, { value: context }, children));
};
//# sourceMappingURL=ApolloProvider.js.map