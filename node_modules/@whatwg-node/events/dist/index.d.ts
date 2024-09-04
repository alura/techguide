/// <reference lib="dom" />

declare module "@whatwg-node/events" {
    export const Event: typeof globalThis.Event;
    export const EventTarget: typeof globalThis.EventTarget;
    export const CustomEvent: typeof globalThis.CustomEvent;
}
