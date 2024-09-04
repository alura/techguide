'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

require('../utilities/globals');
var tslib = require('tslib');
var React = require('react');
var core$1 = require('../core');
var cache = require('../cache');
var context = require('../react/context');
var core = require('./core');

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

var MockedProvider =  (function (_super) {
    tslib.__extends(MockedProvider, _super);
    function MockedProvider(props) {
        var _this = _super.call(this, props) || this;
        var _a = _this.props, mocks = _a.mocks, addTypename = _a.addTypename, defaultOptions = _a.defaultOptions, cache$1 = _a.cache, resolvers = _a.resolvers, link = _a.link, showWarnings = _a.showWarnings, _b = _a.connectToDevTools, connectToDevTools = _b === void 0 ? false : _b;
        var client = new core$1.ApolloClient({
            cache: cache$1 || new cache.InMemoryCache({ addTypename: addTypename }),
            defaultOptions: defaultOptions,
            connectToDevTools: connectToDevTools,
            link: link || new core.MockLink(mocks || [], addTypename, { showWarnings: showWarnings }),
            resolvers: resolvers,
        });
        _this.state = {
            client: client,
        };
        return _this;
    }
    MockedProvider.prototype.render = function () {
        var _a = this.props, children = _a.children, childProps = _a.childProps;
        var client = this.state.client;
        return React__namespace.isValidElement(children) ?
            React__namespace.createElement(context.ApolloProvider, { client: client }, React__namespace.cloneElement(React__namespace.Children.only(children), tslib.__assign({}, childProps)))
            : null;
    };
    MockedProvider.prototype.componentWillUnmount = function () {
        this.state.client.stop();
    };
    MockedProvider.defaultProps = {
        addTypename: true,
    };
    return MockedProvider;
}(React__namespace.Component));

exports.MockedProvider = MockedProvider;
for (var k in core) {
    if (k !== 'default' && !exports.hasOwnProperty(k)) exports[k] = core[k];
}
//# sourceMappingURL=testing.cjs.map
