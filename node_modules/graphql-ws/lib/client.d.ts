/**
 *
 * client
 *
 */
import { ExecutionResult } from 'graphql';
import { Sink, ID, Disposable, Message, ConnectionInitMessage, ConnectionAckMessage, PingMessage, PongMessage, SubscribePayload, JSONMessageReviver, JSONMessageReplacer } from './common';
/** This file is the entry point for browsers, re-export common elements. */
export * from './common';
/**
 * WebSocket started connecting.
 *
 * @category Client
 */
export type EventConnecting = 'connecting';
/**
 * WebSocket has opened.
 *
 * @category Client
 */
export type EventOpened = 'opened';
/**
 * Open WebSocket connection has been acknowledged.
 *
 * @category Client
 */
export type EventConnected = 'connected';
/**
 * `PingMessage` has been received or sent.
 *
 * @category Client
 */
export type EventPing = 'ping';
/**
 * `PongMessage` has been received or sent.
 *
 * @category Client
 */
export type EventPong = 'pong';
/**
 * A message has been received.
 *
 * @category Client
 */
export type EventMessage = 'message';
/**
 * WebSocket connection has closed.
 *
 * @category Client
 */
export type EventClosed = 'closed';
/**
 * WebSocket connection had an error or client had an internal error.
 *
 * @category Client
 */
export type EventError = 'error';
/**
 * All events that could occur.
 *
 * @category Client
 */
export type Event = EventConnecting | EventOpened | EventConnected | EventPing | EventPong | EventMessage | EventClosed | EventError;
/** @category Client */
export type EventConnectingListener = () => void;
/**
 * The first argument is actually the `WebSocket`, but to avoid
 * bundling DOM typings because the client can run in Node env too,
 * you should assert the websocket type during implementation.
 *
 * @category Client
 */
export type EventOpenedListener = (socket: unknown) => void;
/**
 * The first argument is actually the `WebSocket`, but to avoid
 * bundling DOM typings because the client can run in Node env too,
 * you should assert the websocket type during implementation.
 *
 * Also, the second argument is the optional payload that the server may
 * send through the `ConnectionAck` message.
 *
 * @category Client
 */
export type EventConnectedListener = (socket: unknown, payload: ConnectionAckMessage['payload']) => void;
/**
 * The first argument communicates whether the ping was received from the server.
 * If `false`, the ping was sent by the client.
 *
 * @category Client
 */
export type EventPingListener = (received: boolean, payload: PingMessage['payload']) => void;
/**
 * The first argument communicates whether the pong was received from the server.
 * If `false`, the pong was sent by the client.
 *
 * @category Client
 */
export type EventPongListener = (received: boolean, payload: PongMessage['payload']) => void;
/**
 * Called for all **valid** messages received by the client. Mainly useful for
 * debugging and logging received messages.
 *
 * @category Client
 */
export type EventMessageListener = (message: Message) => void;
/**
 * The argument is actually the websocket `CloseEvent`, but to avoid
 * bundling DOM typings because the client can run in Node env too,
 * you should assert the websocket type during implementation.
 *
 * @category Client
 */
export type EventClosedListener = (event: unknown) => void;
/**
 * Events dispatched from the WebSocket `onerror` are handled in this listener,
 * as well as all internal client errors that could throw.
 *
 * @category Client
 */
export type EventErrorListener = (error: unknown) => void;
/** @category Client */
export type EventListener<E extends Event> = E extends EventConnecting ? EventConnectingListener : E extends EventOpened ? EventOpenedListener : E extends EventConnected ? EventConnectedListener : E extends EventPing ? EventPingListener : E extends EventPong ? EventPongListener : E extends EventMessage ? EventMessageListener : E extends EventClosed ? EventClosedListener : E extends EventError ? EventErrorListener : never;
/**
 * Configuration used for the GraphQL over WebSocket client.
 *
 * @category Client
 */
export interface ClientOptions<P extends ConnectionInitMessage['payload'] = ConnectionInitMessage['payload']> {
    /**
     * URL of the GraphQL over WebSocket Protocol compliant server to connect.
     *
     * If the option is a function, it will be called on every WebSocket connection attempt.
     * Returning a promise is supported too and the connecting phase will stall until it
     * resolves with the URL.
     *
     * A good use-case for having a function is when using the URL for authentication,
     * where subsequent reconnects (due to auth) may have a refreshed identity token in
     * the URL.
     */
    url: string | (() => Promise<string> | string);
    /**
     * Optional parameters, passed through the `payload` field with the `ConnectionInit` message,
     * that the client specifies when establishing a connection with the server. You can use this
     * for securely passing arguments for authentication.
     *
     * If you decide to return a promise, keep in mind that the server might kick you off if it
     * takes too long to resolve! Check the `connectionInitWaitTimeout` on the server for more info.
     *
     * Throwing an error from within this function will close the socket with the `Error` message
     * in the close event reason.
     */
    connectionParams?: P | (() => Promise<P> | P);
    /**
     * Controls when should the connection be established.
     *
     * - `false`: Establish a connection immediately. Use `onNonLazyError` to handle errors.
     * - `true`: Establish a connection on first subscribe and close on last unsubscribe. Use
     * the subscription sink's `error` to handle errors.
     *
     * @default true
     */
    lazy?: boolean;
    /**
     * Used ONLY when the client is in non-lazy mode (`lazy = false`). When
     * using this mode, the errors might have no sinks to report to; however,
     * to avoid swallowing errors, consider using `onNonLazyError`,  which will
     * be called when either:
     * - An unrecoverable error/close event occurs
     * - Silent retry attempts have been exceeded
     *
     * After a client has errored out, it will NOT perform any automatic actions.
     *
     * The argument can be a websocket `CloseEvent` or an `Error`. To avoid bundling
     * DOM types, you should derive and assert the correct type. When receiving:
     * - A `CloseEvent`: retry attempts have been exceeded or the specific
     * close event is labeled as fatal (read more in `retryAttempts`).
     * - An `Error`: some internal issue has occured, all internal errors are
     * fatal by nature.
     *
     * @default console.error
     */
    onNonLazyError?: (errorOrCloseEvent: unknown) => void;
    /**
     * How long should the client wait before closing the socket after the last oparation has
     * completed. This is meant to be used in combination with `lazy`. You might want to have
     * a calmdown time before actually closing the connection. Kinda' like a lazy close "debounce".
     *
     * @default 0
     */
    lazyCloseTimeout?: number;
    /**
     * The timout between dispatched keep-alive messages, naimly server pings. Internally
     * dispatches the `PingMessage` type to the server and expects a `PongMessage` in response.
     * This helps with making sure that the connection with the server is alive and working.
     *
     * Timeout countdown starts from the moment the socket was opened and subsequently
     * after every received `PongMessage`.
     *
     * Note that NOTHING will happen automatically with the client if the server never
     * responds to a `PingMessage` with a `PongMessage`. If you want the connection to close,
     * you should implement your own logic on top of the client. A simple example looks like this:
     *
     * ```js
     * import { createClient } from 'graphql-ws';
     *
     * let activeSocket, timedOut;
     * createClient({
     *   url: 'ws://i.time.out:4000/after-5/seconds',
     *   keepAlive: 10_000, // ping server every 10 seconds
     *   on: {
     *     connected: (socket) => (activeSocket = socket),
     *     ping: (received) => {
     *       if (!received) // sent
     *         timedOut = setTimeout(() => {
     *           if (activeSocket.readyState === WebSocket.OPEN)
     *             activeSocket.close(4408, 'Request Timeout');
     *         }, 5_000); // wait 5 seconds for the pong and then close the connection
     *     },
     *     pong: (received) => {
     *       if (received) clearTimeout(timedOut); // pong is received, clear connection close timeout
     *     },
     *   },
     * });
     * ```
     *
     * @default 0
     */
    keepAlive?: number;
    /**
     * The amount of time for which the client will wait
     * for `ConnectionAck` message.
     *
     * Set the value to `Infinity`, `''`, `0`, `null` or `undefined` to skip waiting.
     *
     * If the wait timeout has passed and the server
     * has not responded with `ConnectionAck` message,
     * the client will terminate the socket by
     * dispatching a close event `4418: Connection acknowledgement timeout`
     *
     * @default 0
     */
    connectionAckWaitTimeout?: number;
    /**
     * Disable sending the `PongMessage` automatically.
     *
     * Useful for when integrating your own custom client pinger that performs
     * custom actions before responding to a ping, or to pass along the optional pong
     * message payload. Please check the readme recipes for a concrete example.
     */
    disablePong?: boolean;
    /**
     * How many times should the client try to reconnect on abnormal socket closure before it errors out?
     *
     * The library classifies the following close events as fatal:
     * - _All internal WebSocket fatal close codes (check `isFatalInternalCloseCode` in `src/client.ts` for exact list)_
     * - `4500: Internal server error`
     * - `4005: Internal client error`
     * - `4400: Bad request`
     * - `4004: Bad response`
     * - `4401: Unauthorized` _tried subscribing before connect ack_
     * - `4406: Subprotocol not acceptable`
     * - `4409: Subscriber for <id> already exists` _distinction is very important_
     * - `4429: Too many initialisation requests`
     *
     * In addition to the aforementioned close events, any _non-CloseEvent_ connection problem
     * is considered fatal by default. However, this specific behaviour can be altered by using
     * the `shouldRetry` option.
     *
     * These events are reported immediately and the client will not reconnect.
     *
     * @default 5
     */
    retryAttempts?: number;
    /**
     * Control the wait time between retries. You may implement your own strategy
     * by timing the resolution of the returned promise with the retries count.
     * `retries` argument counts actual connection attempts, so it will begin with
     * 0 after the first retryable disconnect.
     *
     * @default 'Randomised exponential backoff'
     */
    retryWait?: (retries: number) => Promise<void>;
    /**
     * Check if the close event or connection error is fatal. If you return `false`,
     * the client will fail immediately without additional retries; however, if you
     * return `true`, the client will keep retrying until the `retryAttempts` have
     * been exceeded.
     *
     * The argument is whatever has been thrown during the connection phase.
     *
     * Beware, the library classifies a few close events as fatal regardless of
     * what is returned here. They are listed in the documentation of the `retryAttempts`
     * option.
     *
     * @default 'Only `CloseEvent`s'
     */
    shouldRetry?: (errOrCloseEvent: unknown) => boolean;
    /**
     * @deprecated Use `shouldRetry` instead.
     *
     * Check if the close event or connection error is fatal. If you return `true`,
     * the client will fail immediately without additional retries; however, if you
     * return `false`, the client will keep retrying until the `retryAttempts` have
     * been exceeded.
     *
     * The argument is either a WebSocket `CloseEvent` or an error thrown during
     * the connection phase.
     *
     * Beware, the library classifies a few close events as fatal regardless of
     * what is returned. They are listed in the documentation of the `retryAttempts`
     * option.
     *
     * @default 'Any non-`CloseEvent`'
     */
    isFatalConnectionProblem?: (errOrCloseEvent: unknown) => boolean;
    /**
     * Register listeners before initialising the client. This way
     * you can ensure to catch all client relevant emitted events.
     *
     * The listeners passed in will **always** be the first ones
     * to get the emitted event before other registered listeners.
     */
    on?: Partial<{
        [event in Event]: EventListener<event>;
    }>;
    /**
     * A custom WebSocket implementation to use instead of the
     * one provided by the global scope. Mostly useful for when
     * using the client outside of the browser environment.
     */
    webSocketImpl?: unknown;
    /**
     * A custom ID generator for identifying subscriptions.
     *
     * The default generates a v4 UUID to be used as the ID using `Math`
     * as the random number generator. Supply your own generator
     * in case you need more uniqueness.
     *
     * Reference: https://gist.github.com/jed/982883
     */
    generateID?: (payload: SubscribePayload) => ID;
    /**
     * An optional override for the JSON.parse function used to hydrate
     * incoming messages to this client. Useful for parsing custom datatypes
     * out of the incoming JSON.
     */
    jsonMessageReviver?: JSONMessageReviver;
    /**
     * An optional override for the JSON.stringify function used to serialize
     * outgoing messages from this client. Useful for serializing custom
     * datatypes out to the client.
     */
    jsonMessageReplacer?: JSONMessageReplacer;
}
/** @category Client */
export interface Client extends Disposable {
    /**
     * Listens on the client which dispatches events about the socket state.
     */
    on<E extends Event>(event: E, listener: EventListener<E>): () => void;
    /**
     * Subscribes through the WebSocket following the config parameters. It
     * uses the `sink` to emit received data or errors. Returns a _cleanup_
     * function used for dropping the subscription and cleaning stuff up.
     */
    subscribe<Data = Record<string, unknown>, Extensions = unknown>(payload: SubscribePayload, sink: Sink<ExecutionResult<Data, Extensions>>): () => void;
    /**
     * Terminates the WebSocket abruptly and immediately.
     *
     * A close event `4499: Terminated` is issued to the current WebSocket and an
     * artificial `{ code: 4499, reason: 'Terminated', wasClean: false }` close-event-like
     * object is immediately emitted without waiting for the one coming from `WebSocket.onclose`.
     *
     * Terminating is not considered fatal and a connection retry will occur as expected.
     *
     * Useful in cases where the WebSocket is stuck and not emitting any events;
     * can happen on iOS Safari, see: https://github.com/enisdenjo/graphql-ws/discussions/290.
     */
    terminate(): void;
}
/**
 * Creates a disposable GraphQL over WebSocket client.
 *
 * @category Client
 */
export declare function createClient<P extends ConnectionInitMessage['payload'] = ConnectionInitMessage['payload']>(options: ClientOptions<P>): Client;
