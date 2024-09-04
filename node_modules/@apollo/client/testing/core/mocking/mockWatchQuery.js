import mockQueryManager from "./mockQueryManager.js";
export default (function() {
    var mockedResponses = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        mockedResponses[_i] = arguments[_i];
    }
    var queryManager = mockQueryManager.apply(void 0, mockedResponses);
    var firstRequest = mockedResponses[0].request;
    return queryManager.watchQuery({
        query: firstRequest.query,
        variables: firstRequest.variables,
        notifyOnNetworkStatusChange: false, // XXX might not always be the right option. Set for legacy reasons.
    });
});
//# sourceMappingURL=mockWatchQuery.js.map