import type { ReactiveVar } from "../../core/index.js";
/**
 * Reads the value of a [reactive variable](https://www.apollographql.com/docs/react/local-state/reactive-variables/) and re-renders the containing component whenever that variable's value changes. This enables a reactive variable to trigger changes _without_ relying on the `useQuery` hook.
 *
 * @example
 * ```jsx
 * import { makeVar, useReactiveVar } from "@apollo/client";
 * export const cartItemsVar = makeVar([]);
 *
 * export function Cart() {
 *   const cartItems = useReactiveVar(cartItemsVar);
 *   // ...
 * }
 * ```
 * @since 3.2.0
 * @param rv - A reactive variable.
 * @returns The current value of the reactive variable.
 */
export declare function useReactiveVar<T>(rv: ReactiveVar<T>): T;
//# sourceMappingURL=useReactiveVar.d.ts.map