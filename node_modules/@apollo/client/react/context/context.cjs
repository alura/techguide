'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var globals = require('../../utilities/globals');
var React = require('rehackt');
var utilities = require('../../utilities');
var tslib = require('tslib');

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

var contextKey = utilities.canUseSymbol ? Symbol.for("__APOLLO_CONTEXT__") : "__APOLLO_CONTEXT__";
function getApolloContext() {
    globals.invariant("createContext" in React__namespace, 45);
    var context = React__namespace.createContext[contextKey];
    if (!context) {
        Object.defineProperty(React__namespace.createContext, contextKey, {
            value: (context = React__namespace.createContext({})),
            enumerable: false,
            writable: false,
            configurable: true,
        });
        context.displayName = "ApolloContext";
    }
    return context;
}
var resetApolloContext = getApolloContext;

var ApolloConsumer = function (props) {
    var ApolloContext = getApolloContext();
    return (React__namespace.createElement(ApolloContext.Consumer, null, function (context) {
        globals.invariant(context && context.client, 44);
        return props.children(context.client);
    }));
};

var ApolloProvider = function (_a) {
    var client = _a.client, children = _a.children;
    var ApolloContext = getApolloContext();
    var parentContext = React__namespace.useContext(ApolloContext);
    var context = React__namespace.useMemo(function () {
        return tslib.__assign(tslib.__assign({}, parentContext), { client: client || parentContext.client });
    }, [parentContext, client]);
    globals.invariant(context.client, 46);
    return (React__namespace.createElement(ApolloContext.Provider, { value: context }, children));
};

exports.ApolloConsumer = ApolloConsumer;
exports.ApolloProvider = ApolloProvider;
exports.getApolloContext = getApolloContext;
exports.resetApolloContext = resetApolloContext;
//# sourceMappingURL=context.cjs.map
