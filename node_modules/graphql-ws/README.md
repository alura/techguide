<div align="center">
  <br />

![GraphQLOverWebSocket](https://user-images.githubusercontent.com/25294569/94527042-172dba00-023f-11eb-944b-88c0bd58a8d2.gif)

  <h6>Coherent, zero-dependency, lazy, simple, <a href="PROTOCOL.md">GraphQL over WebSocket Protocol</a> compliant server and client.</h6>

[![Continuous integration](https://github.com/enisdenjo/graphql-ws/workflows/Continuous%20integration/badge.svg)](https://github.com/enisdenjo/graphql-ws/actions?query=workflow%3A%22Continuous+integration%22) [![graphql-ws](https://img.shields.io/npm/v/graphql-ws.svg?label=graphql-ws&logo=npm)](https://www.npmjs.com/package/graphql-ws)

<i>Use [Server-Sent Events (SSE)](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events) instead? Check out <b>[graphql-sse](https://github.com/enisdenjo/graphql-sse)</b>!</i>

  <br />
</div>

## Getting started

#### Install

```shell
yarn add graphql-ws
```

#### Create a GraphQL schema

```ts
import { GraphQLSchema, GraphQLObjectType, GraphQLString } from 'graphql';

/**
 * Construct a GraphQL schema and define the necessary resolvers.
 *
 * type Query {
 *   hello: String
 * }
 * type Subscription {
 *   greetings: String
 * }
 */
export const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      hello: {
        type: GraphQLString,
        resolve: () => 'world',
      },
    },
  }),
  subscription: new GraphQLObjectType({
    name: 'Subscription',
    fields: {
      greetings: {
        type: GraphQLString,
        subscribe: async function* () {
          for (const hi of ['Hi', 'Bonjour', 'Hola', 'Ciao', 'Zdravo']) {
            yield { greetings: hi };
          }
        },
      },
    },
  }),
});
```

#### Start the server

##### With [ws](https://github.com/websockets/ws)

```ts
import { WebSocketServer } from 'ws'; // yarn add ws
// import ws from 'ws'; yarn add ws@7
// const WebSocketServer = ws.Server;
import { useServer } from 'graphql-ws/lib/use/ws';
import { schema } from './previous-step';

const server = new WebSocketServer({
  port: 4000,
  path: '/graphql',
});

useServer({ schema }, server);

console.log('Listening to port 4000');
```

##### With [uWebSockets.js](https://github.com/uNetworking/uWebSockets.js)

```ts
import uWS from 'uWebSockets.js'; // yarn add uWebSockets.js@uNetworking/uWebSockets.js#<tag>
import { makeBehavior } from 'graphql-ws/lib/use/uWebSockets';
import { schema } from './previous-step';

uWS
  .App()
  .ws('/graphql', makeBehavior({ schema }))
  .listen(4000, (listenSocket) => {
    if (listenSocket) {
      console.log('Listening to port 4000');
    }
  });
```

##### With [@fastify/websocket](https://github.com/fastify/fastify-websocket)

```ts
import Fastify from 'fastify'; // yarn add fastify
import fastifyWebsocket from '@fastify/websocket'; // yarn add @fastify/websocket
import { makeHandler } from 'graphql-ws/lib/use/@fastify/websocket';
import { schema } from './previous-step';

const fastify = Fastify();
fastify.register(fastifyWebsocket);

fastify.register(async (fastify) => {
  fastify.get('/graphql', { websocket: true }, makeHandler({ schema }));
});

fastify.listen(4000, (err) => {
  if (err) {
    fastify.log.error(err);
    return process.exit(1);
  }
  console.log('Listening to port 4000');
});
```

#### Use the client

```ts
import { createClient } from 'graphql-ws';

const client = createClient({
  url: 'ws://localhost:4000/graphql',
});

// query
(async () => {
  const result = await new Promise((resolve, reject) => {
    let result;
    client.subscribe(
      {
        query: '{ hello }',
      },
      {
        next: (data) => (result = data),
        error: reject,
        complete: () => resolve(result),
      },
    );
  });

  expect(result).toEqual({ hello: 'Hello World!' });
})();

// subscription
(async () => {
  const onNext = () => {
    /* handle incoming values */
  };

  let unsubscribe = () => {
    /* complete the subscription */
  };

  await new Promise((resolve, reject) => {
    unsubscribe = client.subscribe(
      {
        query: 'subscription { greetings }',
      },
      {
        next: onNext,
        error: reject,
        complete: resolve,
      },
    );
  });

  expect(onNext).toBeCalledTimes(5); // we say "Hi" in 5 languages
})();
```

## Recipes

<details id="promise">
<summary><a href="#promise">🔗</a> Client usage with Promise</summary>

```ts
import { createClient, SubscribePayload } from 'graphql-ws';

const client = createClient({
  url: 'ws://hey.there:4000/graphql',
});

async function execute<T>(payload: SubscribePayload) {
  return new Promise<T>((resolve, reject) => {
    let result: T;
    client.subscribe<T>(payload, {
      next: (data) => (result = data),
      error: reject,
      complete: () => resolve(result),
    });
  });
}

// use
(async () => {
  try {
    const result = await execute({
      query: '{ hello }',
    });
    // complete
    // next = result = { data: { hello: 'Hello World!' } }
  } catch (err) {
    // error
  }
})();
```

</details>

<details id="async-iterator">
<summary><a href="#async-iterator">🔗</a> Client usage with <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/asyncIterator">AsyncIterator</a></summary>

```ts
import { createClient, SubscribePayload } from 'graphql-ws';

const client = createClient({
  url: 'ws://iterators.ftw:4000/graphql',
});

function subscribe<T>(payload: SubscribePayload): AsyncGenerator<T> {
  let deferred: {
    resolve: (done: boolean) => void;
    reject: (err: unknown) => void;
  } | null = null;
  const pending: T[] = [];
  let throwMe: unknown = null,
    done = false;
  const dispose = client.subscribe<T>(payload, {
    next: (data) => {
      pending.push(data);
      deferred?.resolve(false);
    },
    error: (err) => {
      throwMe = err;
      deferred?.reject(throwMe);
    },
    complete: () => {
      done = true;
      deferred?.resolve(true);
    },
  });
  return {
    [Symbol.asyncIterator]() {
      return this;
    },
    async next() {
      if (done) return { done: true, value: undefined };
      if (throwMe) throw throwMe;
      if (pending.length) return { value: pending.shift()! };
      return (await new Promise<boolean>(
        (resolve, reject) => (deferred = { resolve, reject }),
      ))
        ? { done: true, value: undefined }
        : { value: pending.shift()! };
    },
    async throw(err) {
      throw err;
    },
    async return() {
      dispose();
      return { done: true, value: undefined };
    },
  };
}

(async () => {
  const subscription = subscribe({
    query: 'subscription { greetings }',
  });
  // subscription.return() to dispose

  for await (const result of subscription) {
    // next = result = { data: { greetings: 5x } }
  }
  // complete
})();
```

</details>

<details id="observable">
<summary><a href="#observable">🔗</a> Client usage with <a href="https://github.com/tc39/proposal-observable">Observable</a></summary>

```ts
import { Observable } from 'relay-runtime';
// or
import { Observable } from '@apollo/client/core';
// or
import { Observable } from 'rxjs';
// or
import Observable from 'zen-observable';
// or any other lib which implements Observables as per the ECMAScript proposal: https://github.com/tc39/proposal-observable

const client = createClient({
  url: 'ws://graphql.loves:4000/observables',
});

function toObservable(operation) {
  return new Observable((observer) =>
    client.subscribe(operation, {
      next: (data) => observer.next(data),
      error: (err) => observer.error(err),
      complete: () => observer.complete(),
    }),
  );
}

const observable = toObservable({ query: `subscription { ping }` });

const subscription = observable.subscribe({
  next: (data) => {
    expect(data).toBe({ data: { ping: 'pong' } });
  },
});

// ⏱

subscription.unsubscribe();
```

</details>

<details id="relay">
<summary><a href="#relay">🔗</a> Client usage with <a href="https://relay.dev">Relay</a></summary>

```ts
import {
  Network,
  Observable,
  RequestParameters,
  Variables,
} from 'relay-runtime';
import { createClient } from 'graphql-ws';

const subscriptionsClient = createClient({
  url: 'ws://i.love:4000/graphql',
  connectionParams: () => {
    // Note: getSession() is a placeholder function created by you
    const session = getSession();
    if (!session) {
      return {};
    }
    return {
      Authorization: `Bearer ${session.token}`,
    };
  },
});

// both fetch and subscribe can be handled through one implementation
// to understand why we return Observable<any>, please see: https://github.com/enisdenjo/graphql-ws/issues/316#issuecomment-1047605774
function fetchOrSubscribe(
  operation: RequestParameters,
  variables: Variables,
): Observable<any> {
  return Observable.create((sink) => {
    if (!operation.text) {
      return sink.error(new Error('Operation text cannot be empty'));
    }
    return subscriptionsClient.subscribe(
      {
        operationName: operation.name,
        query: operation.text,
        variables,
      },
      sink,
    );
  });
}

export const network = Network.create(fetchOrSubscribe, fetchOrSubscribe);
```

</details>

<details id="urql">
<summary><a href="#urql">🔗</a> Client usage with <a href="https://formidable.com/open-source/urql/">urql</a></summary>

```ts
import { createClient, defaultExchanges, subscriptionExchange } from 'urql';
import { createClient as createWSClient } from 'graphql-ws';

const wsClient = createWSClient({
  url: 'ws://its.urql:4000/graphql',
});

const client = createClient({
  url: '/graphql',
  exchanges: [
    ...defaultExchanges,
    subscriptionExchange({
      forwardSubscription(operation) {
        return {
          subscribe: (sink) => {
            const dispose = wsClient.subscribe(operation, sink);
            return {
              unsubscribe: dispose,
            };
          },
        };
      },
    }),
  ],
});
```

</details>

<details id="apollo-client">
<summary><a href="#apollo-client">🔗</a> Client usage with <a href="https://www.apollographql.com/docs/react/">Apollo Client Web</a></summary>

```typescript
import { createClient } from 'graphql-ws';
// Apollo Client Web v3.5.10 has a GraphQLWsLink class which implements
// graphql-ws directly. For older versions, see the next code block
// to define your own GraphQLWsLink.
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';

const link = new GraphQLWsLink(
  createClient({
    url: 'ws://where.is:4000/graphql',
    connectionParams: () => {
      // Note: getSession() is a placeholder function created by you
      const session = getSession();
      if (!session) {
        return {};
      }
      return {
        Authorization: `Bearer ${session.token}`,
      };
    },
  }),
);
```

```typescript
// for Apollo Client v3 older than v3.5.10:
import {
  ApolloLink,
  Operation,
  FetchResult,
  Observable,
} from '@apollo/client/core';
// or for Apollo Client v2:
// import { ApolloLink, Operation, FetchResult, Observable } from 'apollo-link'; // yarn add apollo-link

import { print } from 'graphql';
import { createClient, Client } from 'graphql-ws';

class GraphQLWsLink extends ApolloLink {
  constructor(private client: Client) {
    super();
  }

  public request(operation: Operation): Observable<FetchResult> {
    return new Observable((sink) => {
      return this.client.subscribe<FetchResult>(
        { ...operation, query: print(operation.query) },
        {
          next: sink.next.bind(sink),
          complete: sink.complete.bind(sink),
          error: sink.error.bind(sink),
        },
      );
    });
  }
}
```

</details>

<details id="kotlin">
<summary><a href="#kotlin">🔗</a> Client usage with <a href="https://github.com/apollographql/apollo-kotlin">Apollo Kotlin</a></summary>

Connect to [`graphql-transport-ws`](https://github.com/enisdenjo/graphql-ws/blob/master/PROTOCOL.md) compatible server in Kotlin using [Apollo Kotlin](https://github.com/apollographql/apollo-kotlin)

```kotlin
val apolloClient = ApolloClient.Builder()
    .networkTransport(
        WebSocketNetworkTransport.Builder()
            .serverUrl(
                serverUrl = "http://localhost:9090/graphql",
            ).protocol(
                protocolFactory = GraphQLWsProtocol.Factory()
            ).build()
    )
    .build()
```

</details>

<details id="apollo-ios">
<summary><a href="#apollo-ios">🔗</a> Client usage with <a href="https://github.com/apollographql/apollo-ios">Apollo iOS</a></summary>

Connect to [`graphql-transport-ws`](https://github.com/enisdenjo/graphql-ws/blob/master/PROTOCOL.md) compatible server in Swift using [Apollo iOS](https://github.com/apollographql/apollo-ios)

```swift
import Foundation
import Apollo
import ApolloWebSocket

let store = ApolloStore()

let normalTransport = RequestChainNetworkTransport(
  interceptorProvider: DefaultInterceptorProvider(store: store),
  endpointURL: URL(string: "http://localhost:8080/graphql")!
)

let webSocketClient = WebSocket(
  request: URLRequest(url: URL(string: "ws://localhost:8080/websocket")!),
  protocol: .graphql_transport_ws
)
let webSocketTransport = WebSocketTransport(
  websocket: webSocketClient,
  store: store
)

let splitTransport = SplitNetworkTransport(
  uploadingNetworkTransport: normalTransport,
  webSocketNetworkTransport: webSocketTransport
)

let client = ApolloClient(
  networkTransport: splitTransport,
  store: store
)
```

</details>

<details id="apollo-studio-explorer">
<summary><a href="#apollo-studio-explorer">🔗</a> Client usage with <a href="https://www.apollographql.com/docs/studio/explorer/additional-features/#subscription-support">Apollo Studio Explorer</a></summary>

In Explorer Settings, click "Edit" for "Connection Settings" and select `graphql-ws` under "Implementation".

</details>

<details id="graphiql">
<summary><a href="#graphiql">🔗</a> Client usage with <a href="https://github.com/graphql/graphiql">GraphiQL</a></summary>

```typescript
import React from 'react';
import ReactDOM from 'react-dom';
import { GraphiQL } from 'graphiql';
import { createGraphiQLFetcher } from '@graphiql/toolkit';
import { createClient } from 'graphql-ws';

const fetcher = createGraphiQLFetcher({
  url: 'https://myschema.com/graphql',
  wsClient: createClient({
    url: 'wss://myschema.com/graphql',
  }),
});

export const App = () => <GraphiQL fetcher={fetcher} />;

ReactDOM.render(document.getElementByID('graphiql'), <App />);
```

</details>

<details id="retry-non-close-events">
<summary><a href="#retry-non-close-events">🔗</a> Client usage with retry on any connection problem</summary>

```typescript
import { createClient } from 'graphql-ws';
import { waitForHealthy } from './my-servers';

const client = createClient({
  url: 'ws://any.retry:4000/graphql',
  // by default the client will immediately fail on any non-fatal
  // `CloseEvent` problem thrown during the connection phase
  //
  // see `retryAttempts` documentation about which `CloseEvent`s are
  // considered fatal regardless
  shouldRetry: () => true,
  // or pre v5.8.0:
  // isFatalConnectionProblem: () => false,
});
```

</details>

<details id="retry-strategy">
<summary><a href="#retry-strategy">🔗</a> Client usage with custom retry timeout strategy</summary>

```typescript
import { createClient } from 'graphql-ws';
import { waitForHealthy } from './my-servers';

const client = createClient({
  url: 'ws://i.want.retry:4000/control/graphql',
  retryWait: async function waitForServerHealthyBeforeRetry() {
    // if you have a server healthcheck, you can wait for it to become
    // healthy before retrying after an abrupt disconnect (most commonly a restart)
    await waitForHealthy(url);

    // after the server becomes ready, wait for a second + random 1-4s timeout
    // (avoid DDoSing yourself) and try connecting again
    await new Promise((resolve) =>
      setTimeout(resolve, 1000 + Math.random() * 3000),
    );
  },
});
```

</details>

<details id="graceful-restart">
<summary><a href="#graceful-restart">🔗</a> Client usage with graceful restart</summary>

```typescript
import { createClient, Client, ClientOptions } from 'graphql-ws';
import { giveMeAFreshToken } from './token-giver';

interface RestartableClient extends Client {
  restart(): void;
}

function createRestartableClient(options: ClientOptions): RestartableClient {
  let restartRequested = false;
  let restart = () => {
    restartRequested = true;
  };

  const client = createClient({
    ...options,
    on: {
      ...options.on,
      opened: (socket) => {
        options.on?.opened?.(socket);

        restart = () => {
          if (socket.readyState === WebSocket.OPEN) {
            // if the socket is still open for the restart, do the restart
            socket.close(4205, 'Client Restart');
          } else {
            // otherwise the socket might've closed, indicate that you want
            // a restart on the next opened event
            restartRequested = true;
          }
        };

        // just in case you were eager to restart
        if (restartRequested) {
          restartRequested = false;
          restart();
        }
      },
    },
  });

  return {
    ...client,
    restart: () => restart(),
  };
}

const client = createRestartableClient({
  url: 'ws://graceful.restart:4000/is/a/non-fatal/close-code',
  connectionParams: async () => {
    const token = await giveMeAFreshToken();
    return { token };
  },
});

// all subscriptions from `client.subscribe` will resubscribe after `client.restart`
```

</details>

<details id="ping-from-client">
<summary><a href="#ping-from-client">🔗</a> Client usage with ping/pong timeout and latency metrics</summary>

```typescript
import { createClient } from 'graphql-ws';

let activeSocket,
  timedOut,
  pingSentAt = 0,
  latency = 0;
createClient({
  url: 'ws://i.time.out:4000/and-measure/latency',
  keepAlive: 10_000, // ping server every 10 seconds
  on: {
    opened: (socket) => (activeSocket = socket),
    ping: (received) => {
      if (!received /* sent */) {
        pingSentAt = Date.now();
        timedOut = setTimeout(() => {
          if (activeSocket.readyState === WebSocket.OPEN)
            activeSocket.close(4408, 'Request Timeout');
        }, 5_000); // wait 5 seconds for the pong and then close the connection
      }
    },
    pong: (received) => {
      if (received) {
        latency = Date.now() - pingSentAt;
        clearTimeout(timedOut); // pong is received, clear connection close timeout
      }
    },
  },
});
```

</details>

<details id="client-terminate">
<summary><a href="#client-terminate">🔗</a> Client usage with abrupt termination on pong timeout</summary>

```typescript
import { createClient } from 'graphql-ws';

let timedOut;
const client = createClient({
  url: 'ws://terminate.me:4000/on-pong-timeout',
  keepAlive: 10_000, // ping server every 10 seconds
  on: {
    ping: (received) => {
      if (!received /* sent */) {
        timedOut = setTimeout(() => {
          // a close event `4499: Terminated` is issued to the current WebSocket and an
          // artificial `{ code: 4499, reason: 'Terminated', wasClean: false }` close-event-like
          // object is immediately emitted without waiting for the one coming from `WebSocket.onclose`
          //
          // calling terminate is not considered fatal and a connection retry will occur as expected
          //
          // see: https://github.com/enisdenjo/graphql-ws/discussions/290
          client.terminate();
        }, 5_000);
      }
    },
    pong: (received) => {
      if (received) {
        clearTimeout(timedOut);
      }
    },
  },
});
```

</details>

<details id="custom-client-pinger">
<summary><a href="#custom-client-pinger">🔗</a> Client usage with manual pings and pongs</summary>

```typescript
import {
  createClient,
  Client,
  ClientOptions,
  stringifyMessage,
  PingMessage,
  PongMessage,
  MessageType,
} from 'graphql-ws';

interface PingerClient extends Client {
  ping(payload?: PingMessage['payload']): void;
  pong(payload?: PongMessage['payload']): void;
}

function createPingerClient(options: ClientOptions): PingerClient {
  let activeSocket: WebSocket;

  const client = createClient({
    disablePong: true,
    ...options,
    on: {
      opened: (socket) => {
        options.on?.opened?.(socket);
        activeSocket = socket;
      },
    },
  });

  return {
    ...client,
    ping: (payload) => {
      if (activeSocket.readyState === WebSocket.OPEN)
        activeSocket.send(
          stringifyMessage({
            type: MessageType.Ping,
            payload,
          }),
        );
    },
    pong: (payload) => {
      if (activeSocket.readyState === WebSocket.OPEN)
        activeSocket.send(
          stringifyMessage({
            type: MessageType.Pong,
            payload,
          }),
        );
    },
  };
}
```

</details>

<details id="supported-check">
<summary><a href="#supported-check">🔗</a> Client usage supported check</summary>

```ts
import { createClient } from 'graphql-ws';

function supportsGraphQLTransportWS(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const client = createClient({
      url,
      retryAttempts: 0, // fail immediately
      lazy: false, // connect as soon as the client is created
      on: {
        closed: () => resolve(false), // connection rejected, probably not supported
        connected: () => {
          resolve(true); // connected = supported
          client.dispose(); // dispose after check
        },
      },
    });
  });
}

const supported = await supportsGraphQLTransportWS(
  'ws://some.unknown:4000/enpoint',
);
if (supported) {
  // use graphql-ws
} else {
  // fallback (use subscriptions-transport-ws?)
}
```

</details>

<details id="browser">
<summary><a href="#browser">🔗</a> Client usage in browser</summary>

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>GraphQL over WebSocket</title>
    <script
      type="text/javascript"
      src="https://unpkg.com/graphql-ws/umd/graphql-ws.min.js"
    ></script>
  </head>
  <body>
    <script type="text/javascript">
      const client = graphqlWs.createClient({
        url: 'ws://umdfor.the:4000/win/graphql',
      });

      // consider other recipes for usage inspiration
    </script>
  </body>
</html>
```

</details>

<details id="node-client">
<summary><a href="#node-client">🔗</a> Client usage in Node</summary>

```ts
const ws = require('ws'); // yarn add ws
const { randomUUID } = require('node:crypto');
const { createClient } = require('graphql-ws');

const client = createClient({
  url: 'ws://no.browser:4000/graphql',
  webSocketImpl: ws,
  generateID: () => randomUUID(),
});

// consider other recipes for usage inspiration
```

</details>

<details id="node-client-headers">
<summary><a href="#node-client-headers">🔗</a> Client usage in Node with custom headers <a href="https://stackoverflow.com/a/4361358/3633671">(not possible in browsers)</a></summary>

```ts
const WebSocket = require('ws'); // yarn add ws
const { createClient } = require('graphql-ws');

class MyWebSocket extends WebSocket {
  constructor(address, protocols) {
    super(address, protocols, {
      headers: {
        // your custom headers go here
        'User-Agent': 'graphql-ws client',
        'X-Custom-Header': 'hello world',
      },
    });
  }
}

const client = createClient({
  url: 'ws://node.custom-headers:4000/graphql',
  webSocketImpl: MyWebSocket,
});

// consider other recipes for usage inspiration
```

</details>

<details id="client-with-on-reconnect">
<summary><a href="#client-with-on-reconnect">🔗</a> Client usage with reconnect listener</summary>

```ts
import { createClient, Client, ClientOptions } from 'graphql-ws';
import { refetchSomeQueries } from './on-reconnected';

interface ClientWithOnReconnected extends Client {
  onReconnected(cb: () => void): () => void;
}

function createClientWithOnReconnected(
  options: ClientOptions,
): ClientWithOnReconnected {
  let abruptlyClosed = false;
  const reconnectedCbs: (() => void)[] = [];

  const client = createClient({
    ...options,
    on: {
      ...options.on,
      closed: (event) => {
        options.on?.closed?.(event);
        // non-1000 close codes are abrupt closes
        if ((event as CloseEvent).code !== 1000) {
          abruptlyClosed = true;
        }
      },
      connected: (...args) => {
        options.on?.connected?.(...args);
        // if the client abruptly closed, this is then a reconnect
        if (abruptlyClosed) {
          abruptlyClosed = false;
          reconnectedCbs.forEach((cb) => cb());
        }
      },
    },
  });

  return {
    ...client,
    onReconnected: (cb) => {
      reconnectedCbs.push(cb);
      return () => {
        reconnectedCbs.splice(reconnectedCbs.indexOf(cb), 1);
      };
    },
  };
}

const client = createClientWithOnReconnected({
  url: 'ws://ireconnect:4000/and/notify',
});

const unlisten = client.onReconnected(() => {
  refetchSomeQueries();
});
```

</details>

<details id="ws">
<summary><a href="#ws">🔗</a> Server usage with <a href="https://github.com/websockets/ws">ws</a></summary>

```ts
// minimal version of `import { useServer } from 'graphql-ws/lib/use/ws';`

import { WebSocketServer } from 'ws'; // yarn add ws
// import ws from 'ws'; yarn add ws@7
// const WebSocketServer = ws.Server;
import { makeServer, CloseCode } from 'graphql-ws';
import { schema } from './my-graphql-schema';

// make
const server = makeServer({ schema });

// create websocket server
const wsServer = new WebSocketServer({
  port: 4000,
  path: '/graphql',
});

// implement
wsServer.on('connection', (socket, request) => {
  // a new socket opened, let graphql-ws take over
  const closed = server.opened(
    {
      protocol: socket.protocol, // will be validated
      send: (data) =>
        new Promise((resolve, reject) => {
          socket.send(data, (err) => (err ? reject(err) : resolve()));
        }), // control your data flow by timing the promise resolve
      close: (code, reason) => socket.close(code, reason), // there are protocol standard closures
      onMessage: (cb) =>
        socket.on('message', async (event) => {
          try {
            // wait for the the operation to complete
            // - if init message, waits for connect
            // - if query/mutation, waits for result
            // - if subscription, waits for complete
            await cb(event.toString());
          } catch (err) {
            // all errors that could be thrown during the
            // execution of operations will be caught here
            socket.close(CloseCode.InternalServerError, err.message);
          }
        }),
    },
    // pass values to the `extra` field in the context
    { socket, request },
  );

  // notify server that the socket closed
  socket.once('close', (code, reason) => closed(code, reason));
});
```

</details>

<details id="ws-auth-handling">
<summary><a href="#ws-auth-handling">🔗</a> Server usage with <a href="https://github.com/websockets/ws">ws</a> and custom auth handling</summary>

```ts
// check extended implementation at `{ useServer } from 'graphql-ws/lib/use/ws'`

import http from 'http';
import { WebSocketServer } from 'ws'; // yarn add ws
// import ws from 'ws'; yarn add ws@7
// const WebSocketServer = ws.Server;
import { makeServer, CloseCode } from 'graphql-ws';
import { schema } from './my-graphql-schema';
import { validate } from './my-auth';

// extra in the context
interface Extra {
  readonly request: http.IncomingMessage;
}

// your custom auth
class Forbidden extends Error {}
function handleAuth(request: http.IncomingMessage) {
  // do your auth on every subscription connect
  const good = validate(request.headers['authorization']);
  // or const { iDontApprove } = session(request.cookies);
  if (!good) {
    // throw a custom error to be handled
    throw new Forbidden(':(');
  }
}

// make graphql server
const gqlServer = makeServer<Extra>({
  schema,
  onConnect: async (ctx) => {
    // do your auth on every connect (recommended)
    await handleAuth(ctx.extra.request);
  },
  onSubscribe: async (ctx) => {
    // or maybe on every subscribe
    await handleAuth(ctx.extra.request);
  },
});

// create websocket server
const wsServer = new WebSocketServer({
  port: 4000,
  path: '/graphql',
});

// implement
wsServer.on('connection', (socket, request) => {
  // you may even reject the connection without ever reaching the lib
  // return socket.close(4403, 'Forbidden');

  // pass the connection to graphql-ws
  const closed = gqlServer.opened(
    {
      protocol: socket.protocol, // will be validated
      send: (data) =>
        new Promise((resolve, reject) => {
          // control your data flow by timing the promise resolve
          socket.send(data, (err) => (err ? reject(err) : resolve()));
        }),
      close: (code, reason) => socket.close(code, reason), // for standard closures
      onMessage: (cb) => {
        socket.on('message', async (event) => {
          try {
            // wait for the the operation to complete
            // - if init message, waits for connect
            // - if query/mutation, waits for result
            // - if subscription, waits for complete
            await cb(event.toString());
          } catch (err) {
            // all errors that could be thrown during the
            // execution of operations will be caught here
            if (err instanceof Forbidden) {
              // your magic
            } else {
              socket.close(CloseCode.InternalServerError, err.message);
            }
          }
        });
      },
    },
    // pass request to the extra
    { request },
  );

  // notify server that the socket closed
  socket.once('close', (code, reason) => closed(code, reason));
});
```

</details>

<details id="ws-sub-ping-pong">
<summary><a href="#ws-sub-ping-pong">🔗</a> Server usage with <a href="https://github.com/websockets/ws">ws</a> and subprotocol pings and pongs</summary>

```ts
import { WebSocketServer } from 'ws'; // yarn add ws
// import ws from 'ws'; yarn add ws@7
// const WebSocketServer = ws.Server;
import {
  makeServer,
  CloseCode,
  stringifyMessage,
  MessageType,
} from 'graphql-ws';
import { schema } from './my-graphql-schema';

// make
const server = makeServer({ schema });

// create websocket server
const wsServer = new WebSocketServer({
  port: 4000,
  path: '/graphql',
});

// implement
wsServer.on('connection', (socket, request) => {
  // subprotocol pinger because WS level ping/pongs might not be available
  let pinger, pongWait;
  function ping() {
    if (socket.readyState === socket.OPEN) {
      // send the subprotocol level ping message
      socket.send(stringifyMessage({ type: MessageType.Ping }));

      // wait for the pong for 6 seconds and then terminate
      pongWait = setTimeout(() => {
        clearInterval(pinger);
        socket.close();
      }, 6_000);
    }
  }

  // ping the client on an interval every 12 seconds
  pinger = setInterval(() => ping(), 12_000);

  // a new socket opened, let graphql-ws take over
  const closed = server.opened(
    {
      protocol: socket.protocol, // will be validated
      send: (data) => socket.send(data),
      close: (code, reason) => socket.close(code, reason),
      onMessage: (cb) =>
        socket.on('message', async (event) => {
          try {
            // wait for the the operation to complete
            // - if init message, waits for connect
            // - if query/mutation, waits for result
            // - if subscription, waits for complete
            await cb(event.toString());
          } catch (err) {
            // all errors that could be thrown during the
            // execution of operations will be caught here
            socket.close(CloseCode.InternalServerError, err.message);
          }
        }),
      // pong received, clear termination timeout
      onPong: () => clearTimeout(pongWait),
    },
    // pass values to the `extra` field in the context
    { socket, request },
  );

  // notify server that the socket closed and stop the pinger
  socket.once('close', (code, reason) => {
    clearTimeout(pongWait);
    clearInterval(pinger);
    closed(code, reason);
  });
});
```

</details>

<details id="cf-workers">
<summary><a href="#cf-workers">🔗</a> Server usage with <a href="https://workers.cloudflare.com/">Cloudflare Workers</a></summary>

[Please check the `worker-graphql-ws-template` repo out.](https://github.com/enisdenjo/cloudflare-worker-graphql-ws-template)

</details>

<details id="yoga">
<summary><a href="#yoga">🔗</a> <a href="https://github.com/websockets/ws">ws</a> server usage with <a href="https://www.graphql-yoga.com">GraphQL Yoga</a></summary>

```typescript
import { createServer } from 'http';
import { createYoga } from 'graphql-yoga';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { schema } from './my-graphql-schema';

const yoga = createYoga({
  schema,
  graphiql: {
    // Use WebSockets in GraphiQL
    subscriptionsProtocol: 'WS',
  },
});

// Get NodeJS Server from Yoga
const server = createServer(yoga);

// Create WebSocket server instance from our Node server
const wsServer = new WebSocketServer({
  server,
  path: yoga.graphqlEndpoint,
});

// Integrate through Yoga's Envelop instance
useServer(
  {
    execute: (args: any) => args.rootValue.execute(args),
    subscribe: (args: any) => args.rootValue.subscribe(args),
    onSubscribe: async (ctx, msg) => {
      const { schema, execute, subscribe, contextFactory, parse, validate } =
        yoga.getEnveloped({
          ...ctx,
          req: ctx.extra.request,
          socket: ctx.extra.socket,
          params: msg.payload,
        });

      const args = {
        schema,
        operationName: msg.payload.operationName,
        document: parse(msg.payload.query),
        variableValues: msg.payload.variables,
        contextValue: await contextFactory(),
        rootValue: {
          execute,
          subscribe,
        },
      };

      const errors = validate(args.schema, args.document);
      if (errors.length) return errors;
      return args;
    },
  },
  wsServer,
);

server.listen(4000, () => {
  console.log('Listening to port 4000');
});
```

</details>

<details id="express">
<summary><a href="#express">🔗</a> <a href="https://github.com/websockets/ws">ws</a> server usage with <a href="https://github.com/graphql/express-graphql">Express GraphQL</a></summary>

```typescript
import { WebSocketServer } from 'ws'; // yarn add ws
// import ws from 'ws'; yarn add ws@7
// const WebSocketServer = ws.Server;
import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { useServer } from 'graphql-ws/lib/use/ws';
import { schema } from './my-graphql-schema';

// create express and middleware
const app = express();
app.use('/graphql', graphqlHTTP({ schema }));

const server = app.listen(4000, () => {
  // create and use the websocket server
  const wsServer = new WebSocketServer({
    server,
    path: '/graphql',
  });

  useServer({ schema }, wsServer);
});
```

</details>

<details id="apollo-server-express">
<summary><a href="#apollo-server-express">🔗</a> <a href="https://github.com/websockets/ws">ws</a> server usage with <a href="https://www.apollographql.com/docs/apollo-server/data/subscriptions/">Apollo Server Express</a></summary>

```typescript
import { ApolloServer } from 'apollo-server-express';
import { createServer } from 'http';
import express from 'express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { schema } from './my-graphql-schema';

// create express and HTTP server
const app = express();
const httpServer = createServer(app);

// create websocket server
const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/graphql',
});

// Save the returned server's info so we can shut down this server later
const serverCleanup = useServer({ schema }, wsServer);

// create apollo server
const apolloServer = new ApolloServer({
  schema,
  plugins: [
    // Proper shutdown for the HTTP server.
    ApolloServerPluginDrainHttpServer({ httpServer }),

    // Proper shutdown for the WebSocket server.
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
});

await apolloServer.start();
apolloServer.applyMiddleware({ app });

httpServer.listen(4000);
```

</details>

<details id="apollo-server-hapi-js">
<summary><a href="#apollo-server-hapi-js">🔗</a> <a href="https://github.com/websockets/ws">ws</a> server usage with <a href="https://www.apollographql.com/docs/apollo-server/v3/integrations/middleware/#apollo-server-hapi">Apollo Server Hapi.js</a></summary>

```typescript
import {
  ApolloServer,
  ApolloServerPluginStopHapiServer,
} from 'apollo-server-hapi';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import Hapi from '@hapi/hapi';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { createServer } from 'http';
import { schema } from './my-graphql-schema';

// create hapi.js and HTTP server
const httpServer = createServer();
const hapiServer = Hapi.server({
  port: 4001,
  host: 'localhost',
  listener: httpServer,
  routes: { security: true }, // <-- not required yet good practice
});

// create websocket server
const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/graphql',
});

// Save the returned server's info so we can shut down this server later
const serverCleanup = useServer({ schema }, wsServer);

// create apollo server
const apolloServer = new ApolloServer({
  schema,
  plugins: [
    // Proper shutdown for the HTTP server.
    ApolloServerPluginDrainHttpServer({ httpServer }),
    // Proper shutdown for the Hapi.js server.
    ApolloServerPluginStopHapiServer({ hapiServer }),
    // Proper shutdown for the WebSocket server.
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
});

await apolloServer.start();
await apolloServer.applyMiddleware({ app: hapiServer });

await hapiServer.start();
console.log('Open GraphQL editor on: %s/graphql', hapiServer.info.uri);
```

</details>

<details id="deprecated-fastify-websocket">
<summary><a href="#deprecated-fastify-websocket">🔗</a> <a href="https://github.com/websockets/ws">ws</a> server usage with <a href="https://www.npmjs.com/package/fastify-websocket">deprecated fastify-websocket</a></summary>

```typescript
import Fastify from 'fastify'; // yarn add fastify@^3
import fastifyWebsocket from 'fastify-websocket'; // yarn add fastify-websocket@4.2.2
import { makeHandler } from 'graphql-ws/lib/use/fastify-websocket';
import { schema } from './previous-step';

const fastify = Fastify();
fastify.register(fastifyWebsocket);

fastify.get('/graphql', { websocket: true }, makeHandler({ schema }));

fastify.listen(4000, (err) => {
  if (err) {
    fastify.log.error(err);
    return process.exit(1);
  }
  console.log('Listening to port 4000');
});
```

</details>

<details id="ws-backwards-compat">
<summary><a href="#ws-backwards-compat">🔗</a> <a href="https://github.com/websockets/ws">ws</a> server usage with <a href="https://github.com/apollographql/subscriptions-transport-ws">subscriptions-transport-ws</a> backwards compatibility</summary>

```ts
import http from 'http';
import { WebSocketServer } from 'ws'; // yarn add ws
// import ws from 'ws'; yarn add ws@7
// const WebSocketServer = ws.Server;
import { execute, subscribe } from 'graphql';
import { GRAPHQL_TRANSPORT_WS_PROTOCOL } from 'graphql-ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { SubscriptionServer, GRAPHQL_WS } from 'subscriptions-transport-ws';
import { schema } from './my-graphql-schema';

// graphql-ws
const graphqlWs = new WebSocketServer({ noServer: true });
useServer({ schema }, graphqlWs);

// subscriptions-transport-ws
const subTransWs = new WebSocketServer({ noServer: true });
SubscriptionServer.create(
  {
    schema,
    execute,
    subscribe,
  },
  subTransWs,
);

// create http server
const server = http.createServer(function weServeSocketsOnly(_, res) {
  res.writeHead(404);
  res.end();
});

// listen for upgrades and delegate requests according to the WS subprotocol
server.on('upgrade', (req, socket, head) => {
  // extract websocket subprotocol from header
  const protocol = req.headers['sec-websocket-protocol'];
  const protocols = Array.isArray(protocol)
    ? protocol
    : protocol?.split(',').map((p) => p.trim());

  // decide which websocket server to use
  const wss =
    protocols?.includes(GRAPHQL_WS) && // subscriptions-transport-ws subprotocol
    !protocols.includes(GRAPHQL_TRANSPORT_WS_PROTOCOL) // graphql-ws subprotocol
      ? subTransWs
      : // graphql-ws will welcome its own subprotocol and
        // gracefully reject invalid ones. if the client supports
        // both transports, graphql-ws will prevail
        graphqlWs;
  wss.handleUpgrade(req, socket, head, (ws) => {
    wss.emit('connection', ws, req);
  });
});

server.listen(4000);
```

</details>

<details id="logging">
<summary><a href="#logging">🔗</a> <a href="https://github.com/websockets/ws">ws</a> server usage with console logging</summary>

```typescript
import { WebSocketServer } from 'ws'; // yarn add ws
// import ws from 'ws'; yarn add ws@7
// const WebSocketServer = ws.Server;
import { useServer } from 'graphql-ws/lib/use/ws';
import { schema } from './my-graphql-schema';

const wsServer = new WebSocketServer({
  port: 4000,
  path: '/graphql',
});

useServer(
  {
    schema,
    onConnect: (ctx) => {
      console.log('Connect', ctx);
    },
    onSubscribe: (ctx, msg) => {
      console.log('Subscribe', { ctx, msg });
    },
    onNext: (ctx, msg, args, result) => {
      console.debug('Next', { ctx, msg, args, result });
    },
    onError: (ctx, msg, errors) => {
      console.error('Error', { ctx, msg, errors });
    },
    onComplete: (ctx, msg) => {
      console.log('Complete', { ctx, msg });
    },
  },
  wsServer,
);
```

</details>

<details id="multi-ws">
<summary><a href="#multi-ws">🔗</a> <a href="https://github.com/websockets/ws">ws</a> server usage on a multi WebSocket server</summary>

```typescript
import http from 'http';
import { WebSocketServer } from 'ws'; // yarn add ws
// import ws from 'ws'; yarn add ws@7
// const WebSocketServer = ws.Server;
import url from 'url';
import { useServer } from 'graphql-ws/lib/use/ws';
import { schema } from './my-graphql-schema';

const server = http.createServer(function weServeSocketsOnly(_, res) {
  res.writeHead(404);
  res.end();
});

/**
 * Two websocket servers on different paths:
 * - `/wave` sends out waves
 * - `/graphql` serves graphql
 */
const waveWS = new WebSocketServer({ noServer: true });
const graphqlWS = new WebSocketServer({ noServer: true });

// delegate upgrade requests to relevant destinations
server.on('upgrade', (request, socket, head) => {
  const pathname = url.parse(request.url).pathname;

  if (pathname === '/wave') {
    return waveWS.handleUpgrade(request, socket, head, (client) => {
      waveWS.emit('connection', client, request);
    });
  }

  if (pathname === '/graphql') {
    return graphqlWS.handleUpgrade(request, socket, head, (client) => {
      graphqlWS.emit('connection', client, request);
    });
  }

  return socket.destroy();
});

// wave on connect
waveWS.on('connection', (socket) => {
  socket.send('🌊');
});

// serve graphql
useServer({ schema }, graphqlWS);

server.listen(4000);
```

</details>

<details id="context">
<summary><a href="#context">🔗</a> <a href="https://github.com/websockets/ws">ws</a> server usage with custom context value</summary>

```typescript
import { WebSocketServer } from 'ws'; // yarn add ws
// import ws from 'ws'; yarn add ws@7
// const WebSocketServer = ws.Server;
import { useServer } from 'graphql-ws/lib/use/ws';
import { schema, getDynamicContext } from './my-graphql';

const wsServer = new WebSocketServer({
  port: 4000,
  path: '/graphql',
});

useServer(
  {
    context: (ctx, msg, args) => {
      return getDynamicContext(ctx, msg, args);
    }, // or static context by supplying the value direcly
    schema,
  },
  wsServer,
);
```

</details>

<details id="dynamic-schema">
<summary><a href="#dynamic-schema">🔗</a> <a href="https://github.com/websockets/ws">ws</a> server usage with dynamic schema</summary>

```typescript
import { WebSocketServer } from 'ws'; // yarn add ws
// import ws from 'ws'; yarn add ws@7
// const WebSocketServer = ws.Server;
import { useServer } from 'graphql-ws/lib/use/ws';
import { schema, checkIsAdmin, getDebugSchema } from './my-graphql';

const wsServer = new WebSocketServer({
  port: 4000,
  path: '/graphql',
});

useServer(
  {
    schema: async (ctx, msg, executionArgsWithoutSchema) => {
      // will be called on every subscribe request
      // allowing you to dynamically supply the schema
      // using the depending on the provided arguments.
      // throwing an error here closes the socket with
      // the `Error` message in the close event reason
      const isAdmin = await checkIsAdmin(ctx.request);
      if (isAdmin) return getDebugSchema(ctx, msg, executionArgsWithoutSchema);
      return schema;
    },
  },
  wsServer,
);
```

</details>

<details id="custom-validation">
<summary><a href="#custom-validation">🔗</a> <a href="https://github.com/websockets/ws">ws</a> server usage with custom validation</summary>

```typescript
import { WebSocketServer } from 'ws'; // yarn add ws
// import ws from 'ws'; yarn add ws@7
// const WebSocketServer = ws.Server;
import { useServer } from 'graphql-ws/lib/use/ws';
import { validate } from 'graphql';
import { schema, myValidationRules } from './my-graphql';

const wsServer = new WebSocketServer({
  port: 4000,
  path: '/graphql',
});

useServer(
  {
    validate: (schema, document) =>
      validate(schema, document, myValidationRules),
  },
  wsServer,
);
```

</details>

<details id="custom-exec">
<summary><a href="#custom-exec">🔗</a> <a href="https://github.com/websockets/ws">ws</a> server usage with custom execution arguments</summary>

```typescript
import { parse, validate } from 'graphql';
import { WebSocketServer } from 'ws'; // yarn add ws
// import ws from 'ws'; yarn add ws@7
// const WebSocketServer = ws.Server;
import { useServer } from 'graphql-ws/lib/use/ws';
import { schema, myValidationRules } from './my-graphql';

const wsServer = new WebSocketServer({
  port: 4000,
  path: '/graphql',
});

useServer(
  {
    onSubscribe: (ctx, msg) => {
      const args = {
        schema,
        operationName: msg.payload.operationName,
        document: parse(msg.payload.query),
        variableValues: msg.payload.variables,
      };

      // dont forget to validate when returning custom execution args!
      const errors = validate(args.schema, args.document, myValidationRules);
      if (errors.length > 0) {
        return errors; // return `GraphQLError[]` to send `ErrorMessage` and stop subscription
      }

      return args;
    },
  },
  wsServer,
);
```

</details>

<details id="only-subscriptions">
<summary><a href="#only-subscriptions">🔗</a> <a href="https://github.com/websockets/ws">ws</a> server usage accepting only subscription operations</summary>

```typescript
import { parse, validate, getOperationAST, GraphQLError } from 'graphql';
import { WebSocketServer } from 'ws'; // yarn add ws
// import ws from 'ws'; yarn add ws@7
// const WebSocketServer = ws.Server;
import { useServer } from 'graphql-ws/lib/use/ws';
import { schema } from './my-graphql';

const wsServer = new WebSocketServer({
  port: 4000,
  path: '/graphql',
});

useServer(
  {
    onSubscribe: (_ctx, msg) => {
      // construct the execution arguments
      const args = {
        schema,
        operationName: msg.payload.operationName,
        document: parse(msg.payload.query),
        variableValues: msg.payload.variables,
      };

      const operationAST = getOperationAST(args.document, args.operationName);
      if (!operationAST) {
        // returning `GraphQLError[]` sends an `ErrorMessage` and stops the subscription
        return [new GraphQLError('Unable to identify operation')];
      }

      // handle mutation and query requests
      if (operationAST.operation !== 'subscription') {
        // returning `GraphQLError[]` sends an `ErrorMessage` and stops the subscription
        return [new GraphQLError('Only subscription operations are supported')];

        // or if you want to be strict and terminate the connection on illegal operations
        throw new Error('Only subscription operations are supported');
      }

      // dont forget to validate
      const errors = validate(args.schema, args.document);
      if (errors.length > 0) {
        // returning `GraphQLError[]` sends an `ErrorMessage` and stops the subscription
        return errors;
      }

      // ready execution arguments
      return args;
    },
  },
  wsServer,
);
```

</details>

<details id="persisted">
<summary><a href="#persisted">🔗</a> <a href="https://github.com/websockets/ws">ws</a> server and client usage with persisted queries</summary>

```typescript
// 🛸 server

import { parse, ExecutionArgs } from 'graphql';
import { WebSocketServer } from 'ws'; // yarn add ws
// import ws from 'ws'; yarn add ws@7
// const WebSocketServer = ws.Server;
import { useServer } from 'graphql-ws/lib/use/ws';
import { schema } from './my-graphql-schema';

// a unique GraphQL execution ID used for representing
// a query in the persisted queries store. when subscribing
// you should use the `SubscriptionPayload.query` to transmit the id
type QueryID = string;

const queriesStore: Record<QueryID, ExecutionArgs> = {
  iWantTheGreetings: {
    schema, // you may even provide different schemas in the queries store
    document: parse('subscription Greetings { greetings }'),
  },
};

const wsServer = new WebSocketServer({
  port: 4000,
  path: '/graphql',
});

useServer(
  {
    onSubscribe: (_ctx, msg) => {
      const persistedQuery =
        queriesStore[msg.payload.extensions?.persistedQuery];
      if (persistedQuery) {
        return {
          ...persistedQuery,
          variableValues: msg.payload.variables, // use the variables from the client
        };
      }

      // for extra security you only allow the queries from the store.
      // if you want to support both, simply remove the throw below and
      // graphql-ws will handle the query for you
      throw new Error('404: Query Not Found');
    },
  },
  wsServer,
);
```

```typescript
// 📺 client

import { createClient } from 'graphql-ws';

const client = createClient({
  url: 'ws://persisted.graphql:4000/queries',
});

(async () => {
  const onNext = () => {
    /**/
  };

  await new Promise((resolve, reject) => {
    client.subscribe(
      {
        query: '', // query field is required, but you can leave it empty for persisted queries
        extensions: {
          persistedQuery: 'iWantTheGreetings',
        },
      },
      {
        next: onNext,
        error: reject,
        complete: resolve,
      },
    );
  });

  expect(onNext).toBeCalledTimes(5); // greetings in 5 languages
})();
```

</details>

<details id="auth-token">
<summary><a href="#auth-token">🔗</a> <a href="https://github.com/websockets/ws">ws</a> server and client auth usage with token expiration, validation and refresh</summary>

```typescript
// 🛸 server

import { WebSocketServer } from 'ws'; // yarn add ws
// import ws from 'ws'; yarn add ws@7
// const WebSocketServer = ws.Server;
import { useServer } from 'graphql-ws/lib/use/ws';
import { CloseCode } from 'graphql-ws';
import { schema } from './my-graphql-schema';
import { isTokenValid } from './my-auth';

const wsServer = new WebSocket.Server({
  port: 4000,
  path: '/graphql',
});

useServer(
  {
    schema,
    onConnect: async (ctx) => {
      // do your auth check on every connect (recommended)
      if (!(await isTokenValid(ctx.connectionParams?.token)))
        // returning false from the onConnect callback will close with `4403: Forbidden`;
        // therefore, being synonymous to ctx.extra.socket.close(4403, 'Forbidden');
        return false;
    },
    onSubscribe: async (ctx) => {
      // or maybe on every subscribe
      if (!(await isTokenValid(ctx.connectionParams?.token)))
        return ctx.extra.socket.close(CloseCode.Forbidden, 'Forbidden');
    },
  },
  wsServer,
);
```

```typescript
// 📺 client

import { createClient, CloseCode } from 'graphql-ws';
import {
  getCurrentToken,
  getCurrentTokenExpiresIn,
  refreshCurrentToken,
} from './my-auth';

// non-fatal WebSocket connection close events will cause the
// client to automatically reconnect. the retries are silent, meaning
// that the client will not error out unless the retry attempts have been
// exceeded or the close event was fatal (read more about the fatal
// close events in the documentation). additionally, all active subscriptions
// will automatically resubscribe upon successful reconnect. this behaviour
// can be leveraged to implement a secure and sound way of authentication;
// handling server-side validation, expiry indication and timely token refreshes

// indicates that the server closed the connection because of
// an auth problem. it indicates that the token should refresh
let shouldRefreshToken = false,
  // the socket close timeout due to token expiry
  tokenExpiryTimeout = null;

const client = createClient({
  url: 'ws://server-validates.auth:4000/graphql',
  connectionParams: async () => {
    if (shouldRefreshToken) {
      // refresh the token because it is no longer valid
      await refreshCurrentToken();
      // and reset the flag to avoid refreshing too many times
      shouldRefreshToken = false;
    }
    return { token: getCurrentToken() };
  },
  on: {
    connected: (socket) => {
      // clear timeout on every connect for debouncing the expiry
      clearTimeout(tokenExpiryTimeout);

      // set a token expiry timeout for closing the socket
      // with an `4403: Forbidden` close event indicating
      // that the token expired. the `closed` event listner below
      // will set the token refresh flag to true
      tokenExpiryTimeout = setTimeout(() => {
        if (socket.readyState === WebSocket.OPEN)
          socket.close(CloseCode.Forbidden, 'Forbidden');
      }, getCurrentTokenExpiresIn());
    },
    closed: (event) => {
      // if closed with the `4403: Forbidden` close event
      // the client or the server is communicating that the token
      // is no longer valid and should be therefore refreshed
      if (event.code === CloseCode.Forbidden) shouldRefreshToken = true;
    },
  },
});
```

</details>

<details id="subscribe-ack">
<summary><a href="#subscribe-ack">🔗</a> <a href="https://github.com/websockets/ws">ws</a> server and client usage with subscription acknowledgment</summary>

```ts
// 🛸 server

import { WebSocketServer } from 'ws';
// import ws from 'ws'; yarn add ws@7
// const WebSocketServer = ws.Server;
import { MessageType, stringifyMessage } from 'graphql-ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { schema } from './my-graphql-schema';

const wsServer = new WebSocketServer({
  port: 4000,
  path: '/graphql',
});

useServer<undefined, { ackWaiters: Record<string, () => void> }>(
  {
    schema,
    onConnect: (ctx) => {
      // listeners waiting for operation acknowledgment. if subscription, this means the graphql.subscribe was successful
      // intentionally in context extra to avoid memory leaks when clients disconnect
      ctx.extra.ackWaiters = {};
    },
    onSubscribe: (ctx, msg) => {
      const ackId = msg.payload.extensions?.ackId;
      if (typeof ackId === 'string') {
        // if acknowledgment ID is present, create an acknowledger that will be executed when operation succeeds
        ctx.extra.ackWaiters![msg.id] = () => {
          ctx.extra.socket.send(
            stringifyMessage({
              type: MessageType.Ping,
              payload: {
                ackId,
              },
            }),
          );
        };
      }
    },
    onOperation: (ctx, msg) => {
      // acknowledge operation success and remove waiter
      ctx.extra.ackWaiters![msg.id]?.();
      delete ctx.extra.ackWaiters![msg.id];
    },
  },
  wsServer,
);

console.log('Listening to port 4000');
```

```ts
// 📺 client

import {
  Client,
  ClientOptions,
  createClient,
  ExecutionResult,
  Sink,
  SubscribePayload,
} from 'graphql-ws';

// client with augmented subscribe method accepting the `onAck` callback for operation acknowledgement
type ClientWithSubscribeAck = Omit<Client, 'subscribe'> & {
  subscribe<Data = Record<string, unknown>, Extensions = unknown>(
    payload: SubscribePayload,
    sink: Sink<ExecutionResult<Data, Extensions>>,
    onAck: () => void,
  ): () => void;
};

function createClientWithSubscribeAck(
  options: ClientOptions,
): ClientWithSubscribeAck {
  const client = createClient(options);

  const ackListeners: Record<string, () => void> = {};
  client.on('ping', (_received, payload) => {
    const ackId = payload?.ackId;
    if (typeof ackId === 'string') {
      ackListeners[ackId]?.();
      delete ackListeners[ackId];
    }
  });

  return {
    ...client,
    subscribe: (payload, sink, onAck) => {
      const ackId = Math.random().toString(); // be wary of uniqueness
      ackListeners[ackId] = onAck;
      return client.subscribe(
        {
          ...payload,
          extensions: {
            ...payload.extensions,
            ackId,
          },
        },
        sink,
      );
    },
  };
}
```

Using the augmented client would be as simple as:

```ts
const client = createClientWithSubscribeAck({
  url: 'ws://i.want.ack:4000/graphql',
});

(async () => {
  const onNext = () => {
    /* handle incoming values */
  };

  let unsubscribe = () => {
    /* complete the subscription */
  };

  let subscriptionAcknowledged = () => {
    /* server successfully subscribed */
  };

  await new Promise((resolve, reject) => {
    unsubscribe = client.subscribe(
      {
        query: 'subscription { greetings }',
      },
      {
        next: onNext,
        error: reject,
        complete: resolve,
      },
      subscriptionAcknowledged,
    );
  });

  expect(subscriptionAcknowledged).toBeCalledFirst();

  expect(onNext).then.toBeCalledTimes(5); // we say "Hi" in 5 languages
})();
```

</details>

## [Documentation](docs/)

Check the [docs folder](docs/) out for [TypeDoc](https://typedoc.org) generated documentation.

## [How does it work?](PROTOCOL.md)

Read about the exact transport intricacies used by the library in the [GraphQL over WebSocket Protocol document](PROTOCOL.md).

## [Want to help?](CONTRIBUTING.md)

File a bug, contribute with code, or improve documentation? Read up on our guidelines for [contributing](CONTRIBUTING.md) and drive development with `yarn test --watch` away!

## Disclaimer

This library and the [GraphQL over WebSocket Protocol](https://github.com/enisdenjo/graphql-ws/blob/master/PROTOCOL.md) are **not** cross-compatible with the [deprecated `subscriptions-transport-ws`](https://github.com/apollographql/subscriptions-transport-ws) and its [accompanying Protocol](https://github.com/apollographql/subscriptions-transport-ws/blob/master/PROTOCOL.md).

You must use `graphql-ws` coherently and implement the [GraphQL over WebSocket Protocol](https://github.com/enisdenjo/graphql-ws/blob/master/PROTOCOL.md) on both sides, server and the client.
