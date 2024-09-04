## response-iterator

Creates an async iterator for a variety of inputs in the browser and node. Supports fetch, node-fetch, cross-fetch, axios, got, undici.

### Example 1

```typescript
// import "isomorphic-fetch"; // node only
import responseIterator from 'response-iterator';

const res = await fetch('https://raw.githubusercontent.com/kmalakoff/response-iterator/master/package.json');

let data = '';
for await (const chunk of responseIterator(res)) {
  data += chunk;
}
console.log(JSON.parse(data).name); // "response-iterator"
```

### Example 2

```typescript
import crossFetch from 'cross-fetch';
import responseIterator from 'response-iterator';

const res = await crossFetch('https://raw.githubusercontent.com/kmalakoff/response-iterator/master/package.json');

let data = '';
for await (const chunk of responseIterator(res)) {
  data += chunk;
}
console.log(JSON.parse(data).name); // "response-iterator"
```

### Documentation

[API Docs](https://kmalakoff.github.io/response-iterator/)
