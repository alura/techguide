/**
 *
 * server
 *
 */
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
import { parse, validate as graphqlValidate, execute as graphqlExecute, subscribe as graphqlSubscribe, getOperationAST, GraphQLError, } from 'graphql';
import { GRAPHQL_TRANSPORT_WS_PROTOCOL, CloseCode, MessageType, stringifyMessage, parseMessage, } from './common.mjs';
import { isObject, isAsyncGenerator, isAsyncIterable, areGraphQLErrors, } from './utils.mjs';
/**
 * Makes a Protocol complient WebSocket GraphQL server. The server
 * is actually an API which is to be used with your favourite WebSocket
 * server library!
 *
 * Read more about the Protocol in the PROTOCOL.md documentation file.
 *
 * @category Server
 */
export function makeServer(options) {
    const { schema, context, roots, validate, execute, subscribe, connectionInitWaitTimeout = 3000, // 3 seconds
    onConnect, onDisconnect, onClose, onSubscribe, onOperation, onNext, onError, onComplete, jsonMessageReviver: reviver, jsonMessageReplacer: replacer, } = options;
    return {
        opened(socket, extra) {
            const ctx = {
                connectionInitReceived: false,
                acknowledged: false,
                subscriptions: {},
                extra,
            };
            if (socket.protocol !== GRAPHQL_TRANSPORT_WS_PROTOCOL) {
                socket.close(CloseCode.SubprotocolNotAcceptable, 'Subprotocol not acceptable');
                return async (code, reason) => {
                    /* nothing was set up, just notify the closure */
                    await (onClose === null || onClose === void 0 ? void 0 : onClose(ctx, code, reason));
                };
            }
            // kick the client off (close socket) if the connection has
            // not been initialised after the specified wait timeout
            const connectionInitWait = connectionInitWaitTimeout > 0 && isFinite(connectionInitWaitTimeout)
                ? setTimeout(() => {
                    if (!ctx.connectionInitReceived)
                        socket.close(CloseCode.ConnectionInitialisationTimeout, 'Connection initialisation timeout');
                }, connectionInitWaitTimeout)
                : null;
            socket.onMessage(async function onMessage(data) {
                var _a, e_1, _b, _c;
                var _d;
                let message;
                try {
                    message = parseMessage(data, reviver);
                }
                catch (err) {
                    return socket.close(CloseCode.BadRequest, 'Invalid message received');
                }
                switch (message.type) {
                    case MessageType.ConnectionInit: {
                        if (ctx.connectionInitReceived)
                            return socket.close(CloseCode.TooManyInitialisationRequests, 'Too many initialisation requests');
                        // @ts-expect-error: I can write
                        ctx.connectionInitReceived = true;
                        if (isObject(message.payload))
                            // @ts-expect-error: I can write
                            ctx.connectionParams = message.payload;
                        const permittedOrPayload = await (onConnect === null || onConnect === void 0 ? void 0 : onConnect(ctx));
                        if (permittedOrPayload === false)
                            return socket.close(CloseCode.Forbidden, 'Forbidden');
                        await socket.send(stringifyMessage(isObject(permittedOrPayload)
                            ? {
                                type: MessageType.ConnectionAck,
                                payload: permittedOrPayload,
                            }
                            : {
                                type: MessageType.ConnectionAck,
                                // payload is completely absent if not provided
                            }, replacer));
                        // @ts-expect-error: I can write
                        ctx.acknowledged = true;
                        return;
                    }
                    case MessageType.Ping: {
                        if (socket.onPing)
                            // if the onPing listener is registered, automatic pong is disabled
                            return await socket.onPing(message.payload);
                        await socket.send(stringifyMessage(message.payload
                            ? { type: MessageType.Pong, payload: message.payload }
                            : {
                                type: MessageType.Pong,
                                // payload is completely absent if not provided
                            }));
                        return;
                    }
                    case MessageType.Pong:
                        return await ((_d = socket.onPong) === null || _d === void 0 ? void 0 : _d.call(socket, message.payload));
                    case MessageType.Subscribe: {
                        if (!ctx.acknowledged)
                            return socket.close(CloseCode.Unauthorized, 'Unauthorized');
                        const { id, payload } = message;
                        if (id in ctx.subscriptions)
                            return socket.close(CloseCode.SubscriberAlreadyExists, `Subscriber for ${id} already exists`);
                        // if this turns out to be a streaming operation, the subscription value
                        // will change to an `AsyncIterable`, otherwise it will stay as is
                        ctx.subscriptions[id] = null;
                        const emit = {
                            next: async (result, args) => {
                                let nextMessage = {
                                    id,
                                    type: MessageType.Next,
                                    payload: result,
                                };
                                const maybeResult = await (onNext === null || onNext === void 0 ? void 0 : onNext(ctx, nextMessage, args, result));
                                if (maybeResult)
                                    nextMessage = Object.assign(Object.assign({}, nextMessage), { payload: maybeResult });
                                await socket.send(stringifyMessage(nextMessage, replacer));
                            },
                            error: async (errors) => {
                                let errorMessage = {
                                    id,
                                    type: MessageType.Error,
                                    payload: errors,
                                };
                                const maybeErrors = await (onError === null || onError === void 0 ? void 0 : onError(ctx, errorMessage, errors));
                                if (maybeErrors)
                                    errorMessage = Object.assign(Object.assign({}, errorMessage), { payload: maybeErrors });
                                await socket.send(stringifyMessage(errorMessage, replacer));
                            },
                            complete: async (notifyClient) => {
                                const completeMessage = {
                                    id,
                                    type: MessageType.Complete,
                                };
                                await (onComplete === null || onComplete === void 0 ? void 0 : onComplete(ctx, completeMessage));
                                if (notifyClient)
                                    await socket.send(stringifyMessage(completeMessage, replacer));
                            },
                        };
                        try {
                            let execArgs;
                            const maybeExecArgsOrErrors = await (onSubscribe === null || onSubscribe === void 0 ? void 0 : onSubscribe(ctx, message));
                            if (maybeExecArgsOrErrors) {
                                if (areGraphQLErrors(maybeExecArgsOrErrors))
                                    return await emit.error(maybeExecArgsOrErrors);
                                else if (Array.isArray(maybeExecArgsOrErrors))
                                    throw new Error('Invalid return value from onSubscribe hook, expected an array of GraphQLError objects');
                                // not errors, is exec args
                                execArgs = maybeExecArgsOrErrors;
                            }
                            else {
                                // you either provide a schema dynamically through
                                // `onSubscribe` or you set one up during the server setup
                                if (!schema)
                                    throw new Error('The GraphQL schema is not provided');
                                const args = {
                                    operationName: payload.operationName,
                                    document: parse(payload.query),
                                    variableValues: payload.variables,
                                };
                                execArgs = Object.assign(Object.assign({}, args), { schema: typeof schema === 'function'
                                        ? await schema(ctx, message, args)
                                        : schema });
                                const validationErrors = (validate !== null && validate !== void 0 ? validate : graphqlValidate)(execArgs.schema, execArgs.document);
                                if (validationErrors.length > 0)
                                    return await emit.error(validationErrors);
                            }
                            const operationAST = getOperationAST(execArgs.document, execArgs.operationName);
                            if (!operationAST)
                                return await emit.error([
                                    new GraphQLError('Unable to identify operation'),
                                ]);
                            // if `onSubscribe` didnt specify a rootValue, inject one
                            if (!('rootValue' in execArgs))
                                execArgs.rootValue = roots === null || roots === void 0 ? void 0 : roots[operationAST.operation];
                            // if `onSubscribe` didn't specify a context, inject one
                            if (!('contextValue' in execArgs))
                                execArgs.contextValue =
                                    typeof context === 'function'
                                        ? await context(ctx, message, execArgs)
                                        : context;
                            // the execution arguments have been prepared
                            // perform the operation and act accordingly
                            let operationResult;
                            if (operationAST.operation === 'subscription')
                                operationResult = await (subscribe !== null && subscribe !== void 0 ? subscribe : graphqlSubscribe)(execArgs);
                            // operation === 'query' || 'mutation'
                            else
                                operationResult = await (execute !== null && execute !== void 0 ? execute : graphqlExecute)(execArgs);
                            const maybeResult = await (onOperation === null || onOperation === void 0 ? void 0 : onOperation(ctx, message, execArgs, operationResult));
                            if (maybeResult)
                                operationResult = maybeResult;
                            if (isAsyncIterable(operationResult)) {
                                /** multiple emitted results */
                                if (!(id in ctx.subscriptions)) {
                                    // subscription was completed/canceled before the operation settled
                                    if (isAsyncGenerator(operationResult))
                                        operationResult.return(undefined);
                                }
                                else {
                                    ctx.subscriptions[id] = operationResult;
                                    try {
                                        for (var _e = true, operationResult_1 = __asyncValues(operationResult), operationResult_1_1; operationResult_1_1 = await operationResult_1.next(), _a = operationResult_1_1.done, !_a;) {
                                            _c = operationResult_1_1.value;
                                            _e = false;
                                            try {
                                                const result = _c;
                                                await emit.next(result, execArgs);
                                            }
                                            finally {
                                                _e = true;
                                            }
                                        }
                                    }
                                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                                    finally {
                                        try {
                                            if (!_e && !_a && (_b = operationResult_1.return)) await _b.call(operationResult_1);
                                        }
                                        finally { if (e_1) throw e_1.error; }
                                    }
                                }
                            }
                            else {
                                /** single emitted result */
                                // if the client completed the subscription before the single result
                                // became available, he effectively canceled it and no data should be sent
                                if (id in ctx.subscriptions)
                                    await emit.next(operationResult, execArgs);
                            }
                            // lack of subscription at this point indicates that the client
                            // completed the subscription, he doesnt need to be reminded
                            await emit.complete(id in ctx.subscriptions);
                        }
                        finally {
                            // whatever happens to the subscription, we finally want to get rid of the reservation
                            delete ctx.subscriptions[id];
                        }
                        return;
                    }
                    case MessageType.Complete: {
                        const subscription = ctx.subscriptions[message.id];
                        delete ctx.subscriptions[message.id]; // deleting the subscription means no further activity should take place
                        if (isAsyncGenerator(subscription))
                            await subscription.return(undefined);
                        return;
                    }
                    default:
                        throw new Error(`Unexpected message of type ${message.type} received`);
                }
            });
            // wait for close, cleanup and the disconnect callback
            return async (code, reason) => {
                if (connectionInitWait)
                    clearTimeout(connectionInitWait);
                for (const sub of Object.values(ctx.subscriptions)) {
                    if (isAsyncGenerator(sub))
                        await sub.return(undefined);
                }
                if (ctx.acknowledged)
                    await (onDisconnect === null || onDisconnect === void 0 ? void 0 : onDisconnect(ctx, code, reason));
                await (onClose === null || onClose === void 0 ? void 0 : onClose(ctx, code, reason));
            };
        },
    };
}
/**
 * Helper utility for choosing the "graphql-transport-ws" subprotocol from
 * a set of WebSocket subprotocols.
 *
 * Accepts a set of already extracted WebSocket subprotocols or the raw
 * Sec-WebSocket-Protocol header value. In either case, if the right
 * protocol appears, it will be returned.
 *
 * By specification, the server should not provide a value with Sec-WebSocket-Protocol
 * if it does not agree with client's subprotocols. The client has a responsibility
 * to handle the connection afterwards.
 *
 * @category Server
 */
export function handleProtocols(protocols) {
    switch (true) {
        case protocols instanceof Set &&
            protocols.has(GRAPHQL_TRANSPORT_WS_PROTOCOL):
        case Array.isArray(protocols) &&
            protocols.includes(GRAPHQL_TRANSPORT_WS_PROTOCOL):
        case typeof protocols === 'string' &&
            protocols
                .split(',')
                .map((p) => p.trim())
                .includes(GRAPHQL_TRANSPORT_WS_PROTOCOL):
            return GRAPHQL_TRANSPORT_WS_PROTOCOL;
        default:
            return false;
    }
}
