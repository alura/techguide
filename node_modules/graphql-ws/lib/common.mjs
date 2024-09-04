/**
 *
 * common
 *
 */
import { areGraphQLErrors, extendedTypeof, isObject } from './utils.mjs';
/**
 * The WebSocket sub-protocol used for the [GraphQL over WebSocket Protocol](/PROTOCOL.md).
 *
 * @category Common
 */
export const GRAPHQL_TRANSPORT_WS_PROTOCOL = 'graphql-transport-ws';
/**
 * The deprecated subprotocol used by [subscriptions-transport-ws](https://github.com/apollographql/subscriptions-transport-ws).
 *
 * @private
 */
export const DEPRECATED_GRAPHQL_WS_PROTOCOL = 'graphql-ws';
/**
 * `graphql-ws` expected and standard close codes of the [GraphQL over WebSocket Protocol](/PROTOCOL.md).
 *
 * @category Common
 */
export var CloseCode;
(function (CloseCode) {
    CloseCode[CloseCode["InternalServerError"] = 4500] = "InternalServerError";
    CloseCode[CloseCode["InternalClientError"] = 4005] = "InternalClientError";
    CloseCode[CloseCode["BadRequest"] = 4400] = "BadRequest";
    CloseCode[CloseCode["BadResponse"] = 4004] = "BadResponse";
    /** Tried subscribing before connect ack */
    CloseCode[CloseCode["Unauthorized"] = 4401] = "Unauthorized";
    CloseCode[CloseCode["Forbidden"] = 4403] = "Forbidden";
    CloseCode[CloseCode["SubprotocolNotAcceptable"] = 4406] = "SubprotocolNotAcceptable";
    CloseCode[CloseCode["ConnectionInitialisationTimeout"] = 4408] = "ConnectionInitialisationTimeout";
    CloseCode[CloseCode["ConnectionAcknowledgementTimeout"] = 4504] = "ConnectionAcknowledgementTimeout";
    /** Subscriber distinction is very important */
    CloseCode[CloseCode["SubscriberAlreadyExists"] = 4409] = "SubscriberAlreadyExists";
    CloseCode[CloseCode["TooManyInitialisationRequests"] = 4429] = "TooManyInitialisationRequests";
})(CloseCode || (CloseCode = {}));
/**
 * Types of messages allowed to be sent by the client/server over the WS protocol.
 *
 * @category Common
 */
export var MessageType;
(function (MessageType) {
    MessageType["ConnectionInit"] = "connection_init";
    MessageType["ConnectionAck"] = "connection_ack";
    MessageType["Ping"] = "ping";
    MessageType["Pong"] = "pong";
    MessageType["Subscribe"] = "subscribe";
    MessageType["Next"] = "next";
    MessageType["Error"] = "error";
    MessageType["Complete"] = "complete";
})(MessageType || (MessageType = {}));
/**
 * Validates the message against the GraphQL over WebSocket Protocol.
 *
 * Invalid messages will throw descriptive errors.
 *
 * @category Common
 */
export function validateMessage(val) {
    if (!isObject(val)) {
        throw new Error(`Message is expected to be an object, but got ${extendedTypeof(val)}`);
    }
    if (!val.type) {
        throw new Error(`Message is missing the 'type' property`);
    }
    if (typeof val.type !== 'string') {
        throw new Error(`Message is expects the 'type' property to be a string, but got ${extendedTypeof(val.type)}`);
    }
    switch (val.type) {
        case MessageType.ConnectionInit:
        case MessageType.ConnectionAck:
        case MessageType.Ping:
        case MessageType.Pong: {
            if (val.payload != null && !isObject(val.payload)) {
                throw new Error(`"${val.type}" message expects the 'payload' property to be an object or nullish or missing, but got "${val.payload}"`);
            }
            break;
        }
        case MessageType.Subscribe: {
            if (typeof val.id !== 'string') {
                throw new Error(`"${val.type}" message expects the 'id' property to be a string, but got ${extendedTypeof(val.id)}`);
            }
            if (!val.id) {
                throw new Error(`"${val.type}" message requires a non-empty 'id' property`);
            }
            if (!isObject(val.payload)) {
                throw new Error(`"${val.type}" message expects the 'payload' property to be an object, but got ${extendedTypeof(val.payload)}`);
            }
            if (typeof val.payload.query !== 'string') {
                throw new Error(`"${val.type}" message payload expects the 'query' property to be a string, but got ${extendedTypeof(val.payload.query)}`);
            }
            if (val.payload.variables != null && !isObject(val.payload.variables)) {
                throw new Error(`"${val.type}" message payload expects the 'variables' property to be a an object or nullish or missing, but got ${extendedTypeof(val.payload.variables)}`);
            }
            if (val.payload.operationName != null &&
                extendedTypeof(val.payload.operationName) !== 'string') {
                throw new Error(`"${val.type}" message payload expects the 'operationName' property to be a string or nullish or missing, but got ${extendedTypeof(val.payload.operationName)}`);
            }
            if (val.payload.extensions != null && !isObject(val.payload.extensions)) {
                throw new Error(`"${val.type}" message payload expects the 'extensions' property to be a an object or nullish or missing, but got ${extendedTypeof(val.payload.extensions)}`);
            }
            break;
        }
        case MessageType.Next: {
            if (typeof val.id !== 'string') {
                throw new Error(`"${val.type}" message expects the 'id' property to be a string, but got ${extendedTypeof(val.id)}`);
            }
            if (!val.id) {
                throw new Error(`"${val.type}" message requires a non-empty 'id' property`);
            }
            if (!isObject(val.payload)) {
                throw new Error(`"${val.type}" message expects the 'payload' property to be an object, but got ${extendedTypeof(val.payload)}`);
            }
            break;
        }
        case MessageType.Error: {
            if (typeof val.id !== 'string') {
                throw new Error(`"${val.type}" message expects the 'id' property to be a string, but got ${extendedTypeof(val.id)}`);
            }
            if (!val.id) {
                throw new Error(`"${val.type}" message requires a non-empty 'id' property`);
            }
            if (!areGraphQLErrors(val.payload)) {
                throw new Error(`"${val.type}" message expects the 'payload' property to be an array of GraphQL errors, but got ${JSON.stringify(val.payload)}`);
            }
            break;
        }
        case MessageType.Complete: {
            if (typeof val.id !== 'string') {
                throw new Error(`"${val.type}" message expects the 'id' property to be a string, but got ${extendedTypeof(val.id)}`);
            }
            if (!val.id) {
                throw new Error(`"${val.type}" message requires a non-empty 'id' property`);
            }
            break;
        }
        default:
            throw new Error(`Invalid message 'type' property "${val.type}"`);
    }
    return val;
}
/**
 * Checks if the provided value is a valid GraphQL over WebSocket message.
 *
 * @deprecated Use `validateMessage` instead.
 *
 * @category Common
 */
export function isMessage(val) {
    try {
        validateMessage(val);
        return true;
    }
    catch (_a) {
        return false;
    }
}
/**
 * Parses the raw websocket message data to a valid message.
 *
 * @category Common
 */
export function parseMessage(data, reviver) {
    return validateMessage(typeof data === 'string' ? JSON.parse(data, reviver) : data);
}
/**
 * Stringifies a valid message ready to be sent through the socket.
 *
 * @category Common
 */
export function stringifyMessage(msg, replacer) {
    validateMessage(msg);
    return JSON.stringify(msg, replacer);
}
