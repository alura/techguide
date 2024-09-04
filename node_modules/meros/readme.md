<img src="logo.svg" alt="meros">

<br />
<br />

<div align="right">

`npm add meros` makes reading multipart responses simple

[![npm stats](https://badgen.net/npm/dw/meros)](https://npm-stat.com/charts.html?package=meros)
[![bundle size](https://badgen.net/bundlephobia/minzip/meros)](https://bundlephobia.com/result?p=meros)

<br />

</div>

## ⚡ Features

- No dependencies
- Seemless api
- Super [performant](#-benchmark)
- Supports _any_[^1] `content-type`
- _preamble_ and _epilogue_ don't yield
- Browser/Node Compatible
- Plugs into existing libraries like Relay and rxjs

[^1]: By default, we'll look for JSON, and parse that for you. If not, we'll give you the body as what was streamed.

## 🚀 Usage

> Visit [/examples](/examples) for more info!

```ts
// Relies on bundler/environment detection
import { meros } from 'meros';

const parts = await fetch('/api').then(meros);

// As a simple Async Generator
for await (const part of parts) {
  // Do something with this part
}

// Used with rxjs streams
from(parts).subscribe((part) => {
  // Do something with it
});
```

## _Specific Environment_

#### _Browser_

```ts
import { meros } from 'meros/browser';
// import { meros } from 'https://cdn.skypack.dev/meros';

const parts = await fetch('/api').then(meros);
```

#### _Node_

```ts
import http from 'http';
import { meros } from 'meros/node';

const response = await new Promise((resolve) => {
  const request = http.get(`http://example.com/api`, (response) => {
    resolve(response);
  });
  request.end();
});

const parts = await meros(response);
```

## 🔎 API

Meros offers two flavours, both for the browser and for node; but their api's are fundamentally the same.

> **Note**: The type `Response` is used loosely here and simply alludes to Node's `IncomingMessage` or the browser's
> `Response` type.

### `meros(response: Response, options?: Options)`

Returns: `Promise<Response | AsyncGenerator<Part | Part[]>`

Meros returns a promise that will resolve to an `AsyncGenerator` if the response is of `multipart/mixed` mime, or simply
returns the `Response` if something else; helpful for middlewares. The idea here being that you run meros as a chain off
fetch.

```ts
fetch('/api').then(meros);
```

> If the `content-type` is **NOT** a multipart, then meros will resolve with the response argument.
>
> <details>
> <summary>Example on how to handle this case</summary>
>
> ```ts
> import { meros } from 'meros';
>
> const response = await fetch('/api'); // Assume this isnt multipart
> const parts = await meros(response);
>
> if (parts[Symbol.asyncIterator] < 'u') {
>   for await (const part of parts) {
>     // Do something with this part
>   }
> } else {
>   const data = await parts.json();
> }
> ```
>
> </details>

each `Part` gives you access to:

- `json: boolean` ~ Tells you the `body` would be a JavaScript object of your defined generic `T`.
- `headers: object` ~ A key-value pair of all headers discovered from this part.
- `body: T | Fallback` ~ Is the _body_ of the part, either as a JavaScript object (noted by `json`) _or_ the base type
  of the environment (`Buffer | string`, for Node and Browser respectively).

#### `options.multiple: boolean`

Default: `false`

Setting this to `true` will yield once for all available parts of a chunk, rather than yielding once per part. This is
an optimization technique for technologies like GraphQL where rather than commit the payload to the store, to be
added-to in the next process-tick we can simply do that synchronously.

> **Warning**: This will alter the behaviour and yield arrays—than yield payloads.

```ts
const chunks = await fetch('/api').then((response) => meros(response, { multiple: true }));

// As a simple Async Generator
for await (const parts of chunks) {
  for (const part of parts) {
    // Do something with this part, maybe aggregate?
  }
}
```

## 💨 Benchmark

> via the [`/bench`](/bench) directory with Node v18.0.0

```
Node
✔ meros        ~ 1,271,218 ops/sec ± 0.84%
✘ it-multipart ~   700,039 ops/sec ± 0.72%
--
it-multipart (FAILED @ "should match reference patch set")

Browser
✔ meros                   ~ 800,941 ops/sec ± 1.06%
✘ fetch-multipart-graphql ~ 502,175 ops/sec ± 0.75%
--
fetch-multipart-graphql (FAILED @ "should match reference patch set")
```

## 🎒 Notes

Why the name? _meros_ comes from Ancient Greek μέρος méros, meaning "part".

This library aims to implement [RFC1341] in its entirety, however we aren't there yet. That being said, you may very
well use this library in other scenarios like streaming in file form uploads.

Another goal here is to aide in being the defacto standard transport library to support
[`@defer` and `@stream` GraphQL directives](https://foundation.graphql.org/news/2020/12/08/improving-latency-with-defer-and-stream-directives/)

### _Caveats_

- No support the `/alternative` , `/digest` _or_ `/parallel` subtype at this time.
- No support for [nested multiparts](https://tools.ietf.org/html/rfc1341#appendix-C)

## ❤ Thanks

Special thanks to [Luke Edwards](https://github.com/lukeed) for performance guidance and high level api design.

## 😇 Compassion

This library is simple, a meer few hundred bytes. It's easy to copy, and easy to alter. If you do, that is fine ❤️ im
all for the freedom of software. But please give credit where credit is due.

## License

MIT © [Marais Rossouw](https://marais.io)

[rfc1341]: https://tools.ietf.org/html/rfc1341 'The Multipart Content-Type'
