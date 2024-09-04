module.exports.Event = globalThis.Event;
if (!module.exports.Event) {
  module.exports.Event = class Event {
    constructor(type, options) {
      this.bubbles = !!options && !!options.bubbles;
      this.cancelable = !!options && !!options.cancelable;
      this.composed = !!options && !!options.composed;
      this.type = type;
    }
  }
}

module.exports.EventTarget = globalThis.EventTarget;
if (!module.exports.EventTarget) {
  module.exports.EventTarget = class EventTarget {
    constructor() {
      this.__listeners = new Map();
    }
    addEventListener(type, listener, options) {
      if (arguments.length < 2) {
        throw new TypeError(
          `TypeError: Failed to execute 'addEventListener' on 'EventTarget': 2 arguments required, but only ${arguments.length} present.`
        );
      }
      const __listeners = this.__listeners;
      const actualType = type.toString();
      if (!__listeners.has(actualType)) {
        __listeners.set(actualType, new Map());
      }
      const listenersForType = __listeners.get(actualType);
      if (!listenersForType.has(listener)) {
        // Any given listener is only registered once
        listenersForType.set(listener, options);
      }
    }
    removeEventListener(type, listener, _options) {
      if (arguments.length < 2) {
        throw new TypeError(
          `TypeError: Failed to execute 'addEventListener' on 'EventTarget': 2 arguments required, but only ${arguments.length} present.`
        );
      }
      const __listeners = this.__listeners;
      const actualType = type.toString();
      if (__listeners.has(actualType)) {
        const listenersForType = __listeners.get(actualType);
        if (listenersForType.has(listener)) {
          listenersForType.delete(listener);
        }
      }
    }
    dispatchEvent(event) {
      if (!(event instanceof module.exports.Event)) {
        throw new TypeError(
          `Failed to execute 'dispatchEvent' on 'EventTarget': parameter 1 is not of type 'Event'.`
        );
      }
      const type = event.type;
      const __listeners = this.__listeners;
      const listenersForType = __listeners.get(type);
      if (listenersForType) {
        for (const [listener, options] of listenersForType.entries()) {
          try {
            if (typeof listener === "function") {
              // Listener functions must be executed with the EventTarget as the `this` context.
              listener.call(this, event);
            } else if (listener && typeof listener.handleEvent === "function") {
              // Listener objects have their handleEvent method called, if they have one
              listener.handleEvent(event);
            }
          } catch (err) {
            // We need to report the error to the global error handling event,
            // but we do not want to break the loop that is executing the events.
            // Unfortunately, this is the best we can do, which isn't great, because the
            // native EventTarget will actually do this synchronously before moving to the next
            // event in the loop.
            setTimeout(() => {
              throw err;
            });
          }
          if (options && options.once) {
            // If this was registered with { once: true }, we need
            // to remove it now.
            listenersForType.delete(listener);
          }
        }
      }
      // Since there are no cancellable events on a base EventTarget,
      // this should always return true.
      return true;
    }
  }
}

module.exports.CustomEvent = globalThis.CustomEvent;
if (!module.exports.CustomEvent) {
  module.exports.CustomEvent = class CustomEvent extends module.exports.Event {
    constructor(type, options) {
      super(type, options);
      this.detail = options && options.detail;
    }
  }
}