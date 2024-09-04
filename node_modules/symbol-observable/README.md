# symbol-observable [![Build Status](https://travis-ci.org/benlesh/symbol-observable.svg?branch=master)](https://travis-ci.org/benlesh/symbol-observable)

> [`Symbol.observable`](https://github.com/zenparsing/es-observable) [pony/polyfill](https://ponyfill.com)

This will polyfill `Symbol.observable` if `Symbol` exists, but will not polyfill `Symbol` if it doesn't exist. Meant to be used as a "ponyfill", meaning you're meant to use the module's exported symbol value as described below. This is all done to ensure that everyone is using the same version of the symbol (or string depending on the environment), as per the nature of symbols in JavaScript.


## Install

```
$ npm install --save symbol-observable
```


## Basic Usage

```js
const symbolObservable = require('symbol-observable').default;

console.log(symbolObservable);
//=> Symbol(observable)
```

```ts
import Symbol_observable from 'symbol-observable';

console.log(Symbol_observable);
//=> Symbol(observable)
```

## Making an object "observable":

You can do something like what you see below to make any object "observable" by libraries like RxJS, XStream and Most.js.

Things to know:

1. It's best if you just use one of the above libraries.
2. If you're not, but sure you never `next`, `error` or `complete` on your observer after `error` or `complete` was called.
3. Likewise, make sure you don't `next`, `error` or `complete` after `unsubscribe` is called on the returned object.

```ts
import Symbol_observable from 'symbol-observable';

someObject[Symbol_observable] = () => {
  return {
    subscribe(observer) {
      const handler = e => observer.next(e);
      someObject.addEventListener('data', handler);
      return {
        unsubscribe() {
          someObject.removeEventListener('data', handler);
        }
      }
    },
    [Symbol_observable]() { return this }
  }
}
```

Often, it's not very hard, but it can get tricky in some cases.

## Related

- [is-observable](https://github.com/sindresorhus/is-observable) - Check if a value is an Observable
- [observable-to-promise](https://github.com/sindresorhus/observable-to-promise) - Convert an Observable to a Promise


## License

MIT © [Sindre Sorhus](https://sindresorhus.com) and [Ben Lesh](https://github.com/benlesh)
