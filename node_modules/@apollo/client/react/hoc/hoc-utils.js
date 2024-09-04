import { __extends } from "tslib";
import { invariant } from "../../utilities/globals/index.js";
import * as React from "rehackt";
export var defaultMapPropsToOptions = function () { return ({}); };
export var defaultMapResultToProps = function (props) { return props; };
export var defaultMapPropsToSkip = function () { return false; };
export function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || "Component";
}
export function calculateVariablesFromProps(operation, props) {
    var variables = {};
    for (var _i = 0, _a = operation.variables; _i < _a.length; _i++) {
        var _b = _a[_i], variable = _b.variable, type = _b.type;
        if (!variable.name || !variable.name.value)
            continue;
        var variableName = variable.name.value;
        var variableProp = props[variableName];
        if (typeof variableProp !== "undefined") {
            variables[variableName] = variableProp;
            continue;
        }
        // Allow optional props
        if (type.kind !== "NonNullType") {
            variables[variableName] = undefined;
        }
    }
    return variables;
}
// base class for hocs to easily manage refs
var GraphQLBase = /** @class */ (function (_super) {
    __extends(GraphQLBase, _super);
    function GraphQLBase(props) {
        var _this = _super.call(this, props) || this;
        _this.withRef = false;
        _this.setWrappedInstance = _this.setWrappedInstance.bind(_this);
        return _this;
    }
    GraphQLBase.prototype.getWrappedInstance = function () {
        invariant(this.withRef, 47);
        return this.wrappedInstance;
    };
    GraphQLBase.prototype.setWrappedInstance = function (ref) {
        this.wrappedInstance = ref;
    };
    return GraphQLBase;
}(React.Component));
export { GraphQLBase };
//# sourceMappingURL=hoc-utils.js.map