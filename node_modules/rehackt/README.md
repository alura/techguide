# Rehackt

> This package is fairly advanced and is only intended for library developers that want to maintain high interop with Next.js server actions.

Rehackt invisibly wraps `react` so that you're able to use shared imports with `react` in server-side Next.js code without throwing an error to your users.

## Explainer

Assume you have the following code in a Next.js codebase:

```tsx
"use client"

import { useFormState } from "react-dom"
import someAction from "./action";

export const ClientComp = () => {
  const [data, action] = useFormState(someAction, "Hello client");

  return <form action={action}>
    <p>{data}</p>
    <button type={"submit"}>Update data</button>
  </form>
}
```

```tsx
"use server"
// action.ts

import {data} from "./shared-code";

export default async function someAction() {
  return "Hello " + data.name;
}
```

```tsx
// shared-code.ts
import {useState} from "react";

export const data = {
  useForm: <T>(val: T) => {
      useState(val)
  },
  name: "server"
}
```

While you're not intending to use `data.useForm` in your `action.ts` server-only file, you'll still receive the following error from Next.js' build process when trying to use this code:

```shell
./src/app/shared-code.ts
ReactServerComponentsError:

You're importing a component that needs useState. It only works in a Client Component but none of its parents are marked with "use client", so they're Server Components by default.
Learn more: https://nextjs.org/docs/getting-started/react-essentials

   ╭─[/src/app/shared-code.ts:1:1]
 1 │ import {useState} from "react";
   ·         ────────
 2 │ 
 3 │ export const data = {
 3 │   useForm: <T>(val: T) => {
   ╰────

Maybe one of these should be marked as a client entry with "use client":
./src/app/shared-code.ts
./src/app/action.ts
```

This is because Next.js statically analyzes usage of `useState` to ensure it's not being utilized in server-only code.

By replacing the import from `react` to `rehackt`:

```tsx
// shared-code.ts
import {useState} from "rehackt";

export const data = {
  useForm: <T>(val: T) => {
      useState(val)
  },
  name: "server"
}
```

You'll no longer see this error.

> Keep in mind, this does not enable usage of `useState` in server-only code, this just removes the error described above.

## Further Reading

The following is a list of reading resources that pertain to this package:

- [My take on the current React & Server Components controversy - Lenz Weber-Tronic](https://phryneas.de/react-server-components-controversy)

- [apollographql/apollo-client#10974](https://github.com/apollographql/apollo-client/issues/10974)

- [TanStack/form#480](https://github.com/TanStack/form/issues/480#issuecomment-1793576645)
