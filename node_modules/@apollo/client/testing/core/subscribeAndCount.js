import { asyncMap } from "../../utilities/index.js";
export default function subscribeAndCount(reject, observable, cb) {
    // Use a Promise queue to prevent callbacks from being run out of order.
    var queue = Promise.resolve();
    var handleCount = 0;
    var subscription = asyncMap(observable, function (result) {
        // All previous asynchronous callbacks must complete before cb can
        // be invoked with this result.
        return (queue = queue
            .then(function () {
            return cb(++handleCount, result);
        })
            .catch(error));
    }).subscribe({ error: error });
    function error(e) {
        subscription.unsubscribe();
        reject(e);
    }
    return subscription;
}
//# sourceMappingURL=subscribeAndCount.js.map