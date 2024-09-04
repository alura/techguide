"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApolloServerPluginDrainHttpServer = void 0;
const stoppable_1 = require("./stoppable");
function ApolloServerPluginDrainHttpServer(options) {
    const stopper = new stoppable_1.Stopper(options.httpServer);
    return {
        async serverWillStart() {
            return {
                async drainServer() {
                    var _a;
                    await stopper.stop((_a = options.stopGracePeriodMillis) !== null && _a !== void 0 ? _a : 10000);
                },
            };
        },
    };
}
exports.ApolloServerPluginDrainHttpServer = ApolloServerPluginDrainHttpServer;
//# sourceMappingURL=index.js.map