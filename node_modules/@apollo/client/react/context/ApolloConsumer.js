import { invariant } from "../../utilities/globals/index.js";
import * as React from "rehackt";
import { getApolloContext } from "./ApolloContext.js";
export var ApolloConsumer = function (props) {
    var ApolloContext = getApolloContext();
    return (React.createElement(ApolloContext.Consumer, null, function (context) {
        invariant(context && context.client, 44);
        return props.children(context.client);
    }));
};
//# sourceMappingURL=ApolloConsumer.js.map