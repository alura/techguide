export function iterateObserversSafely(observers, method, argument) {
    // In case observers is modified during iteration, we need to commit to the
    // original elements, which also provides an opportunity to filter them down
    // to just the observers with the given method.
    var observersWithMethod = [];
    observers.forEach(function (obs) { return obs[method] && observersWithMethod.push(obs); });
    observersWithMethod.forEach(function (obs) { return obs[method](argument); });
}
//# sourceMappingURL=iteration.js.map