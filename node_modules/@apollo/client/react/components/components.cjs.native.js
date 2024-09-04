'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var PropTypes = require('prop-types');
var hooks = require('../hooks');

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

var PropTypes__namespace = /*#__PURE__*/_interopNamespace(PropTypes);

function Query(props) {
    var children = props.children, query = props.query, options = tslib.__rest(props, ["children", "query"]);
    var result = hooks.useQuery(query, options);
    return result ? children(result) : null;
}
Query.propTypes = {
    client: PropTypes__namespace.object,
    children: PropTypes__namespace.func.isRequired,
    fetchPolicy: PropTypes__namespace.string,
    notifyOnNetworkStatusChange: PropTypes__namespace.bool,
    onCompleted: PropTypes__namespace.func,
    onError: PropTypes__namespace.func,
    pollInterval: PropTypes__namespace.number,
    query: PropTypes__namespace.object.isRequired,
    variables: PropTypes__namespace.object,
    ssr: PropTypes__namespace.bool,
    partialRefetch: PropTypes__namespace.bool,
    returnPartialData: PropTypes__namespace.bool,
};

function Mutation(props) {
    var _a = hooks.useMutation(props.mutation, props), runMutation = _a[0], result = _a[1];
    return props.children ? props.children(runMutation, result) : null;
}
Mutation.propTypes = {
    mutation: PropTypes__namespace.object.isRequired,
    variables: PropTypes__namespace.object,
    optimisticResponse: PropTypes__namespace.oneOfType([PropTypes__namespace.object, PropTypes__namespace.func]),
    refetchQueries: PropTypes__namespace.oneOfType([
        PropTypes__namespace.arrayOf(PropTypes__namespace.oneOfType([PropTypes__namespace.string, PropTypes__namespace.object])),
        PropTypes__namespace.func,
    ]),
    awaitRefetchQueries: PropTypes__namespace.bool,
    update: PropTypes__namespace.func,
    children: PropTypes__namespace.func.isRequired,
    onCompleted: PropTypes__namespace.func,
    onError: PropTypes__namespace.func,
    fetchPolicy: PropTypes__namespace.string,
};

function Subscription(props) {
    var result = hooks.useSubscription(props.subscription, props);
    return props.children && result ? props.children(result) : null;
}
Subscription.propTypes = {
    subscription: PropTypes__namespace.object.isRequired,
    variables: PropTypes__namespace.object,
    children: PropTypes__namespace.func,
    onSubscriptionData: PropTypes__namespace.func,
    onData: PropTypes__namespace.func,
    onSubscriptionComplete: PropTypes__namespace.func,
    onComplete: PropTypes__namespace.func,
    shouldResubscribe: PropTypes__namespace.oneOfType([PropTypes__namespace.func, PropTypes__namespace.bool]),
};

exports.Mutation = Mutation;
exports.Query = Query;
exports.Subscription = Subscription;
//# sourceMappingURL=components.cjs.map
