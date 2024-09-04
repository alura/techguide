# GraphQL over WebSocket Protocol

## Nomenclature

- **Socket** is the main WebSocket communication channel between the _server_ and the _client_
- **Connection** is a connection **within the established socket** describing a "connection" through which the operation requests will be communicated

## Communication

The WebSocket sub-protocol for this specification is: `graphql-transport-ws`.

Messages are represented through the JSON structure and are stringified before being sent over the network. They are bidirectional, meaning both the server and the client must conform to the specified message structure.

**All** messages contain the `type` field outlining the action this message describes. Depending on the type, the message can contain two more _optional_ fields:

- `id` used for uniquely identifying server responses and connecting them with the client's requests
- `payload` holding the extra "payload" information to go with the specific message type

Multiple operations identified with separate IDs can be active at any time and their messages can be interleaved on the connection.

The server can close the socket (kick the client off) at any time. The close event dispatched by the server is used to describe the fatal error to the client.

The client closes the socket and the connection by dispatching a `1000: Normal Closure` close event to the server indicating a normal closure.

## Message types

### `ConnectionInit`

Direction: **Client -> Server**

Indicates that the client wants to establish a connection within the existing socket. This connection is **not** the actual WebSocket communication channel, but is rather a frame within it asking the server to allow future operation requests.

The server must receive the connection initialisation message within the allowed waiting time specified in the `connectionInitWaitTimeout` parameter during the server setup. If the client does not request a connection within the allowed timeout, the server will close the socket with the event: `4408: Connection initialisation timeout`.

If the server receives more than one `ConnectionInit` message at any given time, the server will close the socket with the event `4429: Too many initialisation requests`.

If the server wishes to reject the connection, for example during authentication, it is recommended to close the socket with `4403: Forbidden`.

```typescript
interface ConnectionInitMessage {
  type: 'connection_init';
  payload?: Record<string, unknown> | null;
}
```

### `ConnectionAck`

Direction: **Server -> Client**

Expected response to the `ConnectionInit` message from the client acknowledging a successful connection with the server.

The server can use the optional `payload` field to transfer additional details about the connection.

```typescript
interface ConnectionAckMessage {
  type: 'connection_ack';
  payload?: Record<string, unknown> | null;
}
```

The client is now **ready** to request subscription operations.

### `Ping`

Direction: **bidirectional**

Useful for detecting failed connections, displaying latency metrics or other types of network probing.

A `Pong` must be sent in response from the receiving party as soon as possible.

The `Ping` message can be sent at any time within the established socket.

The optional `payload` field can be used to transfer additional details about the ping.

```typescript
interface PingMessage {
  type: 'ping';
  payload?: Record<string, unknown> | null;
}
```

### `Pong`

Direction: **bidirectional**

The response to the `Ping` message. Must be sent as soon as the `Ping` message is received.

The `Pong` message can be sent at any time within the established socket. Furthermore, the `Pong` message may even be sent unsolicited as an unidirectional heartbeat.

The optional `payload` field can be used to transfer additional details about the pong.

```typescript
interface PongMessage {
  type: 'pong';
  payload?: Record<string, unknown> | null;
}
```

### `Subscribe`

Direction: **Client -> Server**

Requests an operation specified in the message `payload`. This message provides a unique ID field to connect published messages to the operation requested by this message.

If there is already an active subscriber for an operation matching the provided ID, regardless of the operation type, the server **must** close the socket immediately with the event `4409: Subscriber for <unique-operation-id> already exists`.

The server needs only keep track of IDs for as long as the subscription is active. Once a client completes an operation, it is free to re-use that ID.

```typescript
interface SubscribeMessage {
  id: '<unique-operation-id>';
  type: 'subscribe';
  payload: {
    operationName?: string | null;
    query: string;
    variables?: Record<string, unknown> | null;
    extensions?: Record<string, unknown> | null;
  };
}
```

Executing operations is allowed **only** after the server has acknowledged the connection through the `ConnectionAck` message, if the connection is not acknowledged, the socket will be closed immediately with the event `4401: Unauthorized`.

### `Next`

Direction: **Server -> Client**

Operation execution result(s) from the source stream created by the binding `Subscribe` message. After all results have been emitted, the `Complete` message will follow indicating stream completion.

```typescript
import { ExecutionResult } from 'graphql';

interface NextMessage {
  id: '<unique-operation-id>';
  type: 'next';
  payload: ExecutionResult;
}
```

### `Error`

Direction: **Server -> Client**

Operation execution error(s) in response to the `Subscribe` message. This can occur _before_ execution starts, usually due to validation errors, or _during_ the execution of the request. This message terminates the operation and no further messages will be sent.

```typescript
import { GraphQLError } from 'graphql';

interface ErrorMessage {
  id: '<unique-operation-id>';
  type: 'error';
  payload: GraphQLError[];
}
```

### `Complete`

Direction: **bidirectional**

- **Server -> Client** indicates that the requested operation execution has completed. If the server dispatched the `Error` message relative to the original `Subscribe` message, no `Complete` message will be emitted.

- **Client -> Server** indicates that the client has stopped listening and wants to complete the subscription. No further events, relevant to the original subscription, should be sent through. Even if the client sent a `Complete` message for a _single-result-operation_ before it resolved, the result should not be sent through once it does.

Note: The asynchronous nature of the full-duplex connection means that a client can send a `Complete` message to the server even when messages are in-flight to the client, or when the server has itself completed the operation (via a `Error` or `Complete` message). Both client and server must therefore be prepared to receive (and ignore) messages for operations that they consider already completed.

```typescript
interface CompleteMessage {
  id: '<unique-operation-id>';
  type: 'complete';
}
```

### Invalid message

Direction: **bidirectional**

Receiving a message of a type or format which is not specified in this document will result in an **immediate** socket closure with the event `4400: <error-message>`. The `<error-message>` can be vaguely descriptive on why the received message is invalid.

Receiving a message (other than `Subscribe`) with an ID that belongs to an operation that has been previously completed does not constitute an error. It is permissable to simply ignore all _unknown_ IDs without closing the connection.

## Examples

For the sake of clarity, the following examples demonstrate the communication protocol.

<h3 id="successful-connection-initialisation">Successful connection initialisation</h3>

1. _Client_ sends a WebSocket handshake request with the sub-protocol: `graphql-transport-ws`
1. _Server_ accepts the handshake and establishes a WebSocket communication channel (which we call "socket")
1. _Client_ immediately dispatches a `ConnectionInit` message optionally providing a payload as agreed with the server
1. _Server_ validates the connection initialisation request and dispatches a `ConnectionAck` message to the client on successful connection
1. _Client_ has received the acknowledgement message and is now ready to request operation executions

### Connection initialisation timeout

1. _Client_ sends a WebSocket handshake request with the sub-protocol: `graphql-transport-ws`
1. _Server_ accepts the handshake and establishes a WebSocket communication channel (which we call "socket")
1. _Client_ does not dispatch a `ConnectionInit` message
1. _Server_ waits for the `ConnectionInit` message for the duration specified in the `connectionInitWaitTimeout` parameter
1. _Server_ waiting time has passed
1. _Server_ closes the socket by dispatching the event `4408: Connection initialisation timeout`

### Streaming operation

#### `subscription` operation and queries with streaming directives

_The client and the server has already gone through [successful connection initialisation](#successful-connection-initialisation)._

1. _Client_ generates a unique ID for the following operation
1. _Client_ dispatches the `Subscribe` message with the generated ID through the `id` field and the requested operation passed through the `payload` field
   <br>_All future communication is linked through this unique ID_
1. _Server_ executes the streaming GraphQL operation
1. _Server_ checks if the generated ID is unique across active streaming subscriptions

   - If **not** unique, the _server_ will close the socket with the event `4409: Subscriber for <generated-id> already exists`
   - If unique, continue...

1. _Server_ _optionally_ checks if the operation is valid before starting executing it, e.g. checking permissions

   - If **not** valid, the _server_ sends an `Error` message and deems the operation complete.
   - If valid, continue...

1. _Server_ dispatches results over time with the `Next` message
1. - _Server_ dispatches the `Complete` message indicating that the source stream has completed
   - _Client_ completes the stream observer
     <br>**or**
   - _Client_ stops the subscription by dispatching a `Complete` message
   - _Server_ receives `Complete` message and completes the source stream
   - _Client_ ignores all further messages that it receives with this ID
     <br>**or**
   - _Server_ dispatches the `Complete` message indicating that the source stream has completed
   - **Simultaneously** _client_ stops the subscription by dispatching a `Complete` message
   - _Client_ ignores all further messages that it receives with this ID
   - _Server_ ignores the `Complete` message from the client

### Single result operation

#### `query` and `mutation` operations without streaming directives

A single result operation is identical to a streaming operation except that _at most one_ `Next` message is sent.

It shares the same name-space for IDs as streaming operations and can be multiplexed with other operations on the connection.

_The client and the server has already gone through [successful connection initialisation](#successful-connection-initialisation)._

1. _Client_ generates a unique ID for the following operation
1. _Client_ dispatches the `Subscribe` message with the generated ID through the `id` field and the requested operation passed through the `payload` field
   <br>_All future communication is linked through this unique ID_
1. _Server_ executes the single result GraphQL operation
1. _Server_ dispatches the result with the `Next` message
1. _Server_ dispatches the `Complete` message indicating that the execution has completed

The _client_ may dispatch a `Complete` message at any time, just as shown in the streaming operations examples above, and the same interactions ensue.
