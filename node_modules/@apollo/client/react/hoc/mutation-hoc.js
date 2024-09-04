import { __assign, __extends, __rest } from "tslib";
import * as React from "rehackt";
import hoistNonReactStatics from "hoist-non-react-statics";
import { parser } from "../parser/index.js";
import { Mutation } from "../components/index.js";
import { defaultMapPropsToOptions, getDisplayName, calculateVariablesFromProps, GraphQLBase, } from "./hoc-utils.js";
/**
 * @deprecated
 * Official support for React Apollo higher order components ended in March 2020.
 * This library is still included in the `@apollo/client` package, but it no longer receives feature updates or bug fixes.
 */
export function withMutation(document, operationOptions) {
    if (operationOptions === void 0) { operationOptions = {}; }
    // this is memoized so if coming from `graphql` there is nearly no extra cost
    var operation = parser(document);
    // extract options
    var _a = operationOptions.options, options = _a === void 0 ? defaultMapPropsToOptions : _a, _b = operationOptions.alias, alias = _b === void 0 ? "Apollo" : _b;
    var mapPropsToOptions = options;
    if (typeof mapPropsToOptions !== "function")
        mapPropsToOptions = function () {
            return options;
        };
    return function (WrappedComponent) {
        var graphQLDisplayName = "".concat(alias, "(").concat(getDisplayName(WrappedComponent), ")");
        var GraphQL = /** @class */ (function (_super) {
            __extends(GraphQL, _super);
            function GraphQL() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            GraphQL.prototype.render = function () {
                var props = this.props;
                var opts = mapPropsToOptions(props);
                if (operationOptions.withRef) {
                    this.withRef = true;
                    props = Object.assign({}, props, {
                        ref: this.setWrappedInstance,
                    });
                }
                if (!opts.variables && operation.variables.length > 0) {
                    opts.variables = calculateVariablesFromProps(operation, props);
                }
                return (React.createElement(Mutation, __assign({ ignoreResults: true }, opts, { mutation: document }), function (mutate, _a) {
                    var _b, _c;
                    var data = _a.data, r = __rest(_a, ["data"]);
                    // the HOC's historically hoisted the data from the execution result
                    // up onto the result since it was passed as a nested prop
                    // we massage the Mutation component's shape here to replicate that
                    // this matches the query HoC
                    var result = Object.assign(r, data || {});
                    var name = operationOptions.name || "mutate";
                    var resultName = operationOptions.name ? "".concat(name, "Result") : "result";
                    var childProps = (_b = {},
                        _b[name] = mutate,
                        _b[resultName] = result,
                        _b);
                    if (operationOptions.props) {
                        var newResult = (_c = {},
                            _c[name] = mutate,
                            _c[resultName] = result,
                            _c.ownProps = props,
                            _c);
                        childProps = operationOptions.props(newResult);
                    }
                    return React.createElement(WrappedComponent, __assign({}, props, childProps));
                }));
            };
            GraphQL.displayName = graphQLDisplayName;
            GraphQL.WrappedComponent = WrappedComponent;
            return GraphQL;
        }(GraphQLBase));
        // Make sure we preserve any custom statics on the original component.
        return hoistNonReactStatics(GraphQL, WrappedComponent, {});
    };
}
//# sourceMappingURL=mutation-hoc.js.map