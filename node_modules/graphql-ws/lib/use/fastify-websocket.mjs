import { makeHandler as makeHandlerCurrent } from './@fastify/websocket.mjs';
/**
 * Make a handler to use on a [fastify-websocket](https://github.com/fastify/fastify-websocket) route.
 * This is a basic starter, feel free to copy the code over and adjust it to your needs
 *
 * @deprecated Use `@fastify/websocket` instead.
 *
 * @category Server/fastify-websocket
 */
export function makeHandler(options, 
/**
 * The timout between dispatched keep-alive messages. Internally uses the [ws Ping and Pongs]((https://developer.mozilla.org/en-US/docs/Web/API/wss_API/Writing_ws_servers#Pings_and_Pongs_The_Heartbeat_of_wss))
 * to check that the link between the clients and the server is operating and to prevent the link
 * from being broken due to idling.
 *
 * @default 12_000 // 12 seconds
 */
keepAlive = 12000) {
    // new handler can be reused, the semantics stayed the same
    return makeHandlerCurrent(options, keepAlive);
}
