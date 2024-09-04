import { handleProtocols, makeServer } from '../server.mjs';
import { DEPRECATED_GRAPHQL_WS_PROTOCOL, CloseCode, } from '../common.mjs';
import { limitCloseReason } from '../utils.mjs';
/**
 * Use the server on a [ws](https://github.com/websockets/ws) ws server.
 * This is a basic starter, feel free to copy the code over and adjust it to your needs
 *
 * @category Server/ws
 */
export function useServer(options, ws, 
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
    ws.options.handleProtocols = handleProtocols;
    ws.once('error', (err) => {
        console.error('Internal error emitted on the WebSocket server. ' +
            'Please check your implementation.', err);
        // catch the first thrown error and re-throw it once all clients have been notified
        let firstErr = null;
        // report server errors by erroring out all clients with the same error
        for (const client of ws.clients) {
            try {
                client.close(CloseCode.InternalServerError, isProd
                    ? 'Internal server error'
                    : limitCloseReason(err instanceof Error ? err.message : String(err), 'Internal server error'));
            }
            catch (err) {
                firstErr = firstErr !== null && firstErr !== void 0 ? firstErr : err;
            }
        }
        if (firstErr)
            throw firstErr;
    });
    ws.on('connection', (socket, request) => {
        socket.once('error', (err) => {
            console.error('Internal error emitted on a WebSocket socket. ' +
                'Please check your implementation.', err);
            socket.close(CloseCode.InternalServerError, isProd
                ? 'Internal server error'
                : limitCloseReason(err instanceof Error ? err.message : String(err), 'Internal server error'));
        });
        // keep alive through ping-pong messages
        let pongWait = null;
        const pingInterval = keepAlive > 0 && isFinite(keepAlive)
            ? setInterval(() => {
                // ping pong on open sockets only
                if (socket.readyState === socket.OPEN) {
                    // terminate the connection after pong wait has passed because the client is idle
                    pongWait = setTimeout(() => {
                        socket.terminate();
                    }, keepAlive);
                    // listen for client's pong and stop socket termination
                    socket.once('pong', () => {
                        if (pongWait) {
                            clearTimeout(pongWait);
                            pongWait = null;
                        }
                    });
                    socket.ping();
                }
            }, keepAlive)
            : null;
        const closed = server.opened({
            protocol: socket.protocol,
            send: (data) => new Promise((resolve, reject) => {
                if (socket.readyState !== socket.OPEN)
                    return resolve();
                socket.send(data, (err) => (err ? reject(err) : resolve()));
            }),
            close: (code, reason) => socket.close(code, reason),
            onMessage: (cb) => socket.on('message', async (event) => {
                try {
                    await cb(String(event));
                }
                catch (err) {
                    console.error('Internal error occurred during message handling. ' +
                        'Please check your implementation.', err);
                    socket.close(CloseCode.InternalServerError, isProd
                        ? 'Internal server error'
                        : limitCloseReason(err instanceof Error ? err.message : String(err), 'Internal server error'));
                }
            }),
        }, { socket, request });
        socket.once('close', (code, reason) => {
            if (pongWait)
                clearTimeout(pongWait);
            if (pingInterval)
                clearInterval(pingInterval);
            if (!isProd &&
                code === CloseCode.SubprotocolNotAcceptable &&
                socket.protocol === DEPRECATED_GRAPHQL_WS_PROTOCOL)
                console.warn(`Client provided the unsupported and deprecated subprotocol "${socket.protocol}" used by subscriptions-transport-ws.` +
                    'Please see https://www.apollographql.com/docs/apollo-server/data/subscriptions/#switching-from-subscriptions-transport-ws.');
            closed(code, String(reason));
        });
    });
    return {
        dispose: async () => {
            for (const client of ws.clients) {
                client.close(1001, 'Going away');
            }
            ws.removeAllListeners();
            await new Promise((resolve, reject) => {
                ws.close((err) => (err ? reject(err) : resolve()));
            });
        },
    };
}
