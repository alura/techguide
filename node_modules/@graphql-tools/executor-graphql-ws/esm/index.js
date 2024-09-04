import { getOperationASTFromRequest } from '@graphql-tools/utils';
import { Repeater } from '@repeaterjs/repeater';
import { print } from 'graphql';
import { createClient } from 'graphql-ws';
import WebSocket from 'isomorphic-ws';
function isClient(client) {
    return 'subscribe' in client;
}
export function buildGraphQLWSExecutor(clientOptionsOrClient) {
    let graphqlWSClient;
    if (isClient(clientOptionsOrClient)) {
        graphqlWSClient = clientOptionsOrClient;
    }
    else {
        graphqlWSClient = createClient({
            webSocketImpl: WebSocket,
            lazy: true,
            ...clientOptionsOrClient,
        });
        if (clientOptionsOrClient.onClient) {
            clientOptionsOrClient.onClient(graphqlWSClient);
        }
    }
    return function GraphQLWSExecutor(executionRequest) {
        const { document, variables, operationName, extensions, operationType = getOperationASTFromRequest(executionRequest).operation, } = executionRequest;
        const query = print(document);
        if (operationType === 'subscription') {
            return new Repeater(function repeaterExecutor(push, stop) {
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
