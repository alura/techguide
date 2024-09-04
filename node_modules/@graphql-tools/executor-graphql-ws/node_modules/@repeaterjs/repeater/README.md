# Repeater.js
The missing constructor for creating safe async iterators.

For more information, visit [repeater.js.org](https://repeater.js.org).

## Installation

Repeater.js is available on [npm](https://www.npmjs.com/package/@repeaterjs/repeater) in the CommonJS and ESModule formats.

`$ npm install @repeaterjs/repeater`

`$ yarn add @repeaterjs/repeater`

## Requirements

The core `@repeaterjs/repeater` module has no dependencies, but requires the following globals in order to work:
- `Promise`
- `WeakMap`
- `Symbol`
  - `Symbol.iterator`
  - `Symbol.asyncIterator`

In addition, repeaters are most useful when used via `async/await` and `for await…of` syntax. You can transpile your code with babel or typescript to support enviroments which lack these features.

## Examples

<h4 id="timestamps">Logging timestamps with setInterval</h4>

```js
import { Repeater } from "@repeaterjs/repeater";

const timestamps = new Repeater(async (push, stop) => {
  push(Date.now());
  const interval = setInterval(() => push(Date.now()), 1000);
  await stop;
  clearInterval(interval);
});

(async function() {
  let i = 0;
  for await (const timestamp of timestamps) {
    console.log(timestamp);
    i++;
    if (i >= 10) {
      console.log("ALL DONE!");
      break; // triggers clearInterval above
    }
  }
})();
```

<h4 id="websocket">Creating a repeater from a websocket</h4>

```js
import { Repeater } from "@repeaterjs/repeater";

const socket = new WebSocket("ws://echo.websocket.org");
const messages = new Repeater(async (push, stop) => {
  socket.onmessage = (ev) => push(ev.data);
  socket.onerror = () => stop(new Error("WebSocket error"));
  socket.onclose = () => stop();
  await stop;
  socket.close();
});

(async function() {
  for await (const message of messages) {
    console.log(message);
    if (message === "close") {
      console.log("Closing!");
      break; // closes the socket
    }
  }
})();

socket.onopen = () => {
  socket.send("hello"); // "hello"
  socket.send("world"); // "world"
  socket.send("close"); // "close", "Closing!"
};
```

<h4 id="konami-code">Listening for the <a href="https://en.wikipedia.org/wiki/Konami_Code">Konami Code</a> and canceling if <kbd>Escape</kbd> is pressed</h4>

```js
import { Repeater } from "@repeaterjs/repeater";

const keys = new Repeater(async (push, stop) => {
  const listener = (ev) => {
    if (ev.key === "Escape") {
      stop();
    } else {
      push(ev.key);
    }
  };
  window.addEventListener("keyup", listener);
  await stop;
  window.removeEventListener("keyup", listener);
});

const konami = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

(async function() {
  let i = 0;
  for await (const key of keys) {
    if (key === konami[i]) {
      i++;
    } else {
      i = 0;
    }
    if (i >= konami.length) {
      console.log("KONAMI!!!");
      break; // removes the keyup listener
    }
  }
})();
```

<h4 id="observables">Converting an observable to an async iterator</h4>

```js
import { Subject } from "rxjs";
import { Repeater } from "@repeaterjs/repeater";

const observable = new Subject();
const repeater = new Repeater(async (push, stop) => {
  const subscription = observable.subscribe({
    next: (value) => push(value),
    error: (err) => stop(err),
    complete: () => stop(),
  });
  await stop;
  subscription.unsubscribe();
});

(async function() {
  try {
    for await (const value of repeater) {
      console.log("Value: ", value);
    }
  } catch (err) {
    console.log("Error caught: ", err);
  }
})();
observable.next(1);
// Value: 1
observable.next(2);
// Value: 2
observable.error(new Error("Hello from observable"));
// Error caught: Error: Hello from observable
```
