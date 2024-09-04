'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var React = require('rehackt');
var context = require('../context');
var trie = require('@wry/trie');
var cache = require('../../cache');
var server = require('react-dom/server');

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

function makeQueryInfoTrie() {
    return new trie.Trie(false, function () { return ({
        seen: false,
        observable: null,
    }); });
}
var RenderPromises =  (function () {
    function RenderPromises() {
        this.queryPromises = new Map();
        this.queryInfoTrie = makeQueryInfoTrie();
        this.stopped = false;
    }
    RenderPromises.prototype.stop = function () {
        if (!this.stopped) {
            this.queryPromises.clear();
            this.queryInfoTrie = makeQueryInfoTrie();
            this.stopped = true;
        }
    };
    RenderPromises.prototype.registerSSRObservable = function (observable) {
        if (this.stopped)
            return;
        this.lookupQueryInfo(observable.options).observable = observable;
    };
    RenderPromises.prototype.getSSRObservable = function (props) {
        return this.lookupQueryInfo(props).observable;
    };
    RenderPromises.prototype.addQueryPromise = function (queryInstance, finish) {
        if (!this.stopped) {
            var info = this.lookupQueryInfo(queryInstance.getOptions());
            if (!info.seen) {
                this.queryPromises.set(queryInstance.getOptions(), new Promise(function (resolve) {
                    resolve(queryInstance.fetchData());
                }));
                return null;
            }
        }
        return finish ? finish() : null;
    };
    RenderPromises.prototype.addObservableQueryPromise = function (obsQuery) {
        return this.addQueryPromise({
            getOptions: function () { return obsQuery.options; },
            fetchData: function () {
                return new Promise(function (resolve) {
                    var sub = obsQuery.subscribe({
                        next: function (result) {
                            if (!result.loading) {
                                resolve();
                                sub.unsubscribe();
                            }
                        },
                        error: function () {
                            resolve();
                            sub.unsubscribe();
                        },
                        complete: function () {
                            resolve();
                        },
                    });
                });
            },
        });
    };
    RenderPromises.prototype.hasPromises = function () {
        return this.queryPromises.size > 0;
    };
    RenderPromises.prototype.consumeAndAwaitPromises = function () {
        var _this = this;
        var promises = [];
        this.queryPromises.forEach(function (promise, queryInstance) {
            _this.lookupQueryInfo(queryInstance).seen = true;
            promises.push(promise);
        });
        this.queryPromises.clear();
        return Promise.all(promises);
    };
    RenderPromises.prototype.lookupQueryInfo = function (props) {
        return this.queryInfoTrie.lookup(props.query, cache.canonicalStringify(props.variables));
    };
    return RenderPromises;
}());

function getDataFromTree(tree, context) {
    if (context === void 0) { context = {}; }
    return getMarkupFromTree({
        tree: tree,
        context: context,
        renderFunction: server.renderToStaticMarkup,
    });
}
function getMarkupFromTree(_a) {
    var tree = _a.tree, _b = _a.context, context$1 = _b === void 0 ? {} : _b,
    _c = _a.renderFunction,
    renderFunction = _c === void 0 ? server.renderToStaticMarkup : _c;
    var renderPromises = new RenderPromises();
    function process() {
        var ApolloContext = context.getApolloContext();
        return new Promise(function (resolve) {
            var element = React__namespace.createElement(ApolloContext.Provider, { value: tslib.__assign(tslib.__assign({}, context$1), { renderPromises: renderPromises }) }, tree);
            resolve(renderFunction(element));
        })
            .then(function (html) {
            return renderPromises.hasPromises() ?
                renderPromises.consumeAndAwaitPromises().then(process)
                : html;
        })
            .finally(function () {
            renderPromises.stop();
        });
    }
    return Promise.resolve().then(process);
}

function renderToStringWithData(component) {
    return getMarkupFromTree({
        tree: component,
        renderFunction: server.renderToString,
    });
}

exports.RenderPromises = RenderPromises;
exports.getDataFromTree = getDataFromTree;
exports.getMarkupFromTree = getMarkupFromTree;
exports.renderToStringWithData = renderToStringWithData;
//# sourceMappingURL=ssr.cjs.map
