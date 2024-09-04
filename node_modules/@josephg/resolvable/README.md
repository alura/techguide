# Resolvable promise wrapper

This is a tiny promise wrapper which gives you promises which have explicit `promise.resolve()` / `promise.reject()` methods.

Eg:

```javascript
const resolvable = require('resolvable')

const myPromise = resolvable()

;(async () => {
  doThingA()
  await myPromise
  doThingB()
})()

setTimeout(() => myPromise.resolve(), 1000)
```
