'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var globals = require('../../utilities/globals');
var parser = require('../parser');
var tslib = require('tslib');
var React = require('rehackt');
var hoistNonReactStatics = require('hoist-non-react-statics');
var components = require('../components');
var context = require('../context');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e["default"] : e; }

function _interopNamespace(e) {
    if (e && e.__esModule) return e;
    var n = Object.create(null);
    if (e) {
        for (var k in e) {
            n[k] = e[k];
        }
    }
    n["default"] = e;
    return Object.freeze(n);
}

var React__namespace = /*#__PURE__*/_interopNamespace(React);
var hoistNonReactStatics__default = /*#__PURE__*/_interopDefaultLegacy(hoistNonReactStatics);

var defaultMapPropsToOptions = function () { return ({}); };
var defaultMapPropsToSkip = function () { return false; };
function getDisplayName$1(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || "Component";
}
function calculateVariablesFromProps(operation, props) {
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
        if (type.kind !== "NonNullType") {
            variables[variableName] = undefined;
        }
    }
    return variables;
}
var GraphQLBase =  (function (_super) {
    tslib.__extends(GraphQLBase, _super);
    function GraphQLBase(props) {
        var _this = _super.call(this, props) || this;
        _this.withRef = false;
        _this.setWrappedInstance = _this.setWrappedInstance.bind(_this);
        return _this;
    }
    GraphQLBase.prototype.getWrappedInstance = function () {
        globals.invariant(this.withRef, 47);
        return this.wrappedInstance;
    };
    GraphQLBase.prototype.setWrappedInstance = function (ref) {
        this.wrappedInstance = ref;
    };
    return GraphQLBase;
}(React__namespace.Component));

function withQuery(document, operationOptions) {
    if (operationOptions === void 0) { operationOptions = {}; }
    var operation = parser.parser(document);
    var _a = operationOptions.options, options = _a === void 0 ? defaultMapPropsToOptions : _a, _b = operationOptions.skip, skip = _b === void 0 ? defaultMapPropsToSkip : _b, _c = operationOptions.alias, alias = _c === void 0 ? "Apollo" : _c;
    var mapPropsToOptions = options;
    if (typeof mapPropsToOptions !== "function") {
        mapPropsToOptions = function () { return options; };
    }
    var mapPropsToSkip = skip;
    if (typeof mapPropsToSkip !== "function") {
        mapPropsToSkip = function () { return skip; };
    }
    var lastResultProps;
    return function (WrappedComponent) {
        var graphQLDisplayName = "".concat(alias, "(").concat(getDisplayName$1(WrappedComponent), ")");
        var GraphQL =  (function (_super) {
            tslib.__extends(GraphQL, _super);
            function GraphQL() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            GraphQL.prototype.render = function () {
                var _this = this;
                var props = this.props;
                var shouldSkip = mapPropsToSkip(props);
                var opts = shouldSkip ? Object.create(null) : tslib.__assign({}, mapPropsToOptions(props));
                if (!shouldSkip && !opts.variables && operation.variables.length > 0) {
                    opts.variables = calculateVariablesFromProps(operation, props);
                }
                return (React__namespace.createElement(components.Query, tslib.__assign({}, opts, { displayName: graphQLDisplayName, skip: shouldSkip, query: document }), function (_a) {
                    var _b, _c;
                    _a.client; var data = _a.data, r = tslib.__rest(_a, ["client", "data"]);
                    if (operationOptions.withRef) {
                        _this.withRef = true;
                        props = Object.assign({}, props, {
                            ref: _this.setWrappedInstance,
                        });
                    }
                    if (shouldSkip) {
                        return (React__namespace.createElement(WrappedComponent, tslib.__assign({}, props, {})));
                    }
                    var result = Object.assign(r, data || {});
                    var name = operationOptions.name || "data";
                    var childProps = (_b = {}, _b[name] = result, _b);
                    if (operationOptions.props) {
                        var newResult = (_c = {},
                            _c[name] = result,
                            _c.ownProps = props,
                            _c);
                        lastResultProps = operationOptions.props(newResult, lastResultProps);
                        childProps = lastResultProps;
                    }
                    return (React__namespace.createElement(WrappedComponent, tslib.__assign({}, props, childProps)));
                }));
            };
            GraphQL.displayName = graphQLDisplayName;
            GraphQL.WrappedComponent = WrappedComponent;
            return GraphQL;
        }(GraphQLBase));
        return hoistNonReactStatics__default(GraphQL, WrappedComponent, {});
    };
}

function withMutation(document, operationOptions) {
    if (operationOptions === void 0) { operationOptions = {}; }
    var operation = parser.parser(document);
    var _a = operationOptions.options, options = _a === void 0 ? defaultMapPropsToOptions : _a, _b = operationOptions.alias, alias = _b === void 0 ? "Apollo" : _b;
    var mapPropsToOptions = options;
    if (typeof mapPropsToOptions !== "function")
        mapPropsToOptions = function () {
            return options;
        };
    return function (WrappedComponent) {
        var graphQLDisplayName = "".concat(alias, "(").concat(getDisplayName$1(WrappedComponent), ")");
        var GraphQL =  (function (_super) {
            tslib.__extends(GraphQL, _super);
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
                return (React__namespace.createElement(components.Mutation, tslib.__assign({ ignoreResults: true }, opts, { mutation: document }), function (mutate, _a) {
                    var _b, _c;
                    var data = _a.data, r = tslib.__rest(_a, ["data"]);
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
                    return React__namespace.createElement(WrappedComponent, tslib.__assign({}, props, childProps));
                }));
            };
            GraphQL.displayName = graphQLDisplayName;
            GraphQL.WrappedComponent = WrappedComponent;
            return GraphQL;
        }(GraphQLBase));
        return hoistNonReactStatics__default(GraphQL, WrappedComponent, {});
    };
}

function withSubscription(document, operationOptions) {
    if (operationOptions === void 0) { operationOptions = {}; }
    var operation = parser.parser(document);
    var _a = operationOptions.options, options = _a === void 0 ? defaultMapPropsToOptions : _a, _b = operationOptions.skip, skip = _b === void 0 ? defaultMapPropsToSkip : _b, _c = operationOptions.alias, alias = _c === void 0 ? "Apollo" : _c, shouldResubscribe = operationOptions.shouldResubscribe;
    var mapPropsToOptions = options;
    if (typeof mapPropsToOptions !== "function")
        mapPropsToOptions = function () { return options; };
    var mapPropsToSkip = skip;
    if (typeof mapPropsToSkip !== "function")
        mapPropsToSkip = function () { return skip; };
    var lastResultProps;
    return function (WrappedComponent) {
        var graphQLDisplayName = "".concat(alias, "(").concat(getDisplayName$1(WrappedComponent), ")");
        var GraphQL =  (function (_super) {
            tslib.__extends(GraphQL, _super);
            function GraphQL(props) {
                var _this = _super.call(this, props) || this;
                _this.state = { resubscribe: false };
                return _this;
            }
            GraphQL.prototype.updateResubscribe = function (resubscribe) {
                this.setState({ resubscribe: resubscribe });
            };
            GraphQL.prototype.componentDidUpdate = function (prevProps) {
                var resubscribe = !!(shouldResubscribe && shouldResubscribe(prevProps, this.props));
                if (this.state.resubscribe !== resubscribe) {
                    this.updateResubscribe(resubscribe);
                }
            };
            GraphQL.prototype.render = function () {
                var _this = this;
                var props = this.props;
                var shouldSkip = mapPropsToSkip(props);
                var opts = shouldSkip ? Object.create(null) : mapPropsToOptions(props);
                if (!shouldSkip && !opts.variables && operation.variables.length > 0) {
                    opts.variables = calculateVariablesFromProps(operation, props);
                }
                return (React__namespace.createElement(components.Subscription, tslib.__assign({}, opts, { displayName: graphQLDisplayName, skip: shouldSkip, subscription: document, shouldResubscribe: this.state.resubscribe }), function (_a) {
                    var _b, _c;
                    var data = _a.data, r = tslib.__rest(_a, ["data"]);
                    if (operationOptions.withRef) {
                        _this.withRef = true;
                        props = Object.assign({}, props, {
                            ref: _this.setWrappedInstance,
                        });
                    }
                    if (shouldSkip) {
                        return (React__namespace.createElement(WrappedComponent, tslib.__assign({}, props, {})));
                    }
                    var result = Object.assign(r, data || {});
                    var name = operationOptions.name || "data";
                    var childProps = (_b = {}, _b[name] = result, _b);
                    if (operationOptions.props) {
                        var newResult = (_c = {},
                            _c[name] = result,
                            _c.ownProps = props,
                            _c);
                        lastResultProps = operationOptions.props(newResult, lastResultProps);
                        childProps = lastResultProps;
                    }
                    return (React__namespace.createElement(WrappedComponent, tslib.__assign({}, props, childProps)));
                }));
            };
            GraphQL.displayName = graphQLDisplayName;
            GraphQL.WrappedComponent = WrappedComponent;
            return GraphQL;
        }(GraphQLBase));
        return hoistNonReactStatics__default(GraphQL, WrappedComponent, {});
    };
}

function graphql(document, operationOptions) {
    if (operationOptions === void 0) { operationOptions = {}; }
    switch (parser.parser(document).type) {
        case parser.DocumentType.Mutation:
            return withMutation(document, operationOptions);
        case parser.DocumentType.Subscription:
            return withSubscription(document, operationOptions);
        case parser.DocumentType.Query:
        default:
            return withQuery(document, operationOptions);
    }
}

function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || "Component";
}
function withApollo(WrappedComponent, operationOptions) {
    if (operationOptions === void 0) { operationOptions = {}; }
    var withDisplayName = "withApollo(".concat(getDisplayName(WrappedComponent), ")");
    var WithApollo =  (function (_super) {
        tslib.__extends(WithApollo, _super);
        function WithApollo(props) {
            var _this = _super.call(this, props) || this;
            _this.setWrappedInstance = _this.setWrappedInstance.bind(_this);
            return _this;
        }
        WithApollo.prototype.getWrappedInstance = function () {
            globals.invariant(operationOptions.withRef, 48);
            return this.wrappedInstance;
        };
        WithApollo.prototype.setWrappedInstance = function (ref) {
            this.wrappedInstance = ref;
        };
        WithApollo.prototype.render = function () {
            var _this = this;
            return (React__namespace.createElement(context.ApolloConsumer, null, function (client) {
                var props = Object.assign({}, _this.props, {
                    client: client,
                    ref: operationOptions.withRef ? _this.setWrappedInstance : undefined,
                });
                return React__namespace.createElement(WrappedComponent, tslib.__assign({}, props));
            }));
        };
        WithApollo.displayName = withDisplayName;
        WithApollo.WrappedComponent = WrappedComponent;
        return WithApollo;
    }(React__namespace.Component));
    return hoistNonReactStatics__default(WithApollo, WrappedComponent, {});
}

exports.graphql = graphql;
exports.withApollo = withApollo;
exports.withMutation = withMutation;
exports.withQuery = withQuery;
exports.withSubscription = withSubscription;
//# sourceMappingURL=hoc.cjs.map
