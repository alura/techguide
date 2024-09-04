import { __assign, __extends } from "tslib";
import { invariant } from "../../utilities/globals/index.js";
import * as React from "rehackt";
import hoistNonReactStatics from "hoist-non-react-statics";
import { ApolloConsumer } from "../context/index.js";
function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || "Component";
}
/**
 * @deprecated
 * Official support for React Apollo higher order components ended in March 2020.
 * This library is still included in the `@apollo/client` package, but it no longer receives feature updates or bug fixes.
 */
export function withApollo(WrappedComponent, operationOptions) {
    if (operationOptions === void 0) { operationOptions = {}; }
    var withDisplayName = "withApollo(".concat(getDisplayName(WrappedComponent), ")");
    var WithApollo = /** @class */ (function (_super) {
        __extends(WithApollo, _super);
        function WithApollo(props) {
            var _this = _super.call(this, props) || this;
            _this.setWrappedInstance = _this.setWrappedInstance.bind(_this);
            return _this;
        }
        WithApollo.prototype.getWrappedInstance = function () {
            invariant(operationOptions.withRef, 48);
            return this.wrappedInstance;
        };
        WithApollo.prototype.setWrappedInstance = function (ref) {
            this.wrappedInstance = ref;
        };
        WithApollo.prototype.render = function () {
            var _this = this;
            return (React.createElement(ApolloConsumer, null, function (client) {
                var props = Object.assign({}, _this.props, {
                    client: client,
                    ref: operationOptions.withRef ? _this.setWrappedInstance : undefined,
                });
                return React.createElement(WrappedComponent, __assign({}, props));
            }));
        };
        WithApollo.displayName = withDisplayName;
        WithApollo.WrappedComponent = WrappedComponent;
        return WithApollo;
    }(React.Component));
    // Make sure we preserve any custom statics on the original component.
    return hoistNonReactStatics(WithApollo, WrappedComponent, {});
}
//# sourceMappingURL=withApollo.js.map