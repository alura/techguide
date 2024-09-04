export type NoInfer<T> = [T][T extends any ? 0 : never];

export const {
  hasOwnProperty,
} = Object.prototype;

export const arrayFromSet: <T>(set: Set<T>) => T[] =
  Array.from ||
  function (set) {
    const array: any[] = [];
    set.forEach(item => array.push(item));
    return array;
  };

export type Unsubscribable = {
  unsubscribe?: void | (() => any);
}

export function maybeUnsubscribe(entryOrDep: Unsubscribable) {
  const { unsubscribe } = entryOrDep;
  if (typeof unsubscribe === "function") {
    entryOrDep.unsubscribe = void 0;
    unsubscribe();
  }
}
