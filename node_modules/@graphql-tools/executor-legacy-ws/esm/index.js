import { observableToAsyncIterable } from '@graphql-tools/utils';
import { print } from 'graphql';
export var LEGACY_WS;
(function (LEGACY_WS) {
    LEGACY_WS["CONNECTION_INIT"] = "connection_init";
    LEGACY_WS["CONNECTION_ACK"] = "connection_ack";
    LEGACY_WS["CONNECTION_ERROR"] = "connection_error";
    LEGACY_WS["CONNECTION_KEEP_ALIVE"] = "ka";
    LEGACY_WS["START"] = "start";
    LEGACY_WS["STOP"] = "stop";
    LEGACY_WS["CONNECTION_TERMINATE"] = "connection_terminate";
    LEGACY_WS["DATA"] = "data";
    LEGACY_WS["ERROR"] = "error";
    LEGACY_WS["COMPLETE"] = "complete";
})(LEGACY_WS || (LEGACY_WS = {}));
export function buildWSLegacyExecutor(subscriptionsEndpoint, WebSocketImpl, options) {
    const observerById = new Map();
    let websocket = null;
    const ensureWebsocket = () => {
        websocket = new WebSocketImpl(subscriptionsEndpoint, 'graphql-ws', {
            followRedirects: true,
            headers: options === null || options === void 0 ? void 0 : options.headers,
            rejectUnauthorized: false,
            skipUTF8Validation: true,
        });
        websocket.onopen = () => {
            let payload = {};
            switch (typeof (options === null || options === void 0 ? void 0 : options.connectionParams)) {
                case 'function':
                    payload = options === null || options === void 0 ? void 0 : options.connectionParams();
                    break;
                case 'object':
                    payload = options === null || options === void 0 ? void 0 : options.connectionParams;
                    break;
            }
            websocket.send(JSON.stringify({
                type: LEGACY_WS.CONNECTION_INIT,
                payload,
            }));
        };
    };
    const cleanupWebsocket = () => {
        if (websocket != null && observerById.size === 0) {
            websocket.send(JSON.stringify({
                type: LEGACY_WS.CONNECTION_TERMINATE,
            }));
            websocket.terminate();
            websocket = null;
        }
    };
    return function legacyExecutor(request) {
        const id = Date.now().toString();
        return observableToAsyncIterable({
            subscribe(observer) {
                ensureWebsocket();
                if (websocket == null) {
                    throw new Error(`WebSocket connection is not found!`);
                }
                websocket.onmessage = event => {
                    const data = JSON.parse(event.data.toString('utf-8'));
                    switch (data.type) {
                        case LEGACY_WS.CONNECTION_ACK: {
                            if (websocket == null) {
                                throw new Error(`WebSocket connection is not found!`);
                            }
                            websocket.send(JSON.stringify({
                                type: LEGACY_WS.START,
                                id,
                                payload: {
                                    query: print(request.document),
                                    variables: request.variables,
                                    operationName: request.operationName,
                                },
                            }));
                            break;
                        }
                        case LEGACY_WS.CONNECTION_ERROR: {
                            observer.error(data.payload);
                            break;
                        }
                        case LEGACY_WS.CONNECTION_KEEP_ALIVE: {
                            break;
                        }
                        case LEGACY_WS.DATA: {
                            observer.next(data.payload);
                            break;
                        }
                        case LEGACY_WS.COMPLETE: {
                            if (websocket == null) {
                                throw new Error(`WebSocket connection is not found!`);
                            }
                            websocket.send(JSON.stringify({
                                type: LEGACY_WS.CONNECTION_TERMINATE,
                            }));
                            observer.complete();
                            cleanupWebsocket();
                            break;
                        }
                    }
                };
                return {
                    unsubscribe: () => {
                        websocket === null || websocket === void 0 ? void 0 : websocket.send(JSON.stringify({
                            type: LEGACY_WS.STOP,
                            id,
                        }));
                        cleanupWebsocket();
                    },
                };
            },
        });
    };
}
