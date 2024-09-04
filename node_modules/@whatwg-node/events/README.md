# `@whatwg-node/events`

A ponyfill package for JavaScript [DOM Events Standard](https://dom.spec.whatwg.org/#events). If
your JavaScript environment doesn't implement this standard natively, this package automatically
ponyfills the missing parts, and export them as a module.

## Installation

```bash
yarn add @whatwg-node/events
```

## Usage

```ts
import { Event, EventTarget } from '@whatwg-node/events'

const target = new EventTarget()
target.addEventListener('foo', (event: Event) => {
  console.log(event.type) // foo
})

target.dispatchEvent(new Event('foo'))
```

> If your environment already implements these natively, this package will export the native ones
> automatically.

## Custom Events

```ts
import { CustomEvent, EventTarget } from '@whatwg-node/events'

const target = new EventTarget()
target.addEventListener('foo', (event: CustomEvent) => {
  console.assert(event.detail.foo, 'bar')
})

// `detail` can take any value
target.dispatchEvent(new CustomEvent('foo', { detail: { foo: 'bar' } }))
```

## API

The following classes are exported by this package:

- [Event](https://developer.mozilla.org/en-US/docs/Web/API/Event)
- [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent)
- [EventTarget](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget)
