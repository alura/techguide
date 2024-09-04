import { handleProtocols, makeServer } from '../server.mjs';
import { CloseCode } from '../common.mjs';
import { limitCloseReason } from '../utils.mjs';
/**
 * Make the behaviour for using a [uWebSockets.js](https://github.com/uNetworking/uWebSockets.js) WebSocket server.
 * This is a basic starter, feel free to copy the code over and adjust it to your needs
 *
 * @category Server/uWebSockets
 */
export function makeBehavior(options, behavior = {}, 
/**
 * The timout between dispatched keep-alive messages. Internally uses the [ws Ping and Pongs]((https://developer.mozilla.org/en-US/docs/Web/API/wss_API/Writing_ws_servers#Pings_and_Pongs_The_Heartbeat_of_wss))
 * to check that the link between the clients and the server is operating and to prevent the link
 * from being broken due to idling.
 *
 * @default 12_000 // 12 seconds
 */
keepAlive = 12000) {
    const isProd = process.env.NODE_ENV === 'production';
    const server = makeServer(options);
    const clients = new Map();
    let onDrain = () => {
        // gets called when backpressure drains
    };
    return Object.assign(Object.assign({}, behavior), { pong(...args) {
            var _a;
            (_a = behavior.pong) === null || _a === void 0 ? void 0 : _a.call(behavior, ...args);
            const [socket] = args;
            const client = clients.get(socket);
            if (!client)
                throw new Error('Pong received for a missing client');
            if (client.pongWaitTimeout) {
                clearTimeout(client.pongWaitTimeout);
                client.pongWaitTimeout = null;
            }
        },
        upgrade(...args) {
            var _a;
            (_a = behavior.upgrade) === null || _a === void 0 ? void 0 : _a.call(behavior, ...args);
            const [res, req, context] = args;
            const headers = {};
            req.forEach((key, value) => {
                headers[key] = value;
            });
            res.upgrade({
                persistedRequest: {
                    method: req.getMethod(),
                    url: req.getUrl(),
                    query: req.getQuery(),
                    headers,
                },
            }, req.getHeader('sec-websocket-key'), handleProtocols(req.getHeader('sec-websocket-protocol')) ||
                new Uint8Array(), req.getHeader('sec-websocket-extensions'), context);
        },
        open(...args) {
            var _a;
            (_a = behavior.open) === null || _a === void 0 ? void 0 : _a.call(behavior, ...args);
            const socket = args[0];
            const persistedRequest = socket.persistedRequest;
            // prepare client object
            const client = {
                pingInterval: null,
                pongWaitTimeout: null,
                handleMessage: () => {
                    throw new Error('Message received before handler was registered');
                },
                closed: () => {
                    throw new Error('Closed before handler was registered');
                },
            };
            client.closed = server.opened({
                protocol: handleProtocols(persistedRequest.headers['sec-websocket-protocol'] || '') || '',
                send: async (message) => {
                    // the socket might have been destroyed in the meantime
                    if (!clients.has(socket))
                        return;
                    if (!socket.send(message))
                        // if backpressure is built up wait for drain
                        await new Promise((resolve) => (onDrain = resolve));
                },
                close: (code, reason) => {
                    // end socket in next tick making sure the client is registered
                    setImmediate(() => {
                        // the socket might have been destroyed before issuing a close
                        if (clients.has(socket))
                            socket.end(code, reason);
                    });
                },
                onMessage: (cb) => (client.handleMessage = cb),
            }, { socket, persistedRequest });
            if (keepAlive > 0 && isFinite(keepAlive)) {
                client.pingInterval = setInterval(() => {
                    // terminate the connection after pong wait has passed because the client is idle
                    client.pongWaitTimeout = setTimeout(() => socket.close(), keepAlive);
                    socket.ping();
                }, keepAlive);
            }
            clients.set(socket, client);
        },
        drain(...args) {
            var _a;
            (_a = behavior.drain) === null || _a === void 0 ? void 0 : _a.call(behavior, ...args);
            onDrain();
        },
        async message(...args) {
            var _a;
            (_a = behavior.message) === null || _a === void 0 ? void 0 : _a.call(behavior, ...args);
            const [socket, message] = args;
            const client = clients.get(socket);
            if (!client)
                throw new Error('Message received for a missing client');
            try {
                await client.handleMessage(Buffer.from(message).toString());
            }
            catch (err) {
                console.error('Internal error occurred during message handling. ' +
                    'Please check your implementation.', err);
                socket.end(CloseCode.InternalServerError, isProd
                    ? 'Internal server error'
                    : limitCloseReason(err instanceof Error ? err.message : String(err), 'Internal server error'));
            }
        },
        close(...args) {
            var _a;
            (_a = behavior.close) === null || _a === void 0 ? void 0 : _a.call(behavior, ...args);
            const [socket, code, message] = args;
            const client = clients.get(socket);
            if (!client)
                throw new Error('Closing a missing client');
            if (client.pongWaitTimeout)
                clearTimeout(client.pongWaitTimeout);
            if (client.pingInterval)
                clearTimeout(client.pingInterval);
            client.closed(code, Buffer.from(message).toString());
            clients.delete(socket);
        } });
}
