/// <reference types="ws" />
import { Executor } from '@graphql-tools/utils';
import WebSocket from 'isomorphic-ws';
export declare enum LEGACY_WS {
    CONNECTION_INIT = "connection_init",
    CONNECTION_ACK = "connection_ack",
    CONNECTION_ERROR = "connection_error",
    CONNECTION_KEEP_ALIVE = "ka",
    START = "start",
    STOP = "stop",
    CONNECTION_TERMINATE = "connection_terminate",
    DATA = "data",
    ERROR = "error",
    COMPLETE = "complete"
}
export interface LegacyWSExecutorOpts {
    connectionParams?: Record<string, any>;
    headers?: Record<string, any>;
}
export declare function buildWSLegacyExecutor(subscriptionsEndpoint: string, WebSocketImpl: typeof WebSocket, options?: LegacyWSExecutorOpts): Executor;
