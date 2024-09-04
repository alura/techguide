"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildGraphQLWSExecutor = void 0;
const tslib_1 = require("tslib");
const utils_1 = require("@graphql-tools/utils");
const repeater_1 = require("@repeaterjs/repeater");
const graphql_1 = require("graphql");
const graphql_ws_1 = require("graphql-ws");
const isomorphic_ws_1 = tslib_1.__importDefault(require("isomorphic-ws"));
function isClient(client) {
    return 'subscribe' in client;
}
function buildGraphQLWSExecutor(clientOptionsOrClient) {
    let graphqlWSClient;
    if (isClient(clientOptionsOrClient)) {
        graphqlWSClient = clientOptionsOrClient;
    }
    else {
        graphqlWSClient = (0, graphql_ws_1.createClient)({
            webSocketImpl: isomorphic_ws_1.default,
            lazy: true,
            ...clientOptionsOrClient,
        });
        if (clientOptionsOrClient.onClient) {
            clientOptionsOrClient.onClient(graphqlWSClient);
        }
    }
    return function GraphQLWSExecutor(executionRequest) {
        const { document, variables, operationName, extensions, operationType = (0, utils_1.getOperationASTFromRequest)(executionRequest).operation, } = executionRequest;
        const query = (0, graphql_1.print)(document);
        if (operationType === 'subscription') {
            return new repeater_1.Repeater(function repeaterExecutor(push, stop) {
                const unsubscribe = graphqlWSClient.subscribe({
                    query,
                    variables,
                    operationName,
                    extensions,
                }, {
                    next(data) {
                        return push(data);
                    },
                    error(error) {
                        return stop(error);
                    },
                    complete() {
                        return stop();
                    },
                });
                return stop.finally(unsubscribe);
            });
        }
        return new Promise((resolve, reject) => {
            const unsubscribe = graphqlWSClient.subscribe({
                query,
                variables,
                operationName,
                extensions,
            }, {
                next(data) {
                    return resolve(data);
                },
                error(error) {
                    return reject(error);
                },
                complete() {
                    unsubscribe();
                },
            });
        });
    };
}
exports.buildGraphQLWSExecutor = buildGraphQLWSExecutor;
